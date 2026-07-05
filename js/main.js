// =======================================================
// 1. FETCH AND INJECT HEADER, THEN BUILD MOBILE MENU
// =======================================================
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      // OVERRIDE FOR THE NEW CONTACT PAGE
      let updatedHeader = data.replace(/bookings\.html/g, 'contact.html');
      updatedHeader = updatedHeader.replace(/>BOOKINGS</g, '>CONTACT<');
      updatedHeader = updatedHeader.replace(/>RESERVE</g, '>CONTACT US<');
      
      headerPlaceholder.innerHTML = updatedHeader;
      // Build the mobile menu only AFTER the header is fully loaded
      initMobileMenu();
    }
  });

// =======================================================
// 2. FETCH AND INJECT FOOTER
// =======================================================
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      // Ensure footer links also point to contact instead of bookings
      let updatedFooter = data.replace(/bookings\.html/g, 'contact.html');
      updatedFooter = updatedFooter.replace(/>Bookings</g, '>Contact<');
      footerPlaceholder.innerHTML = updatedFooter;
    }
  });

// =======================================================
// 3. THE MOBILE MENU LOGIC
// =======================================================
function initMobileMenu() {
  const siteHeader = document.querySelector('.site-header');
  const headerRight = document.querySelector('.header-right');
  
  if (siteHeader && headerRight) {
    
    // Create the single, clean Hamburger Button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'custom-mobile-btn';
    toggleBtn.innerHTML = '&#9776;';
    headerRight.appendChild(toggleBtn);
    
    // Create the Dropdown Menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'custom-mobile-menu';
    
    // Safely copy only the desktop links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(function(link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.innerHTML = link.innerHTML;
      mobileMenu.appendChild(newLink);
    });

    // Copy the Reserve/Contact button into the menu so it isn't lost on mobile
    const reserveBtn = document.querySelector('.btn-reserve');
    if (reserveBtn) {
      const mobileReserve = document.createElement('a');
      mobileReserve.href = reserveBtn.href || 'contact.html';
      mobileReserve.innerHTML = reserveBtn.innerHTML;
      mobileReserve.className = 'mobile-reserve-link';
      mobileMenu.appendChild(mobileReserve);
    }
    
    siteHeader.appendChild(mobileMenu);
    
    // Click logic to open/close menu
    toggleBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });
  }
}