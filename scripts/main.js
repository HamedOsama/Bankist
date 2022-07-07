'use strict';

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnAccounts = document.querySelector('.accounts-btn');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
btnAccounts.addEventListener('click', e => {
  e.preventDefault();
  window.location = 'accounts/accounts.html';
});
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
const scroller = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

scroller.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// delegation
const navbar = document.querySelector('.nav__links');
navbar.addEventListener('click', function (e) {
  if (e.target.classList.contains('accounts')) return;
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const place = document.getElementById(
      `${e.target.attributes.href.value.slice(1)}`
    );
    place.scrollIntoView({ behavior: 'smooth' });
  }
});
// TABS
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target;
  if (clicked.classList.contains('btn')) {
    // remove active classes
    let arr = [...clicked.parentElement.children];
    arr.forEach(el => el.classList.remove('operations__tab--active'));
    // active button
    clicked.classList.add('operations__tab--active');
    // remove active classes
    tabsContent.forEach(el =>
      el.classList.remove('operations__content--active')
    );
    // active area
    const tabNumber = clicked.getAttribute('data-tab');
    const content = document.querySelector(
      `.operations__content--${tabNumber}`
    );
    content.classList.add('operations__content--active');
  }
});

// navbar fade on hover
navbar.addEventListener('mouseover', function (e) {
  const clicked = e.target;
  const logo = clicked.closest('.nav').querySelector('img');
  if (clicked.classList.contains('nav__link')) {
    let arr = clicked.closest('.nav__links').querySelectorAll('.nav__link');
    arr.forEach(el => {
      if (el !== clicked) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
});
navbar.addEventListener('mouseout', function (e) {
  this.querySelectorAll('.nav__link').forEach(el => (el.style.opacity = 1));
  const logo = this.closest('.nav').querySelector('img');
  logo.style.opacity = 1;
});
// sticky navbar
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else nav.classList.add('sticky');
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

// reveal sections

const allSections = document.querySelectorAll('.section');
const enterSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    sectionObserver.unobserve(entry.target);
  }
};
const sectionObsOptions = {
  root: null,
  threshold: 0.2,
};
const sectionObserver = new IntersectionObserver(
  enterSection,
  sectionObsOptions
);
allSections.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});
sectionObserver.observe(section1);

// lazy images
const images = document.querySelectorAll('.features__img');
const enterImg = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.setAttribute('src', entry.target.dataset.src);
    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
    imgObserver.unobserve(entry.target);
  }
};

const imgObsOptions = {
  root: null,
  threshold: 0,
};
const imgObserver = new IntersectionObserver(enterImg, imgObsOptions);
images.forEach(img => imgObserver.observe(img));

//Slider
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
let currentSlide = 0;
let maxSlide = slides.length - 1;

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.innerHTML += `<button class="dots__dot" data-slide="${i}"></button>`;
  });
};
const goToSLide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(e => e.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const nextSlide = function () {
  if (currentSlide < maxSlide) goToSLide(++currentSlide);
  else goToSLide((currentSlide = 0));
  activeDot(currentSlide);
};
const prevSlide = function () {
  if (currentSlide > 0) goToSLide(--currentSlide);
  else goToSLide((currentSlide = maxSlide));
  activeDot(currentSlide);
};

const init = () => {
  createDots();
  goToSLide(0);
  activeDot(0);
};
init();
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});
dotContainer.addEventListener('click', function (e) {
  const slide = e.target.dataset.slide;
  if (e.target.classList.contains('dots__dot')) {
    goToSLide(slide);
    activeDot(slide);
    currentSlide = slide;
  }
});
