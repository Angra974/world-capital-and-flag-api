const submit = document.querySelector('#submit');
const submitFlag = document.querySelector('#submitFlag');
const submitRandom = document.querySelector('#submitRandom');
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
 * get the flag based on a country or a capital name
 */
submitFlag.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  const search = document.getElementById('searchFlag').value;
  const filter = document.querySelector('input[name="filterFlag"]:checked').value;
  const size = document.querySelector('input[name="imgSize"]:checked').value;
    // Adding body or contents to send
    obj = {
        search: search,
        filter: filter,
        size: size
    };
    getApiData('/api/flag',obj,document.getElementById('filterResult'));
})

/**
 * get the flag based on a country or a capital name
 */
submitRandom.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  const random = document.getElementById('randomNumber').value;
    // Adding body or contents to send
    obj = {
        number: random,
    };
    getApiData('/api/random',obj,document.getElementById('filterResult'));
})


/**
 * retrieve all the capitals name
 */
showAllCapitals.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  getApiData('/api/list',{filter: 'capital'},document.getElementById('showAll'))
})

/**
 * retrieve all countries name
 */
showAllCountries.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  getApiData('/api/list',{filter: 'country'},document.getElementById('showAll'))
})

/**
 * retrieve all countries and capitals names
 */
showAllCountriesAndCapitals.addEventListener('click', (el) => {
  //? Prevent form submission and reload of the page;
  el.preventDefault();
  getApiData('/api/list',{},document.getElementById('showAll'))
})
