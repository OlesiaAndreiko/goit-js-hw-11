import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Для повідомлень використана бібліотека notiflix.

export function notFoundImages() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

export function totalImagesSuccess(amount) {
  Notify.success(`Hooray! We found ${amount} images.`);
}

export function noTopic() {
  Notify.warning('Please, enter the search term');
}

export function endOfHits() {
  Notify.info(`We're sorry, but you've reached the end of search results.`);
}
