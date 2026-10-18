# Dr. Ananya's Dental & Orthodontic Clinic

A website for the clinic. The front end is fully static (HTML/CSS/JS). Bookings are handled by a tiny serverless function.

## Local development

```bash
npm install
npm start
```

Then open http://localhost:3000

`dev-server.js` (Express) is only used for local preview; Vercel deploys the static site + `api/` function.

## Deployment (Vercel + GitHub)

1. Import the GitHub repo in Vercel.
2. Framework preset: **Other**. No build command, output directory `/`.
3. Deploy.

Static assets (`css`, `js`, `images`) are served directly by Vercel's CDN, so the site renders correctly.

## API

- `POST /api/appointments` — create a booking (name, phone, service, date required)
- `GET /api/appointments` — list bookings (in-memory per instance)