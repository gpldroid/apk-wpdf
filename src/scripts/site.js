const root = document.documentElement;
const menuButton = document.querySelector('#mobileMenuToggle');
const navigation = document.querySelector('#siteNav');
const themeButton = document.querySelector('#themeToggle');

menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation?.classList.toggle('is-open', !expanded);
});

navigation?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

try {
  if (localStorage.getItem('wpdf-theme') === 'dark') root.classList.add('dark-mode');
} catch {}

themeButton?.addEventListener('click', () => {
  const dark = root.classList.toggle('dark-mode');
  try { localStorage.setItem('wpdf-theme', dark ? 'dark' : 'light'); } catch {}
  themeButton.setAttribute('aria-label', dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
});
