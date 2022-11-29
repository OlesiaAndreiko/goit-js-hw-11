// console.log('hello');
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// console.log(axios);
// Notify.failure('Qui timide rogat docet negare');
// Notify.info('Cogito ergo sum');
// console.log(SimpleLightbox);

const BASE_URL = 'pixabay.com/api/';
const API_KEY = '31672084-87e680c1be7fd52a9d7861da9';
const params = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = '40';
let page = 1;

const galleryList = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');
// const loadMoreBtn = document.querySelector('.load-more')
const guard = document.querySelector('.guard-js');
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let observer = new IntersectionObserver(infiniteScroll, options);

searchForm.addEventListener('submit', onSearchImages);
// loadMoreBtn.addEventListener('click', onLoadMore)

async function fetchGalleryImages(q) {
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

  const searchValue = evt.target.searchQuery.value.toLowerCase();
  // console.log(searchValue);

  if (!searchValue) {
    noTopic();
    return;
  }

  fetchGalleryImages(searchValue).then(resp => {
    if (!resp.data.hits.length) {
      // console.log('resp', resp);
      notFoundImages();
      return;
    }
    totalImagesSuccess(resp.data.totalHits);
    createGalleryImages(resp.data.hits);

    observer.observe(guard);
    // loadMoreBtn.removeAttribute("hidden");
  });
}

// function onLoadMore() {
//   page += 1;
//   fetchGalleryImages(q, page).then(resp => {
//     createGalleryImages(resp.data.hits);
//   });
// }

function createGalleryImages(arr) {
  const markup = arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes${likes}</b>
    </p>
    <p class="info-item">
      <b>Views${views}</b>
    </p>
    <p class="info-item">
      <b>Comments${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
}

function cleanerMarkup() {
  galleryList.innerHTML = '';
}

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

function infiniteScroll(entries, observer) {
  console.log(entries);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchGalleryImages(page).then(resp => {
        createGalleryImages(resp.data.hits);
        const pages = countPages(Number(resp.data.totalHits), Number(PER_PAGE));
        if (pages === page) {
          endOfHits();
          observer.unobserve(guard);
        }
      });
    }
  });
}

function countPages(totalHits, perPege) {
  return Math.ceil(totalHits / perPege);
}
