/**
 * HopeHand — Stories Slider Carousel
 * Handles: Responsive multi-card carousel, smooth touch swiping, pagination dots, navigation buttons, and auto-play.
 */
document.addEventListener('DOMContentLoaded', () => {
  const wrappers = document.querySelectorAll('.cards-wrapper');

  wrappers.forEach(wrapper => {
    const track = wrapper.querySelector('.slider-track');
    if (!track) return;

    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    const dotsContainer = wrapper.querySelector('.dots') || wrapper.parentNode.querySelector('.dots');
    const prevButton = wrapper.querySelector('.nav-left') || wrapper.parentNode.querySelector('.nav-left');
    const nextButton = wrapper.querySelector('.nav-right') || wrapper.parentNode.querySelector('.nav-right');
    const sliderContainer = wrapper.querySelector('.slider-container');

    if (!sliderContainer) return;

    let currentIndex = 0;
    let dots = [];
    let pageCount = 0;
    let autoPlayTimer = null;

    function getVisibleCount() {
      const containerWidth = sliderContainer.getBoundingClientRect().width;
      const slideWidth = slides[0].getBoundingClientRect().width || 300;
      return Math.max(1, Math.round(containerWidth / slideWidth));
    }

    function buildDots(count) {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      dots = [];

      for (let i = 0; i < count; i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateSlider();
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      }
    }

    function updateSlider() {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(slides.length - visibleCount, 0);
      const newPageCount = maxIndex + 1;

      if (pageCount !== newPageCount) {
        pageCount = newPageCount;
        buildDots(pageCount);
      }

      if (currentIndex > maxIndex) {
        currentIndex = 0;
      } else if (currentIndex < 0) {
        currentIndex = maxIndex;
      }

      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      track.style.transform = `translateX(-${(slideWidth + gap) * currentIndex}px)`;

      dots.forEach((dot, index) => {
        dot.classList.toggle('dot--active', index === currentIndex);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentIndex -= 1;
        updateSlider();
        resetAutoPlay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentIndex += 1;
        updateSlider();
        resetAutoPlay();
      });
    }

    // Touch Swipe Support
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    sliderContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', () => {
      if (!isSwiping) return;
      const diff = startX - currentX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          currentIndex += 1;
        } else {
          currentIndex -= 1;
        }
        updateSlider();
        resetAutoPlay();
      }
      isSwiping = false;
    });

    // Auto Play Handler
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(slides.length - visibleCount, 0);
        if (currentIndex >= maxIndex) {
          currentIndex = 0;
        } else {
          currentIndex += 1;
        }
        updateSlider();
      }, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);

    window.addEventListener('resize', updateSlider);

    updateSlider();
    startAutoPlay();
  });
});
