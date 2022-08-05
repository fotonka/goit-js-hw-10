// export function fetchCountries(name) {
//   const url = `https://restcountries.com/v3.1/${name}?fields=name,capital,population,flags,languages`;

//   return fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       console.log('data', data);
//     })
//     .catch(error => {
//       console.log('error', error);
//     });
// }

const url = 'https://restcountries.com/v3.1/name/';
const fields = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${url}${name}?${fields}`)
    .then(response => response.json())
    .catch(error => console.log(error));
}
