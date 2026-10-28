import { useId, useState } from "react";
import { profile } from "./profile";
import { imageURL } from "./ScreenshotGallery";
import { translate, type Language } from "./i18n";

// Generate a smooth, original silhouette from control points rather than an image.
function createPortraitShape() {
  const points = [
    [0.48, 0.055], [0.71, 0.045], [0.89, 0.16],
    [0.96, 0.36], [0.92, 0.60], [0.80, 0.81],
    [0.61, 0.95], [0.37, 0.94], [0.16, 0.80],
    [0.055, 0.59], [0.065, 0.36], [0.23, 0.15],
  ];
  const midpoint = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = midpoint(points[points.length - 1], points[0]);
  return `M ${start.join(" ")} ` + points.map((point, index) => {
    const end = midpoint(point, points[(index + 1) % points.length]);
    return `Q ${point.join(" ")} ${end.join(" ")}`;
  }).join(" ") + " Z";
}

const portraitShape = createPortraitShape();

export default function AboutPortrait({ language }: { language: Language }) {
  const [failed, setFailed] = useState(false);
  const shapeId = `portrait-shape-${useId().replace(/:/g, "")}`;
  const hasPhoto = Boolean(profile.photoPath) && !failed;
  return <svg className="portrait-silhouette" viewBox="0 0 1 1.08" role={hasPhoto ? "img" : undefined} aria-label={hasPhoto ? translate("Portrait of Nouha Djobbi", language) : undefined} aria-hidden={hasPhoto ? undefined : true}>
    <defs><clipPath id={shapeId} clipPathUnits="userSpaceOnUse"><path d={portraitShape} /></clipPath></defs>
    <path className="portrait-offset-outline" d={portraitShape} transform="translate(.022 .022)" />
    <path className="portrait-silhouette-fill" d={portraitShape} />
    {hasPhoto && <image href={imageURL(profile.photoPath)} x="0.035" y="0.025" width="0.93" height="0.93" preserveAspectRatio="xMidYMid meet" clipPath={`url(#${shapeId})`} onError={() => setFailed(true)} />}
    <path className="portrait-fine-outline" d={portraitShape} />
  </svg>;
}
