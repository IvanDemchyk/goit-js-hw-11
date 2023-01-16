import axios from 'axios';

export default async function getImages(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '32864795-1625d54ce1e282e5ee3f18099';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}${filter}`).then(response => response.data);
}
