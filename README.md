# Dr. Ananya's Dental & Orthodontic Clinic

A Node.js (Express) website for the clinic, with a booking API.

## Run

```bash
npm install
npm start
```

Then open http://localhost:3000

## API

- `POST /api/appointments` — create a booking (name, phone, service, date required)
- `GET /api/appointments` — list bookings

Bookings are stored in `data/appointments.json`.

## Dev

```bash
npm run dev
```
