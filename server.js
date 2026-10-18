const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'appointments.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data dir/file exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

function readAppointments() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function writeAppointments(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

// API: create appointment
app.post('/api/appointments', (req, res) => {
  const { name, phone, email, service, date, message } = req.body || {};
  if (!name || !phone || !service || !date) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }
  const appt = {
    id: Date.now(),
    name, phone, email: email || '', service, date, message: message || '',
    createdAt: new Date().toISOString()
  };
  const list = readAppointments();
  list.push(appt);
  writeAppointments(list);
  res.json({ ok: true, appointment: appt });
});

// API: list appointments (admin-ish)
app.get('/api/appointments', (req, res) => {
  res.json({ ok: true, appointments: readAppointments() });
});

// Static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dr. Ananya's Clinic running at http://localhost:${PORT}`);
});
