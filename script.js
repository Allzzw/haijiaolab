const nav = document.querySelector('[data-site-nav]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const publications = [...document.querySelectorAll('.publication-list article')];

function closeMenu() {
  nav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: '-25% 0px -55% 0px',
    threshold: [0.08, 0.24, 0.5],
  }
);

sections.forEach((section) => observer.observe(section));

function applyPublicationFilter(filter) {
  publications.forEach((publication) => {
    const matches =
      filter === 'all' ||
      publication.dataset.year === filter ||
      publication.dataset.type === filter;

    publication.hidden = !matches;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    applyPublicationFilter(filter);
  });
});

const activeFilter = filterButtons.find((button) => button.classList.contains('active'))?.dataset.filter ?? 'all';
applyPublicationFilter(activeFilter);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});
