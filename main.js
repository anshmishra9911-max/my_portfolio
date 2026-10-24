// Ansh Mishra portfolio – interactions

const curtain = document.querySelector('.curtain');
const menu = document.querySelector('.menu');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. page enter: curtain slides away
window.addEventListener('pageshow', () => {
  curtain.classList.remove('in');
  curtain.classList.add('out');
});

// 2. page leave: curtain covers screen, then we navigate
document.querySelectorAll('a[href]').forEach(link => {
  const url = link.getAttribute('href');
  const internal = url && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('http') && !link.target;
  if (!internal || reduceMotion) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    curtain.classList.remove('out');
    curtain.classList.add('in');
    setTimeout(() => { window.location.href = url; }, 650);
  });
});

// 3. full screen menu
const toggleMenu = open => {
  menu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
document.querySelector('.menu-btn').addEventListener('click', () => toggleMenu(true));
document.querySelector('.menu .close').addEventListener('click', () => toggleMenu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// 4. reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  io.observe(el);
});

// 5. custom cursor that grows over links and buttons
const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(hover: hover)').matches) {
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cursor.style.opacity = 1; });
  const follow = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(follow);
  };
  follow();
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
}

// 6. small 3D tilt on project cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (reduceMotion) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// 7. magnetic buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    if (reduceMotion) return;
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// 8. show initials if the photo is missing
document.querySelectorAll('.photo img').forEach(img => {
  img.addEventListener('error', () => img.parentElement.classList.add('no-photo'));
  if (img.complete && img.naturalWidth === 0) img.parentElement.classList.add('no-photo');
});

// 9. contact form opens the visitor's mail app (no backend needed)
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent('Portfolio message from ' + data.get('name'));
    const body = encodeURIComponent(data.get('message') + '\n\n' + data.get('name') + ' (' + data.get('email') + ')');
    window.location.href = `mailto:anshmishra9911@gmail.com?subject=${subject}&body=${body}`;
  });
}
