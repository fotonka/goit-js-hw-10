import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 500;

const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

const failedInput = () => {
  Notiflix.Notify.failure('Oops, there is no country with that name');
};

const tooManyCountries = () => {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
};

const rendercountryListMarkup = country => {
  return country
    .map(({ name, flags }) => {
      return ` <li class="country-list__li">
		<img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
		<h2 class="country-list__name">${name.official}</h2>
	</li>`;
    })
    .join('');
};

const rendercountryInfoMarkup = country => {
  return country
    .map(({ capital, population, languages }) => {
      return `<ul class="country-info__list">
		<li class="country-info__li"><p><b>Capital: </b>${capital}</p></li>
		<li class="country-info__li"><p><b>Population: </b>${population}</p></li>
		<li class="country-info__li"><p><b>Languages: </b>${Object.values(
      languages
    ).join(', ')}</p></li>
</ul>`;
    })
    .join('');
};

function onInput() {
  const name = inputRef.value.trim();
  if (name === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
  }

  fetchCountries(name)
    .then(countries => {
      countryInfo.innerHTML = '';
      countryList.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          rendercountryListMarkup(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          rendercountryInfoMarkup(countries)
        );
      } else if (countries.length >= 10) {
        tooManyCountries();
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          rendercountryListMarkup(countries)
        );
      }
    })
    .catch(failedInput);
}
