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

// Booking form -> WhatsApp (no backend needed)
const form = document.getElementById('bookingForm');
const note = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const lines = [
      'New Appointment Request',
      '------------------------',
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email || 'N/A'}`,
      `Service: ${data.service}`,
      `Preferred date: ${data.date}`,
      `Notes: ${data.message || 'N/A'}`
    ].join('\n');
    const url = 'https://wa.me/918989733767?text=' + encodeURIComponent(lines);
    note.textContent = `Thank you, ${data.name}! Opening WhatsApp to confirm your ${data.service} appointment...`;
    window.open(url, '_blank');
    form.reset();
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
