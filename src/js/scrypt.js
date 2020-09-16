import error from './notify';
import galleryTemplate from '../templates/gallery.hbs';

const basicLightbox = require('basiclightbox');

const refs = {
  btnSearch: document.querySelector('.search-form__btn'),
  btnLoadMore: document.querySelector('.load-more_btn'),
  gallery: document.querySelector('.gallery'),
  query: document.querySelector('.search-form__input'),
  form: document.querySelector('.search-form'),
};

const ImageFinder = {
  key: 'key=18267918-a545f4b922b3d8b59313b99e1',
  page: 1,
};

refs.btnSearch.addEventListener('click', onClickSearch);
refs.btnLoadMore.addEventListener('click', onClickLoadMore);
refs.gallery.addEventListener('click', onImageClick);

function getURL() {
  return `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${ImageFinder.searchQuery}&page=${ImageFinder.page}&per_page=12&${ImageFinder.key}`;
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  const { hits, total } = data;
  return { hits, total };
}

function generateLayout(data) {
  const layout = galleryTemplate(data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', layout);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function onImageClick(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const src = event.target.dataset.source;
  basicLightbox
    .create(
      `
  	<img width="1400" height="900" src=${src}>
  `,
    )
    .show();
}

function onClickSearch(event) {
  event.preventDefault();
  clearGallery();
  ImageFinder.page = 1;
  ImageFinder.searchQuery = refs.query.value;
  const URL = getURL();
  getData(URL).then(generateLayout);
}

function onClickLoadMore(event) {
  ImageFinder.page += 1;
  const URL = getURL();
  getData(URL).then(generateLayout);
}
