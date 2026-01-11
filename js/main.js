function initializeMainPage() {
  // Update current year
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  const reveals = document.querySelectorAll('.reveal');
  function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;
    reveals.forEach((el, index) => {
      const rect = el.getBoundingClientRect().top;
      if (rect < trigger && rect + el.offsetHeight > 0) {
        // Add a slight delay for staggered animation
        setTimeout(() => {
          el.classList.add('visible');
        }, index * 100);
      } else {
        el.classList.remove('visible');
      }
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Set active navigation link based on current page
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage ||
        (currentPage === '' && link.getAttribute('href') === '#main')) {
      link.classList.add('active');
    }
  });

  // Ensure video loops properly with a delay
  const video = document.querySelector('.hero-video');
  if (video) {
    // Remove the default loop attribute and handle looping manually
    video.loop = false;

    video.addEventListener('ended', function() {
      // Add a delay before restarting the video
      setTimeout(() => {
        this.currentTime = 0;
        this.play();
      }, 5000); // 5000ms (5 seconds) delay before restart
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('resize', revealOnScroll);
  revealOnScroll();
}

// Wait for nav/footer to be initialized before running page-specific code
document.addEventListener('DOMContentLoaded', () => {
  const checkAndRun = () => {
    // Check if the header and footer have been generated
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
      initializeMainPage();
    } else {
      // If not ready, wait a bit more
      setTimeout(checkAndRun, 50);
    }
  };

  checkAndRun();

  // Listen for language changes to update page-specific content
  window.addEventListener('storage', (event) => {
    if (event.key === 'snengine-lang' && event.newValue !== event.oldValue) {
      // Re-initialize the page to update any page-specific content
      initializeMainPage();
    }
  });
});