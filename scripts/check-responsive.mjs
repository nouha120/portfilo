import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const profile = await mkdtemp(join(tmpdir(), 'portfolio-mobile-'));
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9223',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let page;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { page = await (await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })).json(); break; }
    catch { await delay(250); }
  }
  if (!page) throw new Error('Chrome debugging endpoint unavailable');
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
    }
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await call('Page.enable');
  await call('Page.navigate', { url: process.env.PREVIEW_URL || 'http://localhost:5173/' });
  await delay(1500);
  const results = [];
  for (const language of ['en', 'fr', 'ar']) {
    await evaluate(`localStorage.setItem('portfolio-language', '${language}'); location.reload()`);
    await delay(800);
    for (const width of [320, 375, 390, 430, 768]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true });
      await delay(250);
      await evaluate(`(() => { const link = document.querySelector('.hero-secondary'); if (link?.getAttribute('aria-expanded') === 'false') link.click(); const toggle = document.querySelector('.nav-toggle'); if (toggle?.getAttribute('aria-expanded') === 'false') toggle.click(); })()`);
      await delay(150);
      results.push(await evaluate(`(() => {
        const cards = [...document.querySelectorAll('.work-item')];
        return {language: document.documentElement.lang, width: innerWidth,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          cardHeights: cards.map(card => Math.round(card.getBoundingClientRect().height)),
          formVisible: !!document.querySelector('.recruiter-contact')?.getBoundingClientRect().width,
          inputFontSize: getComputedStyle(document.querySelector('#contact-name')).fontSize,
          outside: [...document.querySelectorAll('h1,.nav-shell,.contact-panel,.recruiter-contact')].filter(el => { const r = el.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1); }).map(el => el.className)
        };
      })()`));
    }
  }
  console.log(JSON.stringify(results, null, 2));
  if (results.some(result => result.overflow || result.outside.length)) process.exitCode = 1;
  await call('Browser.close');
} finally {
  socket?.close();
  browser.kill();
  await delay(300);
  await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
