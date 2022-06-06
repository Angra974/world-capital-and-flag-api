// require modules
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient //({useUnifiedTopology: true});
const fs = require('fs');
const fsPromises = require('fs/promises')
const app = new express();
const MAX_RANDOM = 10;
    const PORT = process.env.PORT || 3000;


// use template to generate the data list for all countries if necessary
// app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: true}))
// serve files in public folder as resource for the page.
app.use(express.static('public'));
app.use(bodyParser.json())

app.listen(PORT, ()=>{
    console.log(`The server is now running on port ${PORT}!`)
})



const main = async () => {
  try {
    // Get the content of the JSON file
    const data = await fsPromises.readFile(__dirname + '/data/database.json');

    // Turn it to an object
    const obj = JSON.parse(data);

	// filter by alpha2, alpha3 code, capital or country to get the desired result
	app.post('/api/filter',(req, res) => {
	//	console.log(req.body)
		if(req.body?.filter && req.body.search.length > 0) {
			const result = Object.values(obj).filter( item =>
				item[req.body?.filter].toLowerCase() === req.body?.search.toLowerCase()
			)
			res.json(result);
		} else {
			res.json({});
		}
		res.end()
	});


	// return a random data or a number of random data. limit = 10;
	app.post('/api/random', (req, res) => {
			if(req.body?.number && req.body?.number > 0) {
		let objResult = [];
				const randomNumberUsed = [];
				// don't look where you don't have data to handle
				let max = req.body.number < MAX_RANDOM ? req.body.number : MAX_RANDOM;

				for(let i = 0; i < max; i++) {
					// get a random number and grab the value in dataset for this index value
					let randomNumber = Math.floor((Math.random() * obj.length + 1));

					// if this index has not been use already
					if(!randomNumberUsed.includes(randomNumber)) {
						randomNumberUsed.push(randomNumber);
						objResult.push(obj[randomNumber]);
					}
					else { /* index is already used so we don't count this one and look for a new one but need to keep the
					 initial count  */
						 i -= 1
					}
			}
			return res.json(objResult);
			}
			return res.json({})
	})



		// get list of all capitals, alpha code2, alpha code 3, countries or all the data from database.
	app.post('/api/list', (req, res) => {
		let objResult;
		// user need to add a search, don't let empty string give a result
		if(req.body?.filter) {
			if(req.body?.filter !== {}) {
				console.log('list here')
				objResult = Object.values(obj).map((val) => {
					return val[req.body?.filter];
					});
				} else {
					// return all capital and countries
					objResult = Object.values(obj).map((val) => {
						return	{ country: val['country'], capital: val['capital']};
					});
				}
			return res.json(objResult);
		}
	return	res.json(obj);
	})

		// get list of all capitals, alpha code2, alpha code 3, countries or all the data from database.
	app.post('/api/flag', (req, res) => {
		// user need to add a search, don't let empty string give a result
		if(req.body?.filter && req.body?.filter !== {}) {
   const protocol = req.protocol;
    const host = req.hostname;
	    const baseUrl = `${protocol}://${host}:${PORT}`

			const result = Object.values(obj).filter( item =>
				item[req.body?.filter].toLowerCase() === req.body?.search.toLowerCase()
			)[0]

			let imageFolder = '';
			// choose image folder based on size.
			switch(req.body?.imgSize) {
				case 's':
					imageFolder = 'flags';
					break;
				case 'm':
					imageFolder = 'flags-medium';
					break;
				case 'l':
					imageFolder = 'flags-large';
					break;
				case 'xl':
					imageFolder = 'flags-extralarge';
					break;
				default:
					imageFolder = 'flags';
					break;
			}

			result['image'] = `${baseUrl}/data/${imageFolder}/${result['alpha2']}.png`;
			res.json(result);
		}
		})


    // Do something with the result
//    console.log(obj)F
	// loa
  } catch (err){
    console.log(err);
  }
}

main();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

