// Gate particles
const gp = document.getElementById('gateParticles');
if (gp) {
  for (let i = 0; i < 30; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 6) + 's';
    s.style.animationDuration = (4 + Math.random() * 4) + 's';
    gp.appendChild(s);
  }
}

// Gate enter
const gate = document.getElementById('gate');
const enterBtn = document.getElementById('enterBtn');
function enterClinic() {
  if (!gate) return;
  gate.classList.add('open');
  document.body.classList.remove('gate-locked');
  setTimeout(() => gate.classList.add('fade'), 1300);
  setTimeout(() => gate.remove(), 2200);
}
if (enterBtn) enterBtn.addEventListener('click', enterClinic);
// auto-open after 4s
setTimeout(() => { if (gate && document.body.contains(gate)) enterClinic(); }, 4500);
document.body.classList.add('gate-locked');

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Booking form -> Node API
const form = document.getElementById('bookingForm');
const note = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    note.textContent = 'Submitting...';
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.ok) {
        note.textContent = `Thank you, ${data.name}! Your ${data.service} appointment request has been received (ID #${json.appointment.id}).`;
        form.reset();
      } else {
        note.textContent = json.error || 'Something went wrong. Please try again.';
      }
    } catch (err) {
      note.textContent = 'Network error. Please call us directly.';
    }
  });
}

// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(r => io.observe(r));
} else {
  reveals.forEach(r => r.classList.add('revealed'));
}
document.querySelectorAll('.room-card').forEach(card => {
  card.addEventListener('click', () => {
    const target = document.getElementById('services');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
