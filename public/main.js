const submit = document.querySelector('button[type="submit"]');
const showAllCountriesAndCapitals = document.getElementById('showAllCountriesAndCapitals');
const showAllCountries = document.getElementById('showAllCountries');
const showAllCapitals = document.getElementById('showAllCapitals');

/**
 *
 * @param {string} url : url to reach by the api to get data
 * @param {*} obj : information about parameters to send to the api
 */
function getApiData(url = '/api/random',obj = {}, el) {

  // fetch data from api and return result or error
  fetch(url,  {
    // Adding method type
    method: "POST",

    // Adding body or contents to send
    body: JSON.stringify(obj),

    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
  .then(res=>res.json())
  .then(data=> {
      el.textContent = JSON.stringify(data);
  })
  .catch(err=>{console.error(err)});

}


submit.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  const search = document.getElementById('search').value;
  const filter = document.querySelector('input[name="filter"]:checked').value;
    // Adding body or contents to send
    obj = {
        search: search,
        filter: filter
    };
    getApiData('/api/filter',obj,document.getElementById('filterResult'));
})

/**
 * retrieve all the capitals name
 */
showAllCapitals.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  getApiData('/api/list',{filter: 'capitals'},document.getElementById('showAll'))
})

/**
 * retrieve all countries name
 */
showAllCountries.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  getApiData('/api/list',{filter: 'countries'},document.getElementById('showAll'))
})

/**
 * retrieve all countries and capitals names
 */
showAllCountriesAndCapitals.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  getApiData('/api/list',{},document.getElementById('showAll'))
})
