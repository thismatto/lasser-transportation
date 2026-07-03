// Year in footer
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// Mobile nav
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
}

// Bookings: pre-fill service from ?service= URL param
const params = new URLSearchParams(window.location.search);
const svc = params.get('service');
if (svc) {
  const select = document.querySelector('select[name="service"]');
  if (select) {
    for (const opt of select.options) {
      if (opt.value === svc || opt.textContent.trim() === svc) {
        opt.selected = true;
        break;
      }
    }
  }
}

// Booking form validation + fake submit
const form = document.getElementById('bookingForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('.error').forEach(el => el.textContent = '');

    const requiredFields = [
      { name: 'name', msg: 'Please enter your full name' },
      { name: 'email', msg: 'Enter a valid email' },
      { name: 'phone', msg: 'Enter a valid phone' },
      { name: 'date', msg: 'Pick a date' },
      { name: 'service', msg: 'Pick a service' },
      { name: 'pickup', msg: 'Enter a pickup location' },
      { name: 'passengers', msg: 'At least 1 passenger' },
    ];

    requiredFields.forEach(f => {
      const input = form.elements[f.name];
      const val = (input.value || '').trim();
      if (!val) {
        input.parentElement.querySelector('.error').textContent = f.msg;
        valid = false;
      }
      if (f.name === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        input.parentElement.querySelector('.error').textContent = 'Enter a valid email';
        valid = false;
      }
    });

    if (!valid) return;

    const name = form.elements.name.value.trim();
    const successEl = document.getElementById('formSuccess');
    successEl.hidden = false;
    successEl.textContent = `✓ Booking received. Thanks ${name} — our dispatch team will confirm by email within 30 minutes.`;
    form.reset();
    window.scrollTo({ top: successEl.offsetTop - 120, behavior: 'smooth' });
  });
}
