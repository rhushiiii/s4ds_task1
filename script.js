document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');

  const normalize = (val) => (val === 'dark' ? 'dark' : 'light');
  const apply = (mode) => {
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (toggle) {
      const isDark = mode === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    }
    localStorage.setItem('theme', mode);
  };

  // Initial theme
  const saved = localStorage.getItem('theme');
  const initial = normalize(saved);
  apply(initial);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
    });
  }

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Form submitted!');
    });
  }
});
