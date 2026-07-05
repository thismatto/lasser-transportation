// =======================================================
// GLOBAL MOBILE MENU GENERATOR (Runs on all pages)
// =======================================================
window.addEventListener('load', function() {
  setTimeout(function() {
    if (!document.querySelector('.custom-mobile-menu')) {
      const siteHeader = document.querySelector('.site-header');
      const headerRight = document.querySelector('.header-right');
      
      if (siteHeader && headerRight) {
        
        // 1. Create the single, clean Hamburger Button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'custom-mobile-btn';
        toggleBtn.innerHTML = '&#9776;';
        headerRight.appendChild(toggleBtn);
        
        // 2. Create the beautiful Dropdown Menu container
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'custom-mobile-menu';
        
        // 3. Safely copy only the desktop links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(function(link) {
          const newLink = document.createElement('a');
          newLink.href = link.href;
          newLink.innerHTML = link.innerHTML;
          mobileMenu.appendChild(newLink);
        });

        // 4. Copy the Reserve button into the menu so it isn't lost on mobile
        const reserveBtn = document.querySelector('.btn-reserve');
        if (reserveBtn) {
          const mobileReserve = document.createElement('a');
          mobileReserve.href = reserveBtn.href || 'bookings.html';
          mobileReserve.innerHTML = reserveBtn.innerHTML;
          mobileReserve.className = 'mobile-reserve-link';
          mobileMenu.appendChild(mobileReserve);
        }
        
        siteHeader.appendChild(mobileMenu);
        
        // 5. Click logic to open/close menu
        toggleBtn.addEventListener('click', function() {
          mobileMenu.classList.toggle('active');
        });
      }
    }
  }, 300); // 300ms wait ensures the header has time to inject first
});