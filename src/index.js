import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function failedInput() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function tooManyCountries() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function onCountryInput() {
  const name = inputRef.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfoRef.innerHTML = '');
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfoRef.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML('beforeend', renderMarkup(countries));
        countryInfoRef.insertAdjacentHTML(
          'beforeend',
          renderCountryInfoRef(countries)
        );
      } else if (countries.length >= 10) {
        tooManyCountries();
      } else {
        countryList.insertAdjacentHTML('beforeend', renderMarkup(countries));
      }
    })
    .catch(failedInput);
}

function renderMarkup(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__li">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
  return markup;
}

function renderCountryInfoRef(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__li"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__li"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__li"><p><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}
