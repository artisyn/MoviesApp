'use strict';

import Spinner from './spinner.js';

import * as Request from './request.js';

const searchCheck = document.querySelector('#search__check');
const searchLogo = document.querySelector('.search__logo');
const searchInput = document.querySelector('.input__text');
const slidingCheck = document.querySelector('#movie__checkbox');
const slidingMenu = document.querySelector('.sliding__menu');
const imdbRange = document.querySelector('#imdb__range');
const imdbDisplay = document.querySelector('.imdb__value');
const btnShow = document.querySelector('.btn__show');
const genresContainer = document.querySelector('.genres__container');
const mediaTypeChange = document.querySelectorAll('.media__radio');
const trendingBtn = document.querySelector('.trends');
const cardContainer = document.querySelector('.card__container');
const selectedCard = document.querySelector('.selected__card');
const selectedCardClose = document.querySelector('.selected__card--close');
const currentPageDisplay = document.querySelector('.current__page');
const pageBtnContainer = document.querySelector('.pagebtn__container');
const nextButton = document.querySelector('.nxt__btn');
const previousButton = document.querySelector('.prev__btn');
const mainTitle = document.querySelector('.main__title');
const footer = document.querySelector('footer');
const footerBtn = document.querySelector('.footer__btn');

let totalPages;
let currentSearch = {
  media: '',
  ids: '',
  rating: '',
  page: 1,
};

const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  110764: 'Reality',
  10763: 'News',
  110765: 'Sci-Fi & Fantasy',
  110766: 'Soap',
  110767: 'Talk',
  110768: 'War & Politics',
  137: 'Western',
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
};

// navHeight if needed
const scrollToElement = (element) => {
  const elCoords = element.getBoundingClientRect();
  window.scrollTo({
    left: elCoords.left + window.scrollX,
    top: elCoords.top + window.scrollY,
    behavior: 'smooth',
  });
};
const scrollToElementPlus = (element) => {
  const elCoords = element.getBoundingClientRect();
  window.scrollTo({
    left: elCoords.left + window.scrollX,
    top: elCoords.top + window.scrollY - 50, // to completely scroll to top
    behavior: 'smooth',
  });
};

footerBtn.addEventListener('click', (e) => {
  scrollToElement(footer);
});
btnShow.addEventListener('click', (e) => {
  scrollToElementPlus(document.querySelector('.main__container'));
});
trendingBtn.addEventListener('click', (e) => {
  scrollToElementPlus(document.querySelector('.main__container'));
});

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

searchCheck.addEventListener('change', () => {
  searchLogo.classList.toggle('rotate');
  searchInput.classList.toggle('no__opacity');
  searchInput.classList.toggle('no__click');
  if (searchCheck.checked === true) searchInput.focus();
});

slidingCheck.addEventListener('change', () => {
  slidingMenu.classList.toggle('slide__left');
});

imdbRange.addEventListener('change', () => {
  imdbDisplay.innerText = imdbRange.value;
});

selectedCardClose.addEventListener('click', () => {
  selectedCard.classList.add('display__none', 'no__opacity');
});

// Sidebar functions
// converting genres to html elements
const convertGenresToHtml = (genre) => {
  const markup = `
  <label class="genre__label" for="${genre.id}">
								<input
									class="genre__input"
									type="checkbox"
									id="${genre.id}"
								/>
								<div class="genre__container">
									<span class="genre__name">${genre.name.toUpperCase()}</span>
									<span class="genre__icon-check"
										><i class="fas fa-check"></i
									></span>
									<span class="genre__icon-close"
										><i class="fas fa-times"></i
									></span>
								</div>
							</label>
  
  `;
  genresContainer.insertAdjacentHTML('beforeend', markup);
};

const showGenres = async (media = 'movie') => {
  // clear the genres container
  genresContainer.innerHTML = '';
  // show loading spinner;
  genresContainer.innerHTML = Spinner;
  // wait for 1 sec to show spinner;
  await wait(1);
  // get genres
  const { genres } = await Request.listOfGenres(media);
  genresContainer.innerHTML = ''; // clear container;
  // show genres in sidebar
  genres.forEach((genre) => {
    convertGenresToHtml(genre);
  });
};

// Getting genres for media type on change;
mediaTypeChange.forEach((media) => {
  media.addEventListener('change', () => {
    showGenres(media.dataset.media);
  });
});

const testImg = document.querySelector('.image');

// cards related
const getMediaTitle = (result) => {
  if (result.title) return result.title;
  if (result.original_title) return result.original_title;
  if (result.name) return result.name;
  if (result.original_name) return result.original_name;
};

const showOnlyYear = (date) => {
  if (!date) return '';
  return date.split('-')[0];
};
// converting search to poster cards

// converting genre ids to genres;
const genreIdsToHtml = (genreArr) => {
  let markup = '';
  if (genreArr.length === 0)
    return `<div class="genres__color">Genre is unknown</div>`;

  genreArr.forEach((genreId) => {
    markup += `<div class="genres__color">${genreMap[genreId]}</div>`;
  });
  return markup;
};

const convertResultsToCards = (result) => {
  // convert genre ids to genres
  let genres = result.genre_ids;
  let date = result.release_date ? result.release_date : result.first_air_date;
  const markup = `
  <div class="card" id="${result.id}">
					<img
						class="card__poster"
						src="${Request.getPoster(result.poster_path)}"
						alt="poster"
					/>
					<h3 class="card__title">${getMediaTitle(result)}</h3>
					<h2 class="card__date">(${showOnlyYear(date)})</h2>

					<div class="card__genres no__opacity">
					${genreIdsToHtml(genres)}
					</div>

					<p class="card__text no__opacity">
						${result.overview}
					</p>
					<div class="card__rating no__opacity">${result.vote_average}</div>
				</div>
  
  `;

  cardContainer.insertAdjacentHTML('beforeend', markup);
};

// click to expand

const clearSelectedCard = () => {
  if (document.querySelector('.selected__container')) {
    document.querySelector('.selected__container').remove();
    document.querySelector('.selected__play').remove();
  }
};
/////////////////////////////////////////////////////
const fillSelectedGenres = (genres) => {
  let genresArr = Array.from(genres);
  if (genresArr.length === 1)
    return `<div class="selected__genre">${genres[0].innerText}</div>`;
  let markup = '';
  genresArr.forEach((genre) => {
    markup += `<div class="selected__genre">${genre.innerText}</div>`;
  });
  return markup;
};

const fillSelectedCard = (cardInfo) => {
  const title = cardInfo.querySelector('.card__title').innerText;
  const date = cardInfo.querySelector('.card__date').innerText;
  const text = cardInfo.querySelector('.card__text').innerText;
  const genres = cardInfo.querySelectorAll('.genres__color');
  const rating = cardInfo.querySelector('.card__rating').innerText;
  const posterUrl = cardInfo.querySelector('.card__poster').src;
  // console.log(title, date, text, genres, rating, posterUrl);
  clearSelectedCard();
  const markup = `
  <div class="selected__container">
					<div class="selected__poster">
						<img
							class="selected__poster"
							src="${posterUrl}"
							alt="poster"
						/>
					</div>
					<div class="selected__info">
						<h3 class="selected__title">${title}</h3>
						<div class="selected__date--genres">
							<h2 class="selected__date">${date.slice(1, -1)}</h2>
							<span class="circle"></span>
							<div class="selected__genres">
              ${fillSelectedGenres(genres)}
							</div>
						</div>
						<p class="selected__text">
							${text}
						</p>
					</div>
				</div>
				<div class="selected__play">
					<div class="selected__rating-container">
						<div class="selected__rating">
							<span class="selected__imdb">Imdb</span>
							<span class="selected__rating-value">${rating}</span>
						</div>
					</div>
					<button class="selected__play-btn">Play</button>
				</div>`;

  selectedCard.insertAdjacentHTML('beforeend', markup);
};

cardContainer.addEventListener('click', async (e) => {
  if (e.target.closest('.card')) {
    const cardInfo = e.target.closest('.card');
    selectedCard.classList.remove('display__none');
    fillSelectedCard(cardInfo);
    await wait(0.2);
    selectedCard.classList.remove('no__opacity');
  }
});

const showTrending = async () => {
  const { results } = await Request.searchTrending();
  mainTitle.innerText = 'Trending Today';
  cardContainer.innerHTML = Spinner;
  await wait(1);
  cardContainer.innerHTML = '';
  results.forEach((result) => {
    convertResultsToCards(result);
  });
};

// user search by keyword

const showSearchByKeyword = async (value) => {
  scrollToElementPlus(document.querySelector('.main__container'));
  mainTitle.innerText = 'Your Search Results';
  // get result based on user inputs
  cardContainer.innerHTML = Spinner;
  await wait(1);
  const { results, total_pages } = await Request.searchByValue(
    'movie',
    value,
    currentSearch.page
  );
  cardContainer.innerHTML = '';

  results.forEach((result) => {
    convertResultsToCards(result);
  });
};

searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && searchInput.value !== '') {
    showSearchByKeyword(searchInput.value);
    currentSearch.value = searchInput.value;
    searchInput.blur();
  }
});

// click trending
trendingBtn.addEventListener('click', showTrending);

// submitting search form
// movie or tv
const getMediaType = () => {
  let mediaX = '';
  mediaTypeChange.forEach((media) => {
    if (media.checked) mediaX = media.dataset.media;
  });
  return mediaX;
};
// active geres id or empty array
const getSelectedGenresIds = () => {
  const allSelectedGenres = document.querySelectorAll('.genre__input');
  const allIds = Array.from(allSelectedGenres).reduce((accu, el) => {
    if (el.checked === true) {
      accu.push(el.id);
    }
    return accu;
  }, []);
  return allIds;
};

const separateIds = (ids) => {
  return ids.reduce((accu, el, index, array) => {
    let x = el + '|';
    if (index === array.length - 1) x = el;
    accu += x;
    return accu;
  }, '');
};

// use id,id === and
// use id|id === or
const showUserSelectedMedia = async (mediaType, ids, rating, pageNumber) => {
  // separate ids
  const separatedIds = separateIds(ids);
  mainTitle.innerText = 'Your Search Results';
  // get result based on user inputs
  cardContainer.innerHTML = Spinner;
  await wait(1);
  const { total_pages, results } = await Request.searchByGenres(
    mediaType,
    separatedIds,
    rating,
    pageNumber
  );
  totalPages = +total_pages;
  // add result values for page navigation
  currentSearch.media = mediaType;
  currentSearch.ids = ids;
  currentSearch.rating = rating;

  // display results
  cardContainer.innerHTML = '';
  results.forEach((result) => {
    convertResultsToCards(result);
  });
  pageBtnContainer.classList.remove('display__none');
};

btnShow.addEventListener('click', (e) => {
  e.preventDefault();
  pageBtnContainer.classList.add('display__none');
  slidingMenu.classList.toggle('slide__left');

  const mediaType = getMediaType();

  const allIds = getSelectedGenresIds();

  let imdb = imdbRange.value;
  currentSearch.page = 1;
  currentPageDisplay.innerHTML = currentSearch.page;

  showUserSelectedMedia(mediaType, allIds, imdb);
});

nextButton.addEventListener('click', (e) => {
  const maxPage = totalPages < 10 ? totalPages : 10; // preventing search if there are no more pages
  if (currentSearch.page === maxPage) return;
  scrollToElementPlus(document.querySelector('.main__container'));
  pageBtnContainer.classList.add('display__none');
  currentSearch.page += 1;
  currentPageDisplay.innerHTML = currentSearch.page;
  showUserSelectedMedia(
    currentSearch.media,
    currentSearch.ids,
    currentSearch.rating,
    currentSearch.page
  );
});

previousButton.addEventListener('click', (e) => {
  if (currentSearch.page === 1) return;
  scrollToElementPlus(document.querySelector('.main__container'));
  pageBtnContainer.classList.add('display__none');
  currentSearch.page -= 1;
  currentPageDisplay.innerHTML = currentSearch.page;
  showUserSelectedMedia(
    currentSearch.media,
    currentSearch.ids,
    currentSearch.rating,
    currentSearch.page
  );
});

const showTopRated = async () => {
  const { results } = await Request.searchTopRated();
  cardContainer.innerHTML = Spinner;
  await wait(1);
  cardContainer.innerHTML = '';
  mainTitle.innerText = 'Top Rated Movies';
  results.forEach((result) => {
    convertResultsToCards(result);
  });
};

// #TODO

// add favorite to selected card
// add footer
// keep title always visible

// funcions on page start

// get genres for default value;
showGenres();
showTopRated();
