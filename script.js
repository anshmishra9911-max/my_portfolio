document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* --- hero headline: split into words so they can slide up in sequence --- */
$$('[data-split]').forEach(el => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) =>
    `<span class="word"><span style="transition-delay:${0.15 + i * 0.12}s">${w}</span></span>`).join(' ');
});
window.addEventListener('load', () => requestAnimationFrame(() => document.body.classList.add('is-loaded')));

/* --- scroll reveal --- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* --- nav: shrink + blur after the hero, mobile toggle --- */
const nav = $('.nav');
const onScroll = () => {
  nav.classList.toggle('is-scrolled', scrollY > 60);
  const bg = $('[data-parallax]');
  if (bg && !reduce) bg.style.transform = `translate3d(0,${scrollY * .25}px,0)`;
};
onScroll(); addEventListener('scroll', onScroll, { passive: true });
const toggle = $('.nav__toggle'), links = $('.nav__links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});

/* --- page transitions --- */
const fade = document.createElement('div');
fade.className = 'page-fade'; document.body.appendChild(fade);
addEventListener('pageshow', () => fade.classList.remove('is-on'));
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname === location.pathname) return;
  e.preventDefault(); fade.classList.add('is-on');
  setTimeout(() => location.href = url.href, reduce ? 0 : 350);
});

/* --- custom cursor + magnetic buttons (mouse only) --- */
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
  const dot = document.createElement('div');
  dot.className = 'cursor'; document.body.appendChild(dot);
  addEventListener('mousemove', e => {
    dot.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; dot.classList.add('is-on');
  });
  document.addEventListener('mouseover', e => dot.classList.toggle('is-big', !!e.target.closest('a,button,.skill,.strip__item')));
  $$('.btn').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
}

/* --- cookie banner --- */
const cookie = $('.cookie');
if (cookie) {
  let seen = null;
  try { seen = localStorage.getItem('cookie-choice'); } catch (e) {}
  cookie.hidden = !!seen;
  $$('[data-cookie]', cookie).forEach(b => b.addEventListener('click', () => {
    try { localStorage.setItem('cookie-choice', b.dataset.cookie); } catch (e) {}
    cookie.hidden = true;
  }));
}

/* --- project modal (native <dialog>: Esc + focus handling for free) --- */
const modal = $('#project-modal');
if (modal) {
  $$('.project-card__btn').forEach(btn => btn.addEventListener('click', () => {
    const d = btn.dataset;
    $('#m-title').textContent = d.title; $('#m-desc').textContent = d.long;
    $('#m-tags').innerHTML = d.tags.split(',').map(t => `<li>${t.trim()}</li>`).join('');
    $('#m-link').href = d.link || '#';
    modal.showModal();
  }));
  $('.modal__close', modal).addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
}

/* --- contact form: opens the visitor's mail app (no backend needed) --- */
const form = $('#contact-form');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(form);
  const body = encodeURIComponent(`${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`);
  location.href = `mailto:anshmishra9911@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + f.get('name'))}&body=${body}`;
  $('.form__note').textContent = 'Opening your mail app…';
});

const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
