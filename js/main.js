// 0. Inject Favicon Dynamically using direct URL
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = 'https://cdn.shopify.com/s/files/1/0771/9652/5726/files/bus-icon.png-modified.png?v=1783142462';
document.head.appendChild(favicon);

// 1. Header and Footer Injection Logic
const headerPlaceholder = document.getElementById('header-placeholder');
const footerPlaceholder = document.getElementById('footer-placeholder');

const currentPath = window.location.pathname;
const fileName = currentPath.split('/').pop() || 'index.html';
const isSpanish = fileName.includes('-es.html');

const headerFile = isSpanish ? 'header-es.html' : 'header.html';
const footerFile = isSpanish ? 'footer-es.html' : 'footer.html';

// Fetch and Inject Header
if (headerPlaceholder) {
  fetch(headerFile)
    .then(response => response.text())
    .then(data => {
      headerPlaceholder.innerHTML = data;

      const menuBtn = document.getElementById('menuBtn');
      const mainNav = document.getElementById('mainNav');
      if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
      }

      document.querySelectorAll('.main-nav a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === fileName || (fileName === '' && linkHref === 'index.html') || (fileName === '' && linkHref === 'index-es.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      const langEn = document.getElementById('lang-en');
      const langEs = document.getElementById('lang-es');
      
      if (langEn && langEs) {
        if (isSpanish) {
          const englishPage = fileName.replace('-es.html', '.html');
          langEn.href = englishPage;
          langEs.href = '#';
        } else {
          const baseName = fileName === '' ? 'index' : fileName.replace('.html', '');
          const spanishPage = baseName + '-es.html';
          langEn.href = '#';
          langEs.href = spanishPage;
        }
      }
    })
    .catch(error => console.error('Error loading header:', error));
}

// Fetch and Inject Footer
if (footerPlaceholder) {
  fetch(footerFile)
    .then(response => response.text())
    .then(data => {
      footerPlaceholder.innerHTML = data;
      document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
    })
    .catch(error => console.error('Error loading footer:', error));
}

// 2. Bookings: pre-fill service from ?service= URL param
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

// 3. Booking form validation + ACTUAL Netlify Submit
const form = document.getElementById('bookingForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop standard page reload
    
    let valid = true;
    form.querySelectorAll('.error').forEach(el => el.textContent = '');
    
    const requiredFields = [
      { name: 'name', msg: 'Please enter your full name / Por favor ingrese su nombre' },
      { name: 'email', msg: 'Enter a valid email / Ingrese un correo válido' },
      { name: 'phone', msg: 'Enter a valid phone / Ingrese un teléfono válido' },
      { name: 'date', msg: 'Pick a date / Elija una fecha' },
      { name: 'service', msg: 'Pick a service / Elija un servicio' },
      { name: 'pickup', msg: 'Enter a pickup location / Ingrese un lugar de recogida' },
      { name: 'passengers', msg: 'At least 1 passenger / Al menos 1 pasajero' },
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
    
    // Package data and send securely to Netlify Forms
    const formData = new FormData(form);
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      // Show Success Message
      const name = form.elements.name.value.trim();
      const successEl = document.getElementById('formSuccess');
      successEl.hidden = false;
      
      if (isSpanish) {
         successEl.textContent = `✓ Reserva recibida. Gracias ${name} — nuestro equipo de despacho le confirmará por correo en 30 minutos.`;
      } else {
         successEl.textContent = `✓ Booking received. Thanks ${name} — our dispatch team will confirm by email within 30 minutes.`;
      }
      
      form.reset();
      window.scrollTo({ top: successEl.offsetTop - 120, behavior: 'smooth' });
    })
    .catch(error => {
      alert('Error submitting the form. Please try again.');
      console.error(error);
    });
  });
}