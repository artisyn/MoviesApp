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

btnShow.addEventListener('click', (e) => {
  e.preventDefault();

  const mediaType = getMediaType();

  const allIds = getSelectedGenresIds();

  let imdb = imdbRange.value;

  console.log(mediaType);
  console.log(imdb);
  console.log(allIds);
});

const testImg = document.querySelector('.image');

// funcions on page start

// get genres for default value;
showGenres();

// cards related
const getMediaTitle = (result) => {
  if (result.title) return result.title;
  if (result.original_title) return result.original_title;
  if (result.name) return result.name;
  if (result.original_name) return result.original_name;
};

const showOnlyYear = (date) => {
  return date.split('-')[0];
};
// converting search to poster cards
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
						<div class="genres__color">Action</div>
						<div class="genres__color">Romance</div>
						<div class="genres__color">Thriller</div>
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
const fillSelectedGenres = (genres) => {
  let genresArr = genres.split(' ');
  if (genresArr.length === 1)
    return `<div class="selected__genre">${genres}</div>`;
  let markup = '';
  genresArr.forEach((genre) => {
    markup += `<div class="selected__genre">${genre}</div>`;
  });
  return markup;
};

const fillSelectedCard = (cardInfo) => {
  console.log(cardInfo);
  const title = cardInfo.querySelector('.card__title').innerText;
  const date = cardInfo.querySelector('.card__date').innerText;
  const text = cardInfo.querySelector('.card__text').innerText;
  const genres = cardInfo.querySelector('.card__genres').innerText;
  const rating = cardInfo.querySelector('.card__rating').innerText;
  const posterUrl = cardInfo.querySelector('.card__poster').src;
  console.log(title, date, text, genres, rating, posterUrl);
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
  console.log(results);
  results.forEach((result) => {
    convertResultsToCards(result);
  });
};

// click trending
trendingBtn.addEventListener('click', showTrending);

// figure out genres
