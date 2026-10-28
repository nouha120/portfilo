import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { translate, type Language } from "./i18n";

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallApp({ language }: { language: Language }) {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const available = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const installed = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  if (!prompt) return null;
  async function install() {
    if (!prompt || busy) return;
    setBusy(true);
    try { await prompt.prompt(); await prompt.userChoice; }
    finally { setPrompt(null); setBusy(false); }
  }
  return <button type="button" className="install-app" disabled={busy} onClick={() => { void install().catch(() => {}); }}><Download size={15} />{translate("Install portfolio app", language)}</button>;
}
