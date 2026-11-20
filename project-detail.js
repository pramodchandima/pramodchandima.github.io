const detailContent = document.getElementById('projectDetailContent');

const projectNames = {
  'mobile-hub': 'Mobile HUB',
  'fashion-hub': 'Fashion HUB',
  'tour-management': 'Tour Management System',
  'event-x': 'EventX'
};

const requestedProject = new URLSearchParams(window.location.search).get('project');
const activeProject = Object.prototype.hasOwnProperty.call(projectNames, requestedProject)
  ? requestedProject
  : 'mobile-hub';

async function loadComponent(path) {
  const response = await fetch(path);

  if (!response.ok) throw new Error(`Unable to load ${path}`);

  return response.text();
}

async function renderProject() {
  if (!detailContent) return;

  try {
    const projectMarkup = await loadComponent(`components/${activeProject}.html`);

    const relatedMarkup = await loadComponent('components/related-projects.html');

    detailContent.innerHTML = `${projectMarkup}${relatedMarkup}`;
    document.title = `${projectNames[activeProject]} | Pramod Chandima`;

    detailContent.querySelectorAll('[data-project]').forEach(card => {
      if (card.dataset.project === activeProject) {
        card.classList.add('is-current-project');
        card.setAttribute('aria-current', 'page');
      }
    });
  } catch (error) {
    detailContent.innerHTML = `
      <div class="project-split-content">
        <h1 class="project-detail-title">Project unavailable</h1>
        <p class="project-detail-lead">This page needs to be served over http:// (for example with Live Server) so the project components can load.</p>
        <div class="project-detail-footer">
          <a href="projects.html" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Back to Projects</a>
        </div>
      </div>`;
  }
}

renderProject();
