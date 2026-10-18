# Dr. Ananya's Dental & Orthodontic Clinic

A fully **static** website (HTML, CSS, vanilla JS). No build step, no server, no dependencies.

## Why static?

Vercel serves a project that has **no `package.json`** as a pure static site — serving `index.html`, `css/`, `js/`, and `images/` directly from the CDN. This is the most reliable way to host this site.

## Deploy to Vercel (via GitHub)

1. Import the repo in Vercel.
2. Framework preset: **Other**.
3. Build command: *(leave empty)*.
4. Output directory: *(leave empty)*.
5. Deploy.

## Local preview

You don't need any server. Just open `index.html` in a browser, or run a quick static server:

```bash
npx serve .
```

## Booking form

The booking form composes a pre-filled WhatsApp message to **+91 89897 33767**, so patients can confirm instantly with no backend.