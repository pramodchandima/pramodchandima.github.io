/**
 * Portfolio Website - Pramod Chandima
 * Features: AOS Initialization, Web3Forms Contact Handling, Smooth Scroll,
 * Tech Stack Animation, Three.js & p5.js Visuals, Image Modal
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
  // 1. Tech Stack - Animated Grid
  // ------------------------------
  const techStack = [
    { name: 'TypeScript', icon: 'devicon-typescript-plain', color: '#3178C6' },
    { name: 'Next.js', icon: 'devicon-nextjs-plain', color: '#FFFFFF' },
    { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
    { name: 'Flutter', icon: 'devicon-flutter-plain', color: '#54C5F8' },
    { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain', color: '#06B6D4' },
    { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
    { name: 'PHP', icon: 'devicon-php-plain', color: '#8892BF' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
    { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
    { name: 'Java', icon: 'fab fa-java', color: '#007396' },
    { name: 'Supabase', icon: 'devicon-supabase-plain', color: '#3FCF8E' },
    { name: 'SQLite', icon: 'devicon-sqlite-plain', color: '#29B5E8' },
    { name: 'SQL (MySQL)', icon: 'fas fa-database', color: '#4479A1' },
    { name: 'Git & GitHub', icon: 'devicon-git-plain', color: '#F05032' },
    { name: 'Cloud / Vercel', icon: 'devicon-vercel-original', color: '#FFFFFF' },
    { name: 'HTML5 & CSS3', icon: 'fab fa-html5', color: '#E34F26' }
  ];

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
        showFeedback('⚠️ Please fill in all required fields.', 'error');
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
            showFeedback(`✅ Thanks ${name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      showFeedback('❌ Oops! Something went wrong. Please try again later.', 'error');
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
// 3. Smooth Scroll & Navigation
// ------------------------------
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === "#" || targetId === "") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      history.pushState(null, null, targetId);

      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      const navLinksContainer = document.querySelector('.nav-links');
      if (mobileMenu && navLinksContainer && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        navLinksContainer.classList.remove('active');
      }
    }
  });
});

// Mobile Menu Toggle logic
const mobileMenuButton = document.getElementById('mobile-menu');
const navLinksList = document.querySelector('.nav-links');

if (mobileMenuButton && navLinksList) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenuButton.classList.toggle('active');
    navLinksList.classList.toggle('active');
  });
}

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNavLink() {
  let current = '';
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.clientHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink();

// ------------------------------
// 4. CV Download Handler
// ------------------------------
const downloadBtn = document.getElementById('downloadCV');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    showFeedback('✅ CV download started!', 'success');
  });
}

// ------------------------------
// 5. Scroll Reveal Logic
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
// 6. Three.js Background
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
// 7. p5.js Starfield
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
// 8. Image Modal Logic
// ------------------------------
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const projectImages = document.querySelectorAll('.project-img');

if (imageModal && modalImage) {
  projectImages.forEach(container => {
    container.addEventListener('dblclick', function () {
      const img = this.querySelector('img');
      if (img) {
        modalImage.src = img.src;
        imageModal.style.display = 'flex';
        setTimeout(() => imageModal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    imageModal.classList.remove('active');
    setTimeout(() => { imageModal.style.display = 'none'; }, 400);
    document.body.style.overflow = '';
  };

  imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// ------------------------------
// 9. Disable Image Context Menu & Drag
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

// ------------------------------
// 10. AI Chat Assistant Widget
// ------------------------------
const aiChatWidget = document.getElementById('aiChatWidget');
const aiChatToggle = document.getElementById('aiChatToggle');
const aiChatClose = document.getElementById('aiChatClose');
const aiChatForm = document.getElementById('aiChatForm');
const aiChatInput = document.getElementById('aiChatInput');
const aiChatMessages = document.getElementById('aiChatMessages');
const chatChips = document.querySelectorAll('.chat-chip');

if (aiChatWidget && aiChatToggle && aiChatForm && aiChatInput && aiChatMessages) {
  const WORKER_URL = 'https://pramod-bot.pramodfernando49.workers.dev';

  const toggleChat = () => {
    const isActive = aiChatWidget.classList.toggle('active');
    if (isActive) {
      setTimeout(() => aiChatInput.focus(), 150);
    }
  };

  aiChatToggle.addEventListener('click', toggleChat);
  if (aiChatClose) {
    aiChatClose.addEventListener('click', () => {
      aiChatWidget.classList.remove('active');
    });
  }

  // Quick suggestion chips
  chatChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
      aiChatInput.value = prompt;
      sendMessage(prompt);
    });
  });

  // Formatting helper with rich UI/UX formatting (lists, links, emails, whatsapp)
  const formatBotMessage = (text) => {
    // Escape HTML
    const div = document.createElement('div');
    div.textContent = text;
    let safe = div.innerHTML;

    // Bold markdown
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert bullet points (- item or * item)
    safe = safe.replace(/^[\*\-]\s+(.*)$/gm, '<li class="chat-li">$1</li>');
    // Wrap consecutive <li> into <ul>
    safe = safe.replace(/((?:<li class="chat-li">.*?<\/li>\s*)+)/g, '<ul class="chat-ul">$1</ul>');

    // Clickable emails
    safe = safe.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" class="chat-link email-link"><i class="fas fa-envelope"></i> $1</a>');

    // Clickable WhatsApp (+94 702913774)
    safe = safe.replace(/(\+94\s*7[0-9\s]{7,10})/g, (match) => {
      const cleanNumber = match.replace(/[\s+]/g, '');
      return `<a href="https://wa.me/${cleanNumber}" target="_blank" rel="noopener noreferrer" class="chat-link wa-link"><i class="fab fa-whatsapp"></i> ${match}</a>`;
    });

    // Regular URLs to clickable links (avoiding already linked mailto/wa)
    safe = safe.replace(/(?<!href=")(https?:\/\/[^\s<"']+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    // Line breaks (ignore breaks directly after </ul> or </li>)
    safe = safe.replace(/\n(?!\s*<\/?(ul|li))/g, '<br>');
    safe = safe.replace(/(<br>\s*){3,}/g, '<br><br>');

    return safe;
  };

  const appendMessage = (sender, htmlContent) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = `<div class="msg-bubble">${htmlContent}</div>`;
    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    return msgDiv;
  };

  const sendMessage = async (messageText) => {
    const text = (messageText || aiChatInput.value).trim();
    if (!text) return;

    // Add user message
    const div = document.createElement('div');
    div.textContent = text;
    appendMessage('user', div.innerHTML);
    aiChatInput.value = '';

    // Disable inputs while waiting
    aiChatInput.disabled = true;
    const sendBtn = aiChatForm.querySelector('button[type="submit"]');
    if (sendBtn) sendBtn.disabled = true;

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing';
    typingDiv.innerHTML = '<div class="msg-bubble"><div class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>';
    aiChatMessages.appendChild(typingDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      typingDiv.remove();

      if (response.ok && data.reply) {
        appendMessage('bot', formatBotMessage(data.reply));
      } else {
        const errMsg = data.error || 'Sorry, I encountered an issue. Please feel free to check out Pramod\'s GitHub: https://github.com/pramodchandima';
        appendMessage('bot', formatBotMessage(errMsg));
      }
    } catch (err) {
      typingDiv.remove();
      appendMessage('bot', 'Network error reaching assistant. You can check out Pramod\'s work directly on GitHub: https://github.com/pramodchandima');
    } finally {
      aiChatInput.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      aiChatInput.focus();
    }
  };

  aiChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
  });
}
});