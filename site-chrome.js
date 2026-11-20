async function loadSharedComponent(path) {
  const response = await fetch(path);

  if (!response.ok) throw new Error(`Unable to load ${path}`);

  return response.text();
}

function setupSharedHeader() {
  const menuToggle = document.getElementById('shared-menu-toggle');
  const navLinks = document.getElementById('shared-nav-links');

  if (!menuToggle || !navLinks) return;

  const closeMenu = () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  };

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  navLinks.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const url = new URL(link.href, window.location.href);
      const targetId = url.hash;

      if (!targetId || url.pathname !== window.location.pathname) return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        closeMenu();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        history.pushState(null, null, targetId);
      }
    });
  });
}

async function renderSharedChrome() {
  const [headerSlot, footerSlot] = [document.getElementById('siteHeader'), document.getElementById('siteFooter')];

  try {
    const [headerMarkup, footerMarkup] = await Promise.all([
      loadSharedComponent('components/header.html'),
      loadSharedComponent('components/footer.html')
    ]);

    if (headerSlot) headerSlot.innerHTML = headerMarkup;
    if (footerSlot) footerSlot.innerHTML = footerMarkup;
    setupSharedHeader();
  } catch (error) {
    if (headerSlot) {
      headerSlot.innerHTML = '<nav class="navbar"><div class="container nav-container"><a href="index.html" class="logo neon-text">PC</a></div></nav>';
    }
  }
}

renderSharedChrome();
