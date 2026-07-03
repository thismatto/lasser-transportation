// 1. Header Injection and Language Toggle Logic
const headerPlaceholder = document.getElementById('header-placeholder');
if (headerPlaceholder) {
  
  const currentPath = window.location.pathname;
  const fileName = currentPath.split('/').pop() || 'index.html';
  const isSpanish = fileName.includes('-es.html');
  const headerFile = isSpanish ? 'header-es.html' : 'header.html';

  fetch(headerFile)
    .then(response => response.text())
    .then(data => {
      headerPlaceholder.innerHTML = data;

      // Make the mobile menu button work
      const menuBtn = document.getElementById('menuBtn');
      const mainNav = document.getElementById('mainNav');
      if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
      }

      // Automatically highlight the correct link in the menu (Home, Tours, Bookings)
      document.querySelectorAll('.main-nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === fileName || (fileName === '' && linkHref === 'index.html') || (fileName === '' && linkHref === 'index-es.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Dynamic Language Toggle Logic
      const langEn = document.getElementById('lang-en');
      const langEs = document.getElementById('lang-es');
      
      if (langEn && langEs) {
        if (isSpanish) {
          // If on a Spanish page, point the EN button back to the English page
          const englishPage = fileName.replace('-es.html', '.html');
          langEn.href = englishPage;
          langEs.href = '#';
        } else {
          // If on an English page, point the ES button to the Spanish page
          const baseName = fileName === '' ? 'index' : fileName.replace('.html', '');
          const spanishPage = baseName + '-es.html';
          langEn.href = '#';
          langEs.href = spanishPage;
        }
      }
    })
    .catch(error => console.error('Error loading header:', error));
}

// 2. Year in footer
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// 3. Bookings: pre-fill service from ?service= URL param
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

// 4. Booking form validation + fake submit
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