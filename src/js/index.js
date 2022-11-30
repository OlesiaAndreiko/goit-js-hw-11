import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchGalleryImages from './components/fetchImages';
import * as myNotify from './components/notifyInforming';

const PER_PAGE = '40';
let searchValue = '';
let page = 1;

const galleryList = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');
const guard = document.querySelector('.guard-js');
let options = {
  root: null,
  rootMargin: '500px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(infiniteScroll, options);
const simpleligthbox = new SimpleLightbox('.gallery a', { captionDelay: 300 });

searchForm.addEventListener('submit', onSearchImages);


function onSearchImages(evt) {
  evt.preventDefault();

  cleanerMarkup();

  searchValue = evt.target.searchQuery.value;

  fetchGalleryImages(searchValue, page).then(resp => {
    // console.log('resp', resp);

    if (!searchValue.length) {
      myNotify.noTopic(); 
      return;
    } 

    if (!resp.data.hits.length) {
      myNotify.notFoundImages();
      return;
    } 
    
    myNotify.totalImagesSuccess(resp.data.totalHits);
    createGalleryImages(resp.data.hits);

    observer.observe(guard);
  });
}

function infiniteScroll(entries, observer) {
  // console.log(entries);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      console.log(page);

      fetchGalleryImages(searchValue, page).then(resp => {
        createGalleryImages(resp.data.hits);

        const pages = countPages(Number(resp.data.totalHits), Number(PER_PAGE));

        if (pages === page) {
          observer.unobserve(guard);
          myNotify.endOfHits();
        }

        smoothScroll();
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
  <a class="gallery__item" href="${largeImageURL}">        
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div> 
</div>`
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);

  // відображення великої версії зображення з бібліотекою SimpleLightbox для повноцінної галереї
  simpleligthbox.refresh();
}

// плавне прокручування сторінки
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  console.log('hello');

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  console.log('Trololo');
}

function cleanerMarkup() {
  galleryList.innerHTML = '';
}

function countPages(totalHits, perPege) {
  return Math.ceil(totalHits / perPege);
}
