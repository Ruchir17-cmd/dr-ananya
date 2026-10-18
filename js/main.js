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

// Gentle, staggered scroll reveals for the sections and treatment cards.
document.querySelectorAll('section:not(.hero) .section-head, .service-card, .corridor-card, .braces-card, .ortho-card, .corr-card, .ba-card, .mandible-card, .room-card, .offer-card, .timeline-step, .testimonial, .special-services, .followup-note').forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
});

const reveals = document.querySelectorAll('.reveal');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  reveals.forEach(element => element.classList.add('revealed'));
} else if ('IntersectionObserver' in window) {
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
