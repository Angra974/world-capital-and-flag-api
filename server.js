// require modules
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient //({useUnifiedTopology: true});
const fs = require('fs');
const fsPromises = require('fs/promises')
const app = new express();

const PORT = 3000;
// use template to generate the data list for all countries if necessary
// app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: true}))
// serve files in public folder as resource for the page.
app.use(express.static('public'));
app.use(bodyParser.json())

app.listen(process.env.PORT || PORT, ()=>{
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

	// get list of all capitals, alpha code2, alpha code 3, countries or all the data from database.
	app.post('/api/list', (req, res) => {
		let objResult;
		// user need to add a search, don't let empty string give a result
		if(req.body?.filter) {
			if(req.body?.filter !== {}) {
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
		res.json(obj);
	})
    // Do something with the result
//    console.log(obj)
	// loa
  } catch (err){
    console.log(err);
  }
}

main();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

