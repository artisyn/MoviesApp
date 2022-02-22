'use strict';
const API_KEY = '81b5ac86648fd04fe0a5696982f88fc4';

// requesting genres by type tv or movie;

const listOfGenres = async (type) => {
  try {
    const x = await fetch(
      `https://api.themoviedb.org/3/genre/${type}/list?api_key=${API_KEY}`
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

// requesting top rated movies or tv shows, page number
const SearchTopRated = async (type, pageNumber) => {
  try {
    const x = await fetch(
      `https://api.themoviedb.org/3/${type}/top_rated?&api_key=${API_KEY}&language=en-US&page=${pageNumber}`
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

// movies or tv shows by search value

const searchByValue = async (type, searchVal, pageNumber = 1) => {
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

// trending type - all/movies/tv  period - day/week

const searchTrending = async (type, period) => {
  try {
    const x = await fetch(
      `https://api.themoviedb.org/3/trending/${type}/${period}?api_key=${API_KEY}`
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

// search by genre (id) and type
const searchByGenres = async (type, genreId) => {
  try {
    const x = await fetch(
      `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}`
    );

    console.log(x);
    const c = await x.json();
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};

// getting full poster url
const getPoster = (url, width = 500) => {
  // poster with 500 width; + path;

  return `https://image.tmdb.org/t/p/w${width}${url}`;
};

export {
  getPoster,
  searchByGenres,
  searchTrending,
  searchByValue,
  SearchTopRated,
  listOfGenres,
};
