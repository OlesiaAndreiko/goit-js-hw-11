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
const params = 'image_type=photo&orientation=horizontal&safesearch =true';

const galleryList = document.querySelector('.gallery');

async function getGallery(q = 'dog') {
  try {
    const response = await axios.get(
      `https://${BASE_URL}?key=${API_KEY}&${params}&q=${q}`
    );
    return response;
  } catch (e) {
    console.error(e);
  }
}

getGallery().then(resp => {
  console.log('resp', resp);
  createGallery(resp.data);
  console.log(resp.data);
})

function createGallery(arr) {
  console.log(arr);
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
