import error from './notify';

const refs = {
  btnSearch: document.querySelector('.search-form__btn'),
  btnLoadMore: document.querySelector('.load-more_btn'),
  gallery: document.querySelector('.gallery'),
  query: document.querySelector('.search-form__input'),
  form: document.querySelector('.search-form'),
};

refs.btnSearch.addEventListener('click', onClickSearch);

function getURL(query, page) {
  const key = `key=18267918-a545f4b922b3d8b59313b99e1`;
  return `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&${key}`;
}

function getData(url) {
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Ошибка по адресу ${url}, 
      статус ошибки ${response.status}!`);
    })
    .then(({ hits }) => hits)
    .catch(err => {
      error({
        title: 'Wrong query! Please try again',
      });
    });
}

function onClickSearch(event) {
  event.preventDefault();
  const searchQuery = refs.query.value;
  const currentPage = 1;
  const URL = getURL(searchQuery, currentPage);
  const data = getData(URL);
}
