import error from './notify';
import galleryTemplate from '../templates/gallery.hbs';
import { Select } from './select/select';

const basicLightbox = require('basiclightbox');

const refs = {
  btnSearch: document.querySelector('.search-form__btn'),
  btnLoadMore: document.querySelector('.load-more_btn'),
  gallery: document.querySelector('.gallery'),
  query: document.querySelector('.search-form__input'),
  form: document.querySelector('.search-form'),
};

new Select('#select', {
  selectedId: '1',
  data: [
    { id: '1', value: 'en' },
    { id: '2', value: 'ru' },
    { id: '3', value: 'de' },
    { id: '4', value: 'fr' },
    { id: '5', value: 'it' },
  ],
  onSelect(item) {
    ImageFinder.lenguage = item.value;
  },
});

const ImageFinder = {
  key: 'key=18267918-a545f4b922b3d8b59313b99e1',
  page: 1,
  lenguage: 'en',
};

refs.btnSearch.addEventListener('click', onClickSearch);
refs.gallery.addEventListener('click', onImageClick);
window.addEventListener('scroll', loadMore);

function getURL() {
  return `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${ImageFinder.searchQuery}&page=${ImageFinder.page}&lang=${ImageFinder.lenguage}&per_page=12&${ImageFinder.key}`;
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

function loadMore() {
  const windowRelativeBottom = document.documentElement.getBoundingClientRect()
    .bottom;
  if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
    ImageFinder.page += 1;
    const URL = getURL();
    getData(URL).then(generateLayout);
  }
}
