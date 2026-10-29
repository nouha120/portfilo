import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { translate, type Language } from "./i18n";

export default function ProjectCarousel({ children, language }: { children: ReactNode; language: Language }) {
  const track = useRef<HTMLDivElement>(null);
  const targets = useRef<number[]>([0]);
  const drag = useRef<{ id: number; x: number; y: number; scroll: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const touchStart = useRef<{ x: number; y: number; scroll: number } | null>(null);
  const [page, setPage] = useState({ active: 0, count: 1 });
  const t = (value: string) => translate(value, language);
  const rtl = language === "ar";

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    let previousWidth = -1;
    let disposed = false;
    const alignCards = () => {
      if (disposed) return;
      // Match each summary row without clipping long titles or translated copy.
      for (const selector of [".work-identity", ".work-main h3", ".work-description", ".work-tags", ".work-links"]) {
        const rows = [...element.querySelectorAll<HTMLElement>(selector)];
        rows.forEach(row => { row.style.minHeight = "0"; });
        const height = Math.ceil(Math.max(0, ...rows.map(row => row.getBoundingClientRect().height)));
        rows.forEach(row => { row.style.minHeight = `${height}px`; });
      }
    };
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === previousWidth) return;
      previousWidth = entry.contentRect.width;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(alignCards);
    });
    observer.observe(element);
    void document.fonts.ready.then(alignCards);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [language]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const position = Math.abs(element.scrollLeft);
      const cards = [...element.querySelectorAll<HTMLElement>(".work-item")];
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const maximum = Math.max(0, element.scrollWidth - element.clientWidth);
      const positions = cards.map((_, index) => Math.min(index * ((cards[0]?.getBoundingClientRect().width ?? 0) + gap), maximum));
      targets.current = positions.filter((value, index) => index === 0 || value - positions[index - 1] > 3);
      if (!targets.current.length) targets.current = [0];
      let active = 0;
      targets.current.forEach((target, index) => {
        if (Math.abs(target - position) < Math.abs(targets.current[active] - position)) active = index;
      });
      setPage({ active, count: targets.current.length });
    };
    element.scrollTo({ left: 0, behavior: "instant" });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [language]);

  function goTo(index: number) {
    const element = track.current;
    if (!element) return;
    const count = targets.current.length;
    const target = targets.current[((index % count) + count) % count];
    element.scrollTo({ left: (rtl ? -1 : 1) * target, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false;
    if (event.pointerType === "touch" || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("a,button,summary,input,select,textarea,dialog")) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, scroll: event.currentTarget.scrollLeft, moved: false };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const distance = event.clientX - gesture.x;
    if (!gesture.moved) {
      if (Math.abs(distance) < 6 || Math.abs(distance) < Math.abs(event.clientY - gesture.y)) return;
      gesture.moved = true;
      if (event.pointerType === "touch") return;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add("is-dragging");
      window.getSelection()?.removeAllRanges();
    }
    if (event.pointerType === "touch") return;
    event.preventDefault();
    event.currentTarget.scrollLeft = gesture.scroll - distance;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    drag.current = null;
    suppressClick.current = gesture.moved;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (event.type === "pointerup" && gesture.moved && targets.current.length > 1) {
      const distance = (event.clientX - gesture.x) * (rtl ? 1 : -1);
      const maximum = event.currentTarget.scrollWidth - event.currentTarget.clientWidth;
      const startedAtEnd = Math.abs(gesture.scroll) >= maximum - 3;
      const startedAtBeginning = Math.abs(gesture.scroll) < 3;
      if (startedAtEnd && distance > 45) goTo(0);
      else if (startedAtBeginning && distance < -45) goTo(targets.current.length - 1);
    }
  }

  return <div className="project-carousel">
    <p id="project-swipe-hint" className="sr-only">{t("Swipe, drag or use the dots to explore")}</p>
    <div id="project-track" ref={track} className="case-study-grid project-track" role="region" aria-label={t("Featured Projects")} aria-describedby="project-swipe-hint" tabIndex={0} onTouchStart={event => {
      const touch = event.touches[0];
      if (!touch || event.touches.length !== 1 || (event.target instanceof Element && event.target.closest("a,button,summary,input,select,textarea,dialog"))) { touchStart.current = null; return; }
      touchStart.current = { x: touch.clientX, y: touch.clientY, scroll: event.currentTarget.scrollLeft };
    }} onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={event => {
      const start = touchStart.current;
      touchStart.current = null;
      const touch = event.changedTouches[0];
      if (!start || !touch || targets.current.length < 2) return;
      const dx = touch.clientX - start.x;
      if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(touch.clientY - start.y)) return;
      const distance = dx * (rtl ? 1 : -1);
      const maximum = event.currentTarget.scrollWidth - event.currentTarget.clientWidth;
      if (Math.abs(start.scroll) >= maximum - 3 && distance > 45) goTo(0);
      else if (Math.abs(start.scroll) < 3 && distance < -45) goTo(targets.current.length - 1);
    }} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onPointerLeave={event => { if (!drag.current?.moved) drag.current = null; }} onDragStart={event => event.preventDefault()} onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>{children}</div>
    <div className="carousel-pagination">
      <div className="carousel-dots" role="group" aria-label={t("Project pages")}>{Array.from({ length: page.count }, (_, index) => <button type="button" key={index} aria-label={`${t("Go to project page")} ${index + 1}`} aria-current={page.active === index ? "true" : undefined} aria-controls="project-track" onClick={() => goTo(index)}><span /></button>)}</div>
    </div>
  </div>;
}
