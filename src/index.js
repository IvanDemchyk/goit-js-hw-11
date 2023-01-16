import getImages from './js/getImages';
import './sass/index.scss';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const message = document.querySelector('.end-text');

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

input.addEventListener('submit', searchImageSubmit);

async function searchImageSubmit(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.searchQuery.value;

  currentPage = 1;

  if (searchQuery === '') {
    gallery.innerHTML = '';
    loadBtn.classList.add('is-hidden');
    return;
  }

  const response = await getImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadBtn.classList.remove('is-hidden');
    message.classList.add('is-hidden');
  } else {
    loadBtn.classList.add('is-hidden');
    message.classList.remove('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      console.log(response.hits);
      createGallery(response.hits);
      lightbox.refresh();

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }
    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
}

loadBtn.addEventListener('click', loadMoreImages);

async function loadMoreImages() {
  currentPage += 1;
  const response = await getImages(searchQuery, currentPage);
  createGallery(response.hits);
  currentHits += response.hits.length;
  lightbox.refresh();

  if (currentHits === response.hits.length) {
    loadBtn.classList.add('is-hidden');
    message.classList.remove('is-hidden');
  }
}

function createGallery(arr) {
  const markup = arr
    .map(
      item =>
        `<div class="photo__card">
        <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>

  <div class="info">
    <p class="info__item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info__item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info__item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info__item">
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
