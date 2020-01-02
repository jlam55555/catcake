const nav_bar_nav = document.querySelector('.nav-bar');
const nav_close_button = document.querySelector('.nav-close');
const search_bar_div = document.querySelector('.search-bar');
const search_bar_close_button = document.querySelector('.search-bar-close');
const gallery_div = document.querySelector('.gallery');

let search_bar_open = nav_bar_open = false;

// use gallery_div to check if gallery page equipped
// the search_bar_open and nav_bar_open are a little redundant, but there
// for (a little) easee and clarity

nav_close_button.addEventListener('click', () => {
  nav_bar_nav.classList.toggle('open');
  if((nav_bar_open = !nav_bar_open) && search_bar_open) {
    search_bar_div.classList.remove('open');
    // gallery_div.classList.remove('search-bar-open');
    search_bar_open = false;
  }
});

if(gallery_div)
  search_bar_close_button.addEventListener('click', () => {
    search_bar_div.classList.toggle('open');
    // gallery_div.classList.toggle('search-bar-open');
    if((search_bar_open = !search_bar_open) && nav_bar_open) {
      nav_bar_nav.classList.remove('open');
      nav_bar_open = false;
    }
  });

// implement lazy-loading images; callable if changes are made to the DOM
const lazy_load_images = () => {
  document.querySelectorAll('[data-bgimg]').forEach(image_elem => {
    image_elem.style.setProperty('background-image', 
      `url(${image_elem.getAttribute('data-bgimg')})`);
    image_elem.removeAttribute('data-bgimg');
  });
  document.querySelectorAll('[data-img]').forEach(image_elem => {
    image_elem.setAttribute('src', image_elem.getAttribute('data-img'));
    image_elem.removeAttribute('data-img');
  });
};
lazy_load_images();
