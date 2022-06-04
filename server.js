// require modules
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient //({useUnifiedTopology: true});
const fs = require('fs');


const app = new express();

// use template to generate the data list for all countries if necessary
// app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: true}))

// serve files in public folder as resource for the page.
app.use(express.static('public'));
app.use(bodyParser.json())
app.listen('3000',()=> console.log('listen to 3000'));
const fsPromises = require('fs/promises')

function getKeyByValue(object, value) {
            return Object.keys(object).find(key =>
                    object[key].toLowerCase() === value.toLowerCase());
        }

const main = async () => {
  try {
    // Get the content of the JSON file
    const data = await fsPromises.readFile(__dirname + '/data/database.json');

    // Turn it to an object
    const obj = JSON.parse(data);

	app.post('/api/filter',(req, res) => {
	//	console.log(req.body)
		if(req.body?.filter) {
			const filter = req.body?.filter;
			if(filter === 'capital') {
			res.json({capital: obj[req.body?.search]});
			} else if (filter === 'country') {
				res.json({country: getKeyByValue(obj,req.body?.search)})
			}
			else {
				res.json({});
			}
		} else {
			res.json({});
		}
		res.end()
	});


	app.post('/api/list', (req, res) => {
		let objResult;
		if(req.body?.filter === 'capitals') {
			objResult = Object.values(obj).map((val) => {
			return val;
			});
			return res.json(objResult);
		} else if(req.body?.filter === 'countries') {
			objResult = Object.keys(obj).map((key) => {
			return key;
			});
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
