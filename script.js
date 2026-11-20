/**
 * Portfolio Website - Pramod Chandima
 * Features: AOS Initialization, Web3Forms Contact Handling, Scroll Reveal,
 * Three.js & p5.js Visuals, Featured Works Carousel
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initial Scroll Settings
  window.scrollTo({ top: 0, behavior: 'instant' });
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Initialize AOS scroll animations (library loaded via defer)
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 60 });
  } else {
    // AOS not yet loaded (rare edge case), init after small delay
    window.addEventListener('load', () => {
      if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 60 });
    });
  }

  // ------------------------------
  // 1. Bento Card Dynamic Spotlight
  // ------------------------------
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ------------------------------
  // 2. Contact Form Handler (Web3Forms API)
  // ------------------------------
  const contactForm = document.getElementById('contactForm');
  const feedbackDiv = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Form data gathering
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Basic Client-side Validation
      if (!name || !email || !message) {
        showFeedback('âš ï¸ Please fill in all required fields.', 'error');
        return;
      }

      // Show loading state on button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin ml-2"></i>';

      try {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
          body: formData
          });

          const result = await response.json();

          if(response.ok && result.success) {
            showFeedback(`âœ… Thanks ${name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      showFeedback('âŒ Oops! Something went wrong. Please try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
  }

// Modern Feedback Message Helper
function showFeedback(msg, type) {
  if (!feedbackDiv) return;

  if (feedbackDiv._hideTimer) clearTimeout(feedbackDiv._hideTimer);
  if (feedbackDiv._removeTimer) clearTimeout(feedbackDiv._removeTimer);

  feedbackDiv.innerHTML = msg;
  feedbackDiv.className = `form-feedback ${type}`; // Using a base class for styling

  feedbackDiv.style.display = 'block';
  feedbackDiv.style.opacity = '0';
  feedbackDiv.style.transform = 'translateX(-50%) translateY(-20px)';

  requestAnimationFrame(() => {
    feedbackDiv.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    feedbackDiv.style.opacity = '1';
    feedbackDiv.style.transform = 'translateX(-50%) translateY(0)';
  });

  feedbackDiv._hideTimer = setTimeout(() => {
    feedbackDiv.style.opacity = '0';
    feedbackDiv.style.transform = 'translateX(-50%) translateY(-20px)';
    feedbackDiv._removeTimer = setTimeout(() => {
      feedbackDiv.style.display = 'none';
    }, 500);
  }, 5000);
}

// ------------------------------
// 3. CV Download Handler
// ------------------------------
const downloadBtn = document.getElementById('downloadCV');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    showFeedback('âœ… CV download started!', 'success');
  });
}

// ------------------------------
// 4. Scroll Reveal Logic
// ------------------------------
const revealSections = document.querySelectorAll('section, .service-card, .project-card');
revealSections.forEach(s => s.classList.add('section-hidden'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
      entry.target.classList.remove('section-hidden');
    }
  });
}, { threshold: 0.1 });

revealSections.forEach(s => revealObserver.observe(s));

// ------------------------------
// 5. Three.js Background
// ------------------------------
const threeContainer = document.getElementById('threejs-canvas-container');
if (threeContainer && typeof THREE !== 'undefined') {
  let scene, camera, renderer, particles;
  const initThree = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeContainer.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000 * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 40;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    animateThree();
  };

  const animateThree = () => {
    requestAnimationFrame(animateThree);
    const time = Date.now() * 0.00005;
    particles.rotation.x = time * 0.25;
    particles.rotation.y = time * 0.2;
    renderer.render(scene, camera);
  };

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  initThree();
}

// ------------------------------
// 6. p5.js Starfield
// ------------------------------
const p5Container = document.getElementById('p5js-canvas-container');
if (p5Container && typeof p5 !== 'undefined') {
  new p5((p) => {
    let stars = [];
    p.setup = () => {
      let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent(p5Container);
      for (let i = 0; i < 400; i++) stars.push(new Star(p));
    };
    p.draw = () => {
      p.clear();
      p.translate(p.width / 2, p.height / 2);
      let speed = p.map(p.mouseX || p.width / 2, 0, p.width, 0.1, 1.5);
      stars.forEach(s => { s.update(speed); s.show(); });
    };
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);

    class Star {
      constructor(p) { this.p = p; this.respawn(); }
      respawn() {
        this.x = this.p.random(-this.p.width, this.p.width);
        this.y = this.p.random(-this.p.height, this.p.height);
        this.z = this.p.random(this.p.width);
      }
      update(speed) {
        this.z -= speed * 5;
        if (this.z < 1) this.respawn();
      }
      show() {
        let sx = this.p.map(this.x / this.z, 0, 1, 0, this.p.width);
        let sy = this.p.map(this.y / this.z, 0, 1, 0, this.p.height);
        let r = this.p.map(this.z, 0, this.p.width, 5, 0);
        this.p.fill(150, 150, 200, 180);
        this.p.noStroke();
        if (r > 0) this.p.ellipse(sx, sy, r, r);
      }
    }
  });
}

// ------------------------------
// 7. Disable Image Context Menu & Drag
// ------------------------------
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG' || e.target.classList.contains('profile-image-overlay')) {
    e.preventDefault();
  }
});

document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

  const projectCarousel = document.querySelector('#projects .bento-grid-projects');

  if (projectCarousel && window.matchMedia('(pointer: fine)').matches) {
    const maxSpeed = 14;
    const minSpeed = 2;
    let targetSpeed = 0;
    let currentSpeed = 0;
    let scrollFrame = null;

    const edgeScroll = () => {
      const maxScroll = projectCarousel.scrollWidth - projectCarousel.clientWidth;

      currentSpeed += (targetSpeed - currentSpeed) * 0.18;

      if ((currentSpeed < 0 && projectCarousel.scrollLeft <= 0) || (currentSpeed > 0 && projectCarousel.scrollLeft >= maxScroll)) {
        currentSpeed = 0;
        targetSpeed = 0;
        scrollFrame = null;
        return;
      }

      if (!targetSpeed && Math.abs(currentSpeed) < 0.1) {
        currentSpeed = 0;
        scrollFrame = null;
        return;
      }

      projectCarousel.scrollLeft += currentSpeed;
      scrollFrame = requestAnimationFrame(edgeScroll);
    };

    const setTargetSpeed = speed => {
      targetSpeed = speed;

      if (!scrollFrame) {
        scrollFrame = requestAnimationFrame(edgeScroll);
      }
    };

    const speedFromDistance = (distance, zone) => {
      const ratio = Math.min(1, Math.max(0, distance / zone));
      return minSpeed + (maxSpeed - minSpeed) * Math.pow(ratio, 1.4);
    };

    document.addEventListener('mousemove', event => {
      const rect = projectCarousel.getBoundingClientRect();
      const edgeZone = Math.min(240, window.innerWidth * 0.28);
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isVisible) {
        setTargetSpeed(0);
        return;
      }

      if (event.clientX < edgeZone) {
        setTargetSpeed(-speedFromDistance(edgeZone - event.clientX, edgeZone));
      } else if (event.clientX > window.innerWidth - edgeZone) {
        setTargetSpeed(speedFromDistance(event.clientX - (window.innerWidth - edgeZone), edgeZone));
      } else {
        setTargetSpeed(0);
      }
    });

    document.addEventListener('mouseleave', () => setTargetSpeed(0));
    window.addEventListener('blur', () => setTargetSpeed(0));
  }

});
