// Vercel serverless function for booking appointments.
// Bookings are stored in-memory and mirrored to /tmp for the life of the instance.

let store = [];

function persist() {
  try {
    require('fs').writeFileSync('/tmp/appointments.json', JSON.stringify(store), 'utf8');
  } catch (e) {
    // best-effort; ignore failures on read-only FS
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, appointments: store });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, phone, service, date, email, message } = body;

    if (!name || !phone || !service || !date) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const appointment = {
      id: Date.now(),
      name,
      phone,
      email: email || '',
      service,
      date,
      message: message || '',
      createdAt: new Date().toISOString()
    };

    store.push(appointment);
    persist();
    return res.status(200).json({ ok: true, appointment });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};