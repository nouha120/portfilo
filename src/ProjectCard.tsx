import ScreenshotGallery, { imageURL } from "./ScreenshotGallery";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Github, X } from "lucide-react";
import { translate, type Language } from "./i18n";
import { projectDetails, type ProjectScreenshot } from "./projectDetails";

interface Project {
  name: string;
  desc: string;
  status: string;
  points: string[];
  tags: string[];
}

function externalURL(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined; }
  catch { return undefined; }
}

export default function ProjectCard({ project, language, index = 0 }: { project: Project; language: Language; index?: number }) {
  const t = (text: string) => translate(text, language);
  const evidence = projectDetails[project.name];
  const dialog = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<ProjectScreenshot | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const repository = externalURL(evidence?.repositoryUrl ?? "");
  const demo = externalURL(evidence?.demoUrl ?? "");
  const screenshots = evidence?.screenshots.filter(image => !failedImages.includes(image.src)) ?? [];

  useEffect(() => {
    const element = card.current;
    if (!element || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.classList.add("work-enter");
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <article ref={card} className="work-item">
    <div className="work-main">
      <div className="work-summary-content">
      <div className="work-identity"><p className="work-number"><span>{String(index + 1).padStart(2, "0")}</span> / {project.name.split(" — ")[0].toUpperCase()}</p><span className={project.status === "Completed" ? "work-status complete" : "work-status"}><span aria-hidden="true" />{t(project.status)}</span></div>
      <h3>{t(project.name).replace(/^[^—]+—\s*/, "")}</h3>
      <p className="work-description">{t(project.desc)}</p>
      <div className="work-tags">{project.tags.map(tag => <span key={tag}>{t(tag)}</span>)}</div>
      <div className="work-links">{repository ? <a className="work-repository" href={repository} target="_blank" rel="noopener noreferrer"><Github size={17} />{t("View repository")}<ArrowUpRight size={16} /></a> : <span className="work-private">{t("Repository link not shared yet.")}</span>}{demo && <a href={demo} target="_blank" rel="noopener noreferrer">{t("Live demo")}<ArrowUpRight size={16} /></a>}</div>
      </div>
    </div>
    <details className="work-expand">
      <summary><span className="when-collapsed">{t("See more")}</span><span className="when-expanded">{t("See less")}</span><ChevronDown size={17} /></summary>
      <div className="work-notes">
      {screenshots.length > 0 && <ScreenshotGallery images={screenshots} language={language} onSelect={image => { setSelected(image); dialog.current?.showModal(); }} onError={src => setFailedImages(previous => [...previous, src])} />}
      <div className="work-outcome"><h4>{t("Outcome")}</h4><p>{t(evidence?.outcome ?? project.desc)}</p></div>
      {evidence?.metrics.length ? <dl className="work-metrics">{evidence.metrics.map(metric => <div key={metric.label}><dt>{t(metric.label)}</dt><dd>{metric.value}<small>{t(metric.context)}</small></dd></div>)}</dl> : <p className="work-metrics-note">{t(project.status === "Completed" ? "Measured scores have not been shared here yet." : "Benchmarks pending while the project is in development.")}</p>}
      <div className="work-contribution"><h4>{t("My contribution")}</h4><ul>{project.points.map(point => <li key={point}>{t(point)}</li>)}</ul>{evidence?.challenge && <><h4>{t("The challenge")}</h4><p>{t(evidence.challenge)}</p></>}</div>
    </div>

    </details>
    <dialog ref={dialog} className="screenshot-dialog" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-label={selected ? t(selected.alt) : t("Project screenshot")}><div><button type="button" className="icon-button" autoFocus aria-label={t("Close screenshot")} onClick={() => dialog.current?.close()}><X size={20} /></button>{selected && <figure><img src={imageURL(selected.src)} alt={t(selected.alt)} />{selected.caption && <figcaption>{t(selected.caption)}</figcaption>}</figure>}</div></dialog>
  </article>;
}
