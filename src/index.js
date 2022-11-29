import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'pixabay.com/api/';
const API_KEY = '31672084-87e680c1be7fd52a9d7861da9';
const params = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = '40';
let searchValue = '';
let page = 1;

const galleryList = document.querySelector('.gallery');

const searchForm = document.querySelector('#search-form');
const guard = document.querySelector('.guard-js');
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let observer = new IntersectionObserver(infiniteScroll, options);
const simpleligthbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

searchForm.addEventListener('submit', onSearchImages);

async function fetchGalleryImages(q, page = 1) {
  try {
    const response = await axios.get(
      `https://${BASE_URL}?key=${API_KEY}&${params}&per_page=${PER_PAGE}&page=${page}&q=${q}`
    );
    return response;
  } catch (err) {
    console.error(err);
  }
}

function onSearchImages(evt) {
  evt.preventDefault();

  cleanerMarkup();

  searchValue = evt.target.searchQuery.value.toLowerCase();
  // console.log(searchValue);

  if (!searchValue) {
    noTopic();
    return;
  }

  fetchGalleryImages(searchValue, page).then(resp => {
    if (!resp.data.hits.length) {
      // console.log('resp', resp);
      notFoundImages();
      return;
    }
    totalImagesSuccess(resp.data.totalHits);
    createGalleryImages(resp.data.hits);

    observer.observe(guard);
  });
}

function infiniteScroll(entries, observer) {
  // console.log(entries);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchGalleryImages(searchValue, page).then(resp => {
        createGalleryImages(resp.data.hits);

        ////////// плавне прокручування сторінки???

        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
        /////////// плавне прокручування сторінки???

        const pages = countPages(Number(resp.data.totalHits), Number(PER_PAGE));

        if (pages === page) {
          observer.unobserve(guard);
          endOfHits();
        }
      });
    }
  });
}

function createGalleryImages(arr) {
  const markup = arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <div>
    <a class="gallery__item" href="${largeImageURL}">        
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </div>
  <div class="info">
    <p class="info-item">
      <b>Likes<span>${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views<span>${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments<span>${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads<span>${downloads}</span></b>
    </p>
  </div>
  </a>
</div>
`
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);

  // відображення великої версії зображення з бібліотекою SimpleLightbox для повноцінної галереї
  simpleligthbox.refresh();
}

function cleanerMarkup() {
  galleryList.innerHTML = '';
}

function countPages(totalHits, perPege) {
  return Math.ceil(totalHits / perPege);
}

// Для повідомлень використана бібліотека notiflix.

function notFoundImages() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function totalImagesSuccess(amount) {
  Notify.success(`Hooray! We found ${amount} images.`);
}

function noTopic() {
  Notify.warning('Please, enter the search term');
}

function endOfHits() {
  Notify.info(`We're sorry, but you've reached the end of search results.`);
}
