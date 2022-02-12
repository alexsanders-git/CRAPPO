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
const burgerClose = document.querySelector('.header__burger-close');
const menu = document.querySelector('.header__menu');

const openMenu = () => {
  menu.classList.add('active');
  burger.classList.add('active');
  burgerClose.classList.add('active');
  disableScroll();
}

burger.addEventListener('click', openMenu);

const closeMenu = () => {
  menu.classList.remove('active');
  burger.classList.remove('active');
  burgerClose.classList.remove('active');
  enableScroll();
}

burgerClose.addEventListener('click', closeMenu);

const menuItem = document.querySelectorAll('.menu_link');

menuItem.forEach(el => el.addEventListener('click', closeMenu));

// Модальное окно
const authorization = document.querySelector('.header__authorization');
const modal = document.querySelectorAll('.modal');
const modalLogin = document.querySelector('.modal-login');
const modalRegister = document.querySelector('.modal-register');
const modalClose = document.querySelectorAll('.modal_close');

const openModal = (modalName) => {
  modalName.classList.add('active');
  closeMenu();
  disableScroll();

  menu.classList.remove('active');
  burger.classList.remove('active');
}

authorization.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('header__login')) {
    openModal(modalLogin);
  }

  if (target.classList.contains('header__register')) {
    openModal(modalRegister);
  }
});

const closeModal = (modalName) => {
  modalName.classList.remove('active');
  closeMenu();
}

modalClose.forEach(elem => {
  elem.addEventListener('click', (event) => {
    const parent = elem.parentNode.parentNode;

    if (parent.classList.contains('modal-login')) {
      closeModal(modalLogin);
    }

    if (parent.classList.contains('modal-register')) {
      closeModal(modalRegister);
    }
  })
});

modal.forEach(elem => {
  elem.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('modal-login')) {
      closeModal(modalLogin);
    }

    if (target.classList.contains('modal-register')) {
      closeModal(modalRegister);
    }
  })
});


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