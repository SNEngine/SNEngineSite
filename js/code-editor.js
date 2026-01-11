function initializeCodeEditorPage() {
  // Update current year
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Reveal animations for both traditional features and feature cards
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
        // Only remove visible class if element is significantly below the viewport
        if (rect > window.innerHeight * 1.2) {
          el.classList.remove('visible');
        }
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
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Carousel functionality
  const carouselImages = document.querySelectorAll('.carousel-image');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const indicators = document.querySelectorAll('.indicator');
  if (carouselImages.length > 0 && prevBtn && nextBtn && indicators.length > 0) {
    let currentIndex = 0;

    function showImage(index) {
      // Remove active class from all images and indicators
      carouselImages.forEach(img => img.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      // Add active class to current image and indicator
      carouselImages[index].classList.add('active');
      indicators[index].classList.add('active');
      currentIndex = index;
    }

    // Next button click event
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % carouselImages.length;
      showImage(nextIndex);
    });

    // Previous button click event
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
      showImage(prevIndex);
    });

    // Indicator click events
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showImage(index);
      });
    });

    // Auto-rotate carousel every 5 seconds
    setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselImages.length;
      showImage(nextIndex);
    }, 5000);
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
      initializeCodeEditorPage();
    } else {
      // If not ready, wait a bit more
      setTimeout(checkAndRun, 50);
    }
  };

  checkAndRun();

  // Listen for language changes to update page-specific content
  window.addEventListener('languageChanged', () => {
    initializeCodeEditorPage();
  });
});