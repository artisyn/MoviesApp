'use strict';
const API_KEY = '81b5ac86648fd04fe0a5696982f88fc4';

// Movie db functions

const getPoster = (url, width = 500) => {
  // poster with 500 width; + path;

  return `https://image.tmdb.org/t/p/w${width}${url}`;
};

const getLogo = (url, width = 'original') => {
  return `https://image.tmdb.org/t/p/${width}/${url}`;
};

const trendingMovies = async () => {
  try {
    const x = await fetch(
      'https://api.themoviedb.org/3/trending/all/day?api_key=81b5ac86648fd04fe0a5696982f88fc4'
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

const searchRequest = async (type, searchVal, pageNumber = 1) => {
  try {
    const x = await fetch(
      `https://api.themoviedb.org/3/search/${type}?query=${searchVal}&api_key=${API_KEY}&page=${pageNumber}`
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

const popularMovies = async () => {
  const x = await fetch(
    'https://api.themoviedb.org/3/movie/popular?api_key=81b5ac86648fd04fe0a5696982f88fc4&language=en-US&page=1'
  );

  console.log(x);
  const c = await x.json();
  console.log(c);
};

const topRated = async (type, pageNumber) => {
  try {
    const x = await fetch(
      `https://api.themoviedb.org/3/${type}/top_rated?api_key=81b5ac86648fd04fe0a5696982f88fc4&language=en-US&page=${pageNumber}`
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

const genres = async (type) => {
  try {
    const x = await fetch(
      `https://api.themoviedb.org/3/genre/${type}/list?api_key=${API_KEY}&with_genres=27`
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

// topRated();
// popularMovies();
// trendingMovies();
// searchRequest('tv', 'diaries', 2);

// topRated('movie', 2);
genres();
