// Отключаем скрол 
const body = document.body;
const fixBlocks = document.querySelectorAll('.fix-block');

let disableScroll = function () {
  let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
  let pagePosition = window.scrollY;
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  body.style.paddingRight = paddingOffset;
  body.classList.add('disable-scroll');
  body.dataset.position = pagePosition;
  body.style.top = -pagePosition + 'px';
}

let enableScroll = function () {
  let pagePosition = parseInt(document.body.dataset.position, 10);
  body.style.top = 'auto';
  body.classList.remove('disable-scroll');
  fixBlocks.forEach((el) => {
    el.style.paddingRight = '0px';
  });
  body.style.paddingRight = '0px';
  window.scroll({
    top: pagePosition,
    left: 0
  });
  body.removeAttribute('data-position');
}

// Burger menu
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__menu');

const openMenu = () => {
  menu.classList.toggle('active');
  burger.classList.toggle('active');
  disableScroll();
}

burger.addEventListener('click', openMenu);

const closeMenu = () => {
  menu.classList.remove('active');
  burger.classList.remove('active');
  enableScroll();
}

const menuItem = document.querySelectorAll('.menu_link');

menuItem.forEach(el => el.addEventListener('click', closeMenu));

// Модальное окно
const headerLogin = document.querySelector('.header__login');
const headerRegister = document.querySelector('.header__register');
const modal = document.querySelector('.modal');
const modalRegister = document.querySelector('.modal-register');
const modalClose = document.querySelectorAll('.modal_close');
const overlay = document.querySelector('.overlay');

const openModal = () => {
  modal.classList.add('active');
  disableScroll();

  menu.classList.remove('active');
  burger.classList.remove('active');
}

headerLogin.addEventListener('click', openModal);

const openModalRegister = () => {
  modalRegister.classList.add('active');
  disableScroll();

  menu.classList.remove('active');
  burger.classList.remove('active');
}

headerRegister.addEventListener('click', openModalRegister);

const closeModal = () => {
  modal.classList.remove('active');
  modalRegister.classList.remove('active');
  enableScroll();
}

modalClose.forEach(el => el.addEventListener('click', closeModal));
overlay.addEventListener('click', closeModal);

// Плавный скролл 
document.querySelectorAll('a[href^="#"').forEach(link => {

  link.addEventListener('click', function (e) {
    e.preventDefault();

    let href = this.getAttribute('href').substring(1);

    const scrollTarget = document.getElementById(href);

    const topOffset = document.querySelector('.header').offsetHeight;
    // const topOffset = 0; // если не нужен отступ сверху 
    const elementPosition = scrollTarget.getBoundingClientRect().top;
    const offsetPosition = elementPosition - topOffset;

    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});