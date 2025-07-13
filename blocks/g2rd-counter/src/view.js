/**
 * Frontend JavaScript for G2RD Counter Block
 * Handles animations and interactions
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all counter blocks
  const counterBlocks = document.querySelectorAll(".wp-block-g2rd-counter");

  if (counterBlocks.length === 0) return;

  /**
   * Counter Animation Class
   */
  class CounterAnimation {
    constructor(element) {
      this.element = element;
      this.numberElement = element.querySelector(".counter-number");
      this.circleProgress = element.querySelector(".counter-circle-progress");
      this.barFill = element.querySelector(".counter-bar-fill");

      if (!this.numberElement) return;

      // Get data attributes
      this.startValue = parseFloat(this.element.dataset.start) || 0;
      this.endValue = parseFloat(this.element.dataset.end) || 100;
      this.decimals = parseInt(this.element.dataset.decimals) || 0;
      this.duration = parseInt(this.element.dataset.duration) || 2000;
      this.prefix = this.element.dataset.prefix || "";
      this.suffix = this.element.dataset.suffix || "";
      this.thousands = this.element.dataset.thousands || "none";

      this.hasAnimated = false;
      this.setupIntersectionObserver();
    }

    /**
     * Setup Intersection Observer for scroll-triggered animation
     */
    setupIntersectionObserver() {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Show final value immediately
        this.showFinalValue();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.hasAnimated) {
              this.startAnimation();
              this.hasAnimated = true;
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      observer.observe(this.element);
    }

    /**
     * Show final value without animation
     */
    showFinalValue() {
      const formattedValue = this.formatNumber(this.endValue);
      this.numberElement.textContent = formattedValue;

      // Set final states for circle and bar
      if (this.circleProgress) {
        const circumference = 2 * Math.PI * 50; // r=50
        const progress = (this.endValue / 100) * circumference;
        this.circleProgress.style.strokeDasharray = `${progress} ${circumference}`;
      }

      if (this.barFill) {
        this.barFill.style.width = `${this.endValue}%`;
      }
    }

    /**
     * Start the counter animation
     */
    startAnimation() {
      const startTime = performance.now();
      const range = this.endValue - this.startValue;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        // Use easing function for smooth animation
        const easedProgress = this.easeOutQuart(progress);
        const currentValue = this.startValue + range * easedProgress;

        // Update number
        const formattedValue = this.formatNumber(currentValue);
        this.numberElement.textContent = formattedValue;

        // Update circle progress
        if (this.circleProgress) {
          this.animateCircle(currentValue);
        }

        // Update bar progress
        if (this.barFill) {
          this.animateBar(currentValue);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final value is exact
          this.showFinalValue();
        }
      };

      requestAnimationFrame(animate);
    }

    /**
     * Animate circle progress
     */
    animateCircle(currentValue) {
      if (!this.circleProgress) return;

      const circumference = 2 * Math.PI * 50; // r=50
      const progress = (currentValue / 100) * circumference;
      this.circleProgress.style.strokeDasharray = `${progress} ${circumference}`;
    }

    /**
     * Animate bar progress
     */
    animateBar(currentValue) {
      if (!this.barFill) return;

      this.barFill.style.width = `${currentValue}%`;
    }

    /**
     * Format number with decimals and thousands separator
     */
    formatNumber(value) {
      let formatted = value.toFixed(this.decimals);

      // Apply thousands separator
      if (this.thousands === "comma") {
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else if (this.thousands === "space") {
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }

      // Ne pas ajouter prefix/suffix ici !
      return formatted;
    }

    /**
     * Easing function for smooth animation
     */
    easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }
  }

  /**
   * Initialize all counter animations
   */
  counterBlocks.forEach((block) => {
    new CounterAnimation(block);
  });

  /**
   * Handle responsive behavior
   */
  const handleResize = () => {
    counterBlocks.forEach((block) => {
      // Adjust circle size on mobile
      const circle = block.querySelector(".counter-circle");
      if (circle && window.innerWidth < 480) {
        const svg = circle.querySelector("svg");
        if (svg) {
          svg.setAttribute("width", "80");
          svg.setAttribute("height", "80");
          const circles = svg.querySelectorAll("circle");
          circles.forEach((c) => {
            c.setAttribute("cx", "40");
            c.setAttribute("cy", "40");
            c.setAttribute("r", "30");
          });
        }
      }
    });
  };

  // Initial resize check
  handleResize();

  // Listen for window resize
  window.addEventListener("resize", handleResize);
});

/**
 * Expose animation trigger for manual use
 */
window.G2RDCounter = {
  triggerAnimation: function (selector) {
    const elements = document.querySelectorAll(
      selector || ".wp-block-g2rd-counter"
    );
    elements.forEach((element) => {
      const animation = new CounterAnimation(element);
      animation.startAnimation();
    });
  },
};
