import { useRef, useState, type PointerEvent } from "react";
import { Maximize2 } from "lucide-react";
import { translate, type Language } from "./i18n";
import type { ProjectScreenshot } from "./projectDetails";

export function imageURL(path: string) {
  return path.startsWith("https://") ? path : `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export default function ScreenshotGallery({ images, language, onSelect, onError }: {
  images: ProjectScreenshot[];
  language: Language;
  onSelect(image: ProjectScreenshot): void;
  onError(src: string): void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; left: number; moved: boolean } | null>(null);
  const ignoreClick = useRef(false);
  const [active, setActive] = useState(0);
  const t = (text: string) => translate(text, language);

  function finish(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    ignoreClick.current = start.moved;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <div className="screenshot-gallery" onPointerDown={event => event.stopPropagation()} onTouchStart={event => event.stopPropagation()} onTouchEnd={event => event.stopPropagation()}>
    <div ref={track} className="screenshot-track" role="region" aria-label={t("Project screenshots")} tabIndex={0}
      onPointerDown={event => {
        ignoreClick.current = false;
        if (event.pointerType === "touch" || event.button !== 0) return;
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, moved: false };
      }}
      onPointerMove={event => {
        const start = gesture.current;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        if (!start.moved) {
          if (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(event.clientY - start.y)) return;
          start.moved = true;
          event.currentTarget.classList.add("is-dragging");
          event.currentTarget.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
        event.currentTarget.scrollLeft = start.left - dx;
      }}
      onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
      onPointerLeave={() => { if (!gesture.current?.moved) gesture.current = null; }}
      onDragStart={event => event.preventDefault()}
      onClickCapture={event => { if (ignoreClick.current) { event.preventDefault(); event.stopPropagation(); ignoreClick.current = false; } }}
      onScroll={event => setActive(Math.min(images.length - 1, Math.round(Math.abs(event.currentTarget.scrollLeft) / event.currentTarget.clientWidth)))}>
      {images.map(image => <figure key={image.src}><button type="button" className="screenshot-button" aria-label={`${t("Enlarge screenshot")}: ${t(image.alt)}`} onClick={() => onSelect(image)}><img src={imageURL(image.src)} alt={t(image.alt)} loading="lazy" draggable={false} onError={() => onError(image.src)} /><span><Maximize2 size={15} /></span></button>{image.caption && <figcaption>{t(image.caption)}</figcaption>}</figure>)}
    </div>
    {images.length > 1 && <div className="screenshot-dots" role="group" aria-label={t("Project screenshots")}>{images.map((image, index) => <button type="button" key={image.src} aria-label={`${t("View screenshot")} ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => track.current?.scrollTo({ left: (language === "ar" ? -1 : 1) * index * track.current.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><span /></button>)}</div>}
  </div>;
}
