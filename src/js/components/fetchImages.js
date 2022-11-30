import axios from 'axios';

const BASE_URL = 'pixabay.com/api/';
const API_KEY = '31672084-87e680c1be7fd52a9d7861da9';
const params = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = '40';

export default async function fetchGalleryImages(q, page = 1) {
  try {
    const response = await axios.get(
      `https://${BASE_URL}?key=${API_KEY}&${params}&per_page=${PER_PAGE}&page=${page}&q=${q}`
    );
    return response;
  } catch (err) {
    console.error(err);
  }
}
