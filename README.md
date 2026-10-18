# Dr. Ananya's Dental & Orthodontic Clinic

A fully **static** website (HTML, CSS, vanilla JS). No build step, no server, no dependencies.

## Why static?

Vercel serves a project that has **no `package.json`** as a pure static site — serving `index.html`, `css/`, `js/`, and `images/` directly from the CDN. This is the most reliable way to host this site.

## Deploy to Vercel (via GitHub)

`vercel.json` explicitly sets the framework preset to **Other**, disables build/install commands, and serves the repository root as static output. Import the repository with the project root set to the repository root; no manual build step is required.

## Local preview

You don't need any server. Just open `index.html` in a browser, or run a quick static server:

```bash
npx serve .
```

## Booking form

The booking form composes a pre-filled WhatsApp message to **+91 89897 33767**, so patients can confirm instantly with no backend.
