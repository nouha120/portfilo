import AboutPortrait from "./AboutPortrait";
import ProjectCarousel from "./ProjectCarousel";
import ProjectCard from "./ProjectCard";
import { profile } from "./profile";
import { translate, readPreference, savePreference, type Language, type Theme } from "./i18n";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Shield, Brain, Code2, Award, Languages, ArrowUpRight, Menu, X, Fingerprint, Copy, Check, ArrowUp, Sun, Moon, Monitor, Download, FileText, Linkedin, Github, ExternalLink } from "lucide-react";

const nav = ["about", "experience", "projects", "skills", "education", "cv", "contact"];

const experience = [
  {
    role: "Intelligent Mobile Application Development",
    org: "DataDoit",
    date: "Feb 2025 – May 2025",
    points: [
      "Designed and developed a cross-platform mobile app using Flutter.",
      "Implemented authentication, database and notifications with Firebase.",
      "Built backend services with Django REST Framework.",
      "Integrated AI models to power intelligent features.",
    ],
  },
  {
    role: "Web Application Development — E-learning Platform",
    org: "Haltone Technologies",
    date: "Jul 2024 – Aug 2024",
    points: [
      "Contributed to an educational web app using Symfony and PHP.",
      "Designed user interfaces with HTML, CSS and JavaScript.",
      "Integrated dynamic pages and server-side logic.",
    ],
  },
];

const projects = [
  {
    name: "SentinelAI — Network Intrusion Detection",
    desc: "Machine-learning classifier that labels network connections as normal or malicious using the NSL-KDD dataset.",
    tags: ["Python", "Pandas", "NumPy", "Scikit-learn"],
    points: [
      "Compares Logistic Regression and Random Forest",
      "Feature selection & hyperparameter tuning",
      "Class imbalance & threshold optimization",
      "Precision, recall, F1, confusion matrices, ROC",
    ],
    status: "Completed",
  },
  {
    name: "SentinelAI — Hybrid Intrusion Detection System",
    desc: "Research project combining Machine Learning, Deep Learning and Anomaly Detection for network traffic analysis.",
    tags: ["ML", "Deep Learning", "Anomaly Detection"],
    points: [
      "Supervised classification of known attacks",
      "Deep architectures for traffic analysis",
      "Anomaly detection for unseen attacks",
      "Benchmarking detection & false-positive rates",
    ],
    status: "In development",
  },
  {
    name: "PhishLens — NLP-Assisted Phishing Analysis",
    desc: "An early-stage project exploring NLP and language models to analyse suspicious emails and explain possible phishing signals.",
    tags: ["Python", "NLP", "LLM", "Cybersecurity"],
    points: [
      "Planned: prepare a labelled phishing and legitimate email dataset",
      "Planned: establish a text-classification baseline",
      "Planned: explore LLM explanations grounded in email content",
      "Planned: evaluate precision, recall and false positives on held-out emails",
    ],
    status: "Just started",
  },
];

const skills = [
  { icon: Code2, title: "Languages", items: ["Python", "Java", "PHP", "JavaScript"] },
  { icon: Code2, title: "Software & Web", items: ["Flutter", "Django REST", "Symfony", "HTML", "CSS"] },
  { icon: Brain, title: "Data Science & AI", items: ["Machine Learning", "Data Analysis", "Pandas", "NumPy", "Scikit-learn"] },
  { icon: Shield, title: "Cybersecurity", items: ["Network Security", "Intrusion Detection", "Vulnerability Analysis", "SIEM"] },
  { icon: Code2, title: "Databases & Cloud", items: ["SQL", "Firebase"] },
  { icon: Code2, title: "Tools", items: ["Linux", "Git", "GitHub", "VS Code", "Jupyter"] },
];

const education = [
  { title: "Master's Degree in Data Science", school: "ISLAI Béja", date: "2025 – Present" },
  { title: "Bachelor's in Computer Science — Software Engineering", school: "ISLAI Béja", date: "2022 – 2025" },
  { title: "Baccalaureate", school: "Lycée de Bou Argoub", date: "2022" },
];

const certs = [
  "Cyber Security Bootcamp — CompTIA Security+ (SY0-701)",
  "Cisco Cybersecurity Certifications",
  "Python Certificate",
  "Smart City AI Challenge",
];

function SectionTitle({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return <div className="section-title"><p className="section-kicker"><span>{n}</span> / {label}</p><h2>{children}<span className="title-dot">.</span></h2></div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preferenceOpen, setPreferenceOpen] = useState<"language" | "theme" | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("djobinouha130@gmail.com");
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  useEffect(() => {
    if (copyStatus !== "copied") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 3000);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) + 80;
      let current = "";
      for (const id of nav) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= threshold) current = id;
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = "contact";
      setActiveSection(current);
    };
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); setPreferenceOpen(null); } };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  const [language, setLanguage] = useState<Language>(() => readPreference("portfolio-language", ["en", "fr", "ar"], "en"));
  const [theme, setTheme] = useState<Theme>(() => readPreference("portfolio-theme", ["dark", "light", "system"], "system"));
  const t = (text: string) => translate(text, language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = `${t("Nouha Djobbi")} | ${t("Data Science & AI")}`;
    savePreference("portfolio-language", language);
  }, [language]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#0b1018" : "#dfeae3");
    };
    applyTheme();
    savePreference("portfolio-theme", theme);
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(".preferences")) setPreferenceOpen(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  useEffect(() => {
    const grid = document.querySelector<HTMLElement>(".case-study-grid");
    if (!grid) return;
    const summaries = [...grid.querySelectorAll<HTMLElement>(".work-summary-content")];
    const equalize = () => {
      const tallest = Math.ceil(Math.max(0, ...summaries.map(element => element.getBoundingClientRect().height)));
      grid.style.setProperty("--project-summary-height", `${tallest}px`);
    };
    equalize();
    const observer = new ResizeObserver(equalize);
    summaries.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [language]);

  return <div className="min-h-screen bg-background text-foreground">
    <a className="skip-link" href="#content">{t("Skip to content")}</a>
    <header className="site-header">
      <div className="nav-shell">
        <a href="#top" className="brand"><span className="brand-symbol">n<span>.</span></span><span>nouha<span className="text-primary">/</span>djobbi</span></a>
        <nav id="main-navigation" aria-label={t("Main navigation")} className={menuOpen ? "main-nav is-open" : "main-nav"}>{nav.map(n => <a key={n} href={`#${n}`} aria-current={activeSection === n ? "location" : undefined} onClick={() => setMenuOpen(false)}>{t(n)}</a>)}</nav>
        <div className="preferences">
          <button type="button" className="icon-button" title={t("Language")} aria-label={t("Language")} aria-expanded={preferenceOpen === "language"} aria-controls="language-options" onClick={() => setPreferenceOpen(preferenceOpen === "language" ? null : "language")}><Languages size={19} /></button>
          <button type="button" className="icon-button" title={t("Theme")} aria-label={`${t("Theme")}: ${t(theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System")}`} aria-expanded={preferenceOpen === "theme"} aria-controls="theme-options" onClick={() => setPreferenceOpen(preferenceOpen === "theme" ? null : "theme")}>{theme === "dark" ? <Moon size={19} /> : theme === "light" ? <Sun size={19} /> : <Monitor size={19} />}</button>
          {preferenceOpen === "language" && <div id="language-options" className="preference-popover language-popover" role="group" aria-label={t("Language")}><div className="preference-heading"><Languages size={15} /><span>{t("Language")}</span></div>{([["en", "English"], ["fr", "Français"], ["ar", "العربية"]] as const).map(([code,label]) => <button key={code} type="button" aria-pressed={language === code} onClick={() => { setLanguage(code); setPreferenceOpen(null); }}><span className="option-label" lang={code}>{label}</span><span className="option-check" aria-hidden="true">{language === code && <Check size={14} />}</span></button>)}</div>}
          {preferenceOpen === "theme" && <div id="theme-options" className="preference-popover theme-popover" role="group" aria-label={t("Theme")}><div className="preference-heading"><Monitor size={15} /><span>{t("Theme")}</span></div>{([["dark", "Dark", Moon], ["light", "Light", Sun], ["system", "System", Monitor]] as const).map(([mode,label,Icon]) => <button key={mode} type="button" aria-pressed={theme === mode} onClick={() => { setTheme(mode); setPreferenceOpen(null); }}><Icon size={16} aria-hidden="true" /><span className="option-label">{t(label)}</span><span className="option-check" aria-hidden="true">{theme === mode && <Check size={14} />}</span></button>)}</div>}

        </div>
        <button className="nav-toggle" aria-label={t(menuOpen ? "Close menu" : "Open menu")} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </header>
    <main id="top">
      <section id="content" className="hero-section">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="availability"><span /> {t("OPEN TO IDEAS & COLLABORATIONS")}</p>
            <p className="hero-intro">{t("Hello, I'm Nouha Djobbi")} <span className="hello-star">&#10035;</span></p>
            <h1>{t("Engineering")}<br />{t("a")} <span>{t("smarter")}</span><br />{t("tomorrow")}<span className="hero-period">.</span></h1>
            <p className="hero-description">{t("Software engineer. Data science explorer.")}<br />{t("Building intelligent solutions for a more secure world.")}</p>
            <div className="hero-buttons"><a href="#projects" className="hero-primary">{t("Explore my work")} <ArrowUpRight size={19} /></a><a href="mailto:djobinouha130@gmail.com" className="hero-secondary">{t("Let's connect")} <ArrowUpRight size={17} /></a></div>
            <div className="hero-footnote"><MapPin size={13} /> {t("Tunisia")} <span>/</span> {t("Data Science & AI")} <span>/</span> {t("Cybersecurity")}</div>
          </div>
          <div className="intelligence-visual" role="img" aria-label={t("Abstract luminous green sphere connecting artificial intelligence, data science and cybersecurity")}>
            <div className="visual-grid" /><div className="visual-halo" />
            <div className="sphere"><div className="sphere-latitude latitude-one" /><div className="sphere-latitude latitude-two" /><div className="sphere-latitude latitude-three" /><div className="sphere-meridian meridian-one" /><div className="sphere-meridian meridian-two" /><div className="sphere-meridian meridian-three" /><div className="sphere-equator" /></div>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="linear-label-track track-ai"><span className="label-travel-point" aria-hidden="true" /><div className="floating-label label-ai"><Brain size={19} /><div><span>{t("INTELLIGENCE")}</span><strong>{t("AI & machine learning")}</strong></div></div></div>
            <div className="linear-label-track track-security"><span className="label-travel-point" aria-hidden="true" /><div className="floating-label label-security"><Fingerprint size={22} /><div><span>{t("PROTECTION")}</span><strong>{t("Security by design")}</strong></div></div></div>
            <span className="visual-cross cross-one">+</span><span className="visual-cross cross-two">+</span>
            <div className="visual-signature"><span className="signal-dot" /> {t("CURIOUS MIND. CONNECTED IDEAS.")}</div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-32 px-6 py-24">
        <section id="about" className="scroll-mt-24"><SectionTitle label={t("THE PORTFOLIO")} n="01">{t("About Me")}</SectionTitle><div className="about-layout grid gap-10 md:grid-cols-3">
          <div className="about-copy space-y-4 text-lg text-muted-foreground md:col-span-2"><p>{t("I combine a software development background with an interest in intelligent systems, data analysis, and cybersecurity. Through studies, internships and personal projects I've built practical skills in programming, app development, machine learning and network intrusion detection.")}</p><p>{t("My current focus is on")} <span className="text-primary">{t("AI-powered cybersecurity")}</span>{t(", exploring machine learning techniques, and sharpening my skills through hands-on work — including CTFs, TryHackMe and Hack The Box labs.")}</p><div className="about-inline-details"><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{t("Bou Argoub, Nabeul, TN")}</p><p className="flex items-center gap-2"><Languages className="h-4 w-4 text-primary" />{t("Arabic · French · English")}</p><p className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />{t("CTF enthusiast")}</p></div></div>
          <AboutPortrait language={language} />
        </div>
          <aside className="current-focus" aria-labelledby="focus-title">
            <div className="focus-heading"><div><h3 id="focus-title">{t("Currently exploring")}</h3><p>{t("A closer look at what keeps me curious.")}</p></div><span className="signal-dot" aria-hidden="true" /></div>
            <div className="focus-cards">
              <article><Brain size={22} aria-hidden="true" /><h4>{t("Hybrid intrusion detection")}</h4><p>{t("Combining machine learning, deep learning and anomaly detection in SentinelAI.")}</p><a href="#projects">{t("See related projects")} <ArrowUpRight size={14} /></a></article>
              <article><Shield size={22} aria-hidden="true" /><h4>{t("Hands-on security")}</h4><p>{t("Sharpening network security skills through CTFs, TryHackMe and Hack The Box labs.")}</p></article>
              <article><Code2 size={22} aria-hidden="true" /><h4>{t("Data science foundations")}</h4><p>{t("Deepening my knowledge through a Master's in Data Science at ISLAI Béja.")}</p></article>
            </div>
          </aside>
        </section>
        <section id="experience" className="scroll-mt-24"><SectionTitle label={t("THE PORTFOLIO")} n="02">{t("Experience")}</SectionTitle><div className="space-y-8 border-l border-border pl-8">{experience.map(e => <div key={e.org} className="relative"><span className="absolute -left-[37px] top-2 h-3 w-3 rounded-full bg-primary shadow-glow" /><p className="font-mono text-sm text-accent">{t(e.date)}</p><h3 className="mt-1 text-xl font-semibold">{t(e.role)} <span className="text-primary">@ {e.org}</span></h3><ul className="mt-3 space-y-2 text-muted-foreground">{e.points.map(p => <li key={p}>&#9657; {t(p)}</li>)}</ul></div>)}</div></section>
        <section id="projects" className="scroll-mt-24"><SectionTitle label={t("THE PORTFOLIO")} n="03">{t("Featured Projects")}</SectionTitle><ProjectCarousel language={language}>{projects.map((project, index) => <ProjectCard key={project.name} project={project} language={language} index={index} />)}</ProjectCarousel></section>
        <section id="skills" className="scroll-mt-24"><SectionTitle label={t("THE PORTFOLIO")} n="04">{t("Technical Skills")}</SectionTitle><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{skills.map(s => <div key={s.title} className="rounded border border-border bg-card p-6"><h3 className="mb-4 flex items-center gap-2 font-mono text-sm text-primary"><s.icon className="h-4 w-4" />{t(s.title)}</h3><div className="flex flex-wrap gap-2">{s.items.map(i => <span key={i} className="skill-chip rounded bg-secondary px-3 py-1 text-sm" tabIndex={0}>{t(i)}</span>)}</div></div>)}</div></section>
        <section id="education" className="scroll-mt-24"><SectionTitle label={t("THE PORTFOLIO")} n="05">{t("Education & Certifications")}</SectionTitle><div className="grid gap-10 md:grid-cols-2"><div className="space-y-6">{education.map(e => <div key={e.title}><p className="font-mono text-sm text-accent">{t(e.date)}</p><h3 className="text-lg font-semibold">{t(e.title)}</h3><p className="text-muted-foreground">{t(e.school)}</p></div>)}</div><ul className="space-y-3">{certs.map(c => <li key={c} className="flex items-start gap-3 rounded border border-border bg-card p-4"><Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{t(c)}</li>)}</ul></div></section>
        <section id="cv" className="cv-section scroll-mt-24" aria-labelledby="cv-title">
          <div><p className="section-kicker">06 / {t("My CV")}</p><h2 id="cv-title">{t("The essentials, in one document.")}</h2><p className="cv-description">{t("Download my CV for an overview of my experience, education and technical skills.")}</p></div>
          <div className="cv-document"><FileText size={42} strokeWidth={1.2} aria-hidden="true" /><div><h3>{t("Nouha Djobbi")}</h3><p>{t("PDF · English")}</p></div><div className="cv-actions"><a className="icon-button" href={profile.cvPath} target="_blank" rel="noopener noreferrer" title={t("View CV")} aria-label={t("View CV")}><ExternalLink size={19} /></a><a className="icon-button download-button" href={profile.cvPath} download="Nouha-Djobbi-CV.pdf" title={t("Download CV")} aria-label={t("Download CV")}><Download size={20} /></a></div></div>
        </section>
        <section id="contact" className="contact-panel scroll-mt-24 text-center"><p className="font-mono text-primary">{t("07. What's next?")}</p><h2 className="mt-4 text-4xl font-bold md:text-5xl">{t("Let's build something")}<br /><span className="text-primary">{t("meaningful.")}</span></h2><p className="mx-auto mt-6 max-w-xl text-muted-foreground">{t("Open to internships, collaborations and projects in Data Science, AI, Software Engineering and Cybersecurity.")}</p><div className="mt-10 flex flex-col items-center justify-center gap-4 font-mono sm:flex-row"><a href="mailto:djobinouha130@gmail.com" className="flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"><Mail className="h-4 w-4" /><bdi>djobinouha130@gmail.com</bdi></a><a href="tel:+21622362591" className="flex items-center gap-2 rounded border border-primary px-6 py-3 text-sm text-primary"><Phone className="h-4 w-4" /><bdi dir="ltr">+216 22 362 591</bdi></a></div><div className="copy-email"><span>{t("Prefer to copy the address?")}</span><button className="icon-button" type="button" title={t(copyStatus === "copied" ? "Email copied" : "Copy email")} aria-label={t(copyStatus === "copied" ? "Email copied" : "Copy email")} onClick={copyEmail}>{copyStatus === "copied" ? <Check size={15} /> : <Copy size={15} />}</button><p role="status" aria-live="polite">{copyStatus === "error" ? t("Couldn't copy. Use the email link above or select the address.") : copyStatus === "copied" ? t("Email copied") : ""}</p></div><div className="social-links" aria-label={t("Let's connect")}>{([["LinkedIn", profile.linkedin, Linkedin], ["GitHub", profile.github, Github]] as const).map(([label,url,Icon]) => url ? <a key={label} className="icon-button" href={url} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}><Icon size={20} /></a> : <button key={label} className="icon-button" type="button" disabled title={`${label}: ${t("Profile coming soon")}`} aria-label={`${label}: ${t("Profile coming soon")}`}><Icon size={20} /></button>)}</div></section>
      </div>
    </main>
      <div className="focus-strip"><span>{t("DATA SCIENCE")}</span><span>&#10035;</span><span>{t("ARTIFICIAL INTELLIGENCE")}</span><span>&#10035;</span><span>{t("CYBERSECURITY")}</span><span>&#10035;</span><span>{t("SOFTWARE ENGINEERING")}</span></div>
    <footer className="minimal-footer"><a href="#top" className="minimal-footer-name">{t("Nouha Djobbi")}<span>.</span></a><p>&copy; {new Date().getFullYear()}</p><a href="#top" className="minimal-footer-top" aria-label={t("Back to top")} title={t("Back to top")}><ArrowUp size={17} /></a></footer>
  </div>;
}
