// ===== PRELOADER =====
window.addEventListener('load', function () {
  setTimeout(function () {
    var pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
  }, 700);
});

// ===== HEADER SCROLL SHADOW =====
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();

// ===== MOBILE NAV =====
(function () {
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', function () {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
  });
})();

// ===== TOAST =====
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2800);
}

// ===== SCROLL REVEAL =====
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  function setup() {
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(setup, 50);
  } else {
    document.addEventListener('DOMContentLoaded', setup);
  }
})();

// ===== CONTACT FORM -> WHATSAPP =====
function handleContactForm(e) {
  e.preventDefault();
  var form = e.target;
  var name = form.querySelector('[name="name"]')?.value || '';
  var phone = form.querySelector('[name="phone"]')?.value || '';
  var msg = form.querySelector('[name="message"]')?.value || '';
  var text = encodeURIComponent('Hello Al-Wazaan! My name is ' + name + (phone ? ' (Phone: ' + phone + ')' : '') + '. ' + msg);
  window.open('https://wa.me/96896149264?text=' + text, '_blank');
  showToast('Opening WhatsApp...');
  form.reset();
  return false;
}

// ===== LIGHTBOX (gallery + menu photos) =====
function openLightbox(src, alt) {
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var img = lb.querySelector('img');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('open');
}
function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
}
