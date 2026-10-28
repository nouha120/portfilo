# Nouha Djobbi — React Portfolio

Standalone React + TypeScript + Vite version of the Lovable portfolio. It keeps the original visual design and content without requiring Lovable or TanStack Start.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. In this folder, run `npm install`.
3. Run `npm start` (or `npm run dev`).
4. Open the local URL printed in the terminal, typically `http://localhost:5173`.

## Build for hosting

Run `npm run build`. The static site is generated in `dist/` and can be deployed on Netlify, Vercel, GitHub Pages (with the correct base URL), or other static hosting providers.

## Edit content

Change `src/App.tsx` for the portfolio sections, contact information, and projects. Change `src/styles.css` for theme and design. The page title and SEO metadata are in `index.html`.

## CV and social profiles

The CV section downloads `public/cv/Nouha-Djobbi-CV.pdf`. A starter PDF is included using the portfolio's existing English content. Review it before sharing. Replace that PDF with your own CV using the same filename, or update `cvPath` in `src/profile.ts`.

To rebuild the starter CV after updating the English portfolio data, run `python scripts/generate_cv.py`. This overwrites the included starter PDF, so do not run it after replacing the file with your own CV.

Set `linkedin` and `github` in `src/profile.ts` to your full HTTPS profile URLs. The icons stay disabled until URLs are supplied.

## Installable web app and offline access

The production build includes a web app manifest, app icons and a service worker. Deploy `dist/` on HTTPS (or use localhost) to enable installation and offline access. In supported browsers, an install button appears in the footer when the browser offers installation. On iPhone/iPad, use Safari's Share menu and Add to Home Screen.

After the first successful online visit, the portfolio and included CV are cached for offline use. Email, phone calls, external profiles and the initial download of updated content still require the appropriate device/network services. The service worker runs only in production; `npm run dev` stays uncached. Use `npm run build` and `npm run preview` to check the production app locally.

## Project screenshots, code and results

Edit `src/projectDetails.ts` to enrich each project. Keep the project-name keys aligned with `src/App.tsx`.

- Set `repositoryUrl` to the full public GitHub repository URL. Set `demoUrl` only if a real demo exists.
- Put screenshots in `public/projects/` and add `{ src: "projects/your-image.png", alt: "What is visible", caption: "What this demonstrates" }` to the project's `screenshots` array. Images support a scrollable gallery and an enlarged preview; Escape closes the preview. Add French/Arabic copy to `src/i18n.ts` for custom captions and descriptions.
- Add real results to `metrics` using `{ label: "F1", value: "your verified score", context: "dataset, held-out split and model" }`. Include enough evaluation context to make results interpretable.
- Review `challenge`, `outcome` and the contribution bullets against your actual work before publishing.

Until screenshots and links are supplied, cards show a labelled architecture overview and an explicit repository-unavailable note. No screenshots or numerical results are fabricated.

## Add your portrait and project images

1. Place your portrait in `public/images/`, e.g. `nouha.jpg`, and set `photoPath: "images/nouha.jpg"` in `src/profile.ts`. The About Me frame displays your initials until a real photo is configured. Set `object-position` in `.about-portrait > img` if the photo needs different cropping.
2. Place real screenshots in `public/projects/`, then add their paths, alt text and captions to each project's `screenshots` array in `src/projectDetails.ts`. Screenshots appear above the project title, support mouse dragging and touch swiping, and open larger on click. Each gallery scrolls independently of the outer project carousel.
3. Redeploy after adding files; this static site does not include a visitor-facing upload interface.
