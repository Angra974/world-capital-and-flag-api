// require modules
const express = require('express');
const bodyParser = require('body-parser');

const fsPromises = require('fs/promises');
const store = require("store2");
const {
    json
} = require('body-parser');
const app = new express();
const MAX_RANDOM = 10;
const PORT = process.env.PORT || 3000;



// use template to generate the data list for all countries if necessary
// app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))
// serve files in public folder as resource for the page.
app.use(express.static('public'));
app.use(bodyParser.json())

app.listen(PORT, () => {
    console.log(`The server is now running on port ${PORT}!`)
})


const main = async () => {
    try {

        // Get the content of the JSON file
        let obj;

        if (store.has('databaseJSON')) {
            obj = store.get('databaseJSON');
        } else {
            const data = await fsPromises.readFile(__dirname + '/data/database.json');
            obj = JSON.parse(data);
            store.set('databaseJSON', obj);
        }

        // filter by alpha2, alpha3 code, capital or country to get the desired result
        app.post('/api/filter', (req, res) => {
            //	console.log(req.body)
            if (req.body?.filter && req.body.search.length > 0) {
				let filter = req.body.filter;
				let search = req.body.search;

                // if data exists in localstorage
                if (store.has(`filter-search-${filter}-${search}`)) {
                    return res.json(store.get(`filter-search-${filter}-${search}`));
                }
                const result = Object.values(obj).filter(item =>
                    item[filter].toLowerCase() === search.toLowerCase()
                )
                // add in localstorage
                store.set(`filter-search-${filter}-${search}`, result);
                res.json(result);
            } else {
                res.json({});
            }
            res.end()
        });


        // return a random data or a number of random data. limit = 10;
        app.post('/api/random', (req, res) => {

            if (req.body?.number && req.body?.number > 0) {
                let objResult = [];
                const randomNumberUsed = [];
                // don't look where you don't have data to handle
                let max = req.body.number < MAX_RANDOM ? req.body.number : MAX_RANDOM;

                for (let i = 0; i < max; i++) {
                    // get a random number and grab the value in dataset for this index value
                    let randomNumber = Math.floor((Math.random() * obj.length + 1));

                    // if this index has not been use already
                    if (!randomNumberUsed.includes(randomNumber)) {
                        randomNumberUsed.push(randomNumber);
                        objResult.push(obj[randomNumber]);
                    } else {
                        /* index is already used so we don't count this one and look for a new one but need to keep the
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
            if (req.body?.filter) {
                let filter = req.body?.filter;
                if (filter !== 'both') {
                    if (store.has(`list-filter-${filter}`)) {
                        return res.json(store.get(`list-filter-${filter}`));
                    }
                    // if no result in storage or not storage
                    objResult = Object.values(obj).map((val) => {
                        return val[filter];
                    });
                    store.set(`list-filter-${filter}`, objResult);

                } else {
                    if (store.has(`list-filter-all`)) {
                        return res.json(store.get(`list-filter-all`));
                    }
                    // return all capital and countries
                    objResult = Object.values(obj).map((val) => {
                        return {
                            country: val['country'],
                            capital: val['capital']
                        };
                    });
                    store.set('list-filter-all', objResult);
                }
                return res.json(objResult);
            }
            return res.json(obj);
        })

        // get list of all capitals, alpha code2, alpha code 3, countries or all the data from database.
        app.post('/api/flag', (req, res) => {
            // user need to add a search, don't let empty string give a result
            if (req.body?.filter && req.body?.filter !== {}) {
                let filter = req.body?.filter;
                let search = req.body?.search;
                let imgSize = req.body?.imgSize;

                const protocol = req.protocol;
                const host = req.hostname;
                const baseUrl = `${protocol}://${host}:${PORT}`

                if (store.has(`flag-filter-search-${filter}-${search}-${imgSize}`)) {
                    return res.json(store.get(`flag-filter-search-${filter}-${search}-${imgSize}`));
                }

                const result = Object.values(obj).filter(item =>
                    item[filter].toLowerCase() === search.toLowerCase()
                )[0]

                let imageFolder = '';
                // choose image folder based on size.
                switch (imgSize) {
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

                store.set(`flag-filter-search-${filter}-${search}-${imgSize}`, result);
                res.json(result);
            }
        })


        // Do something with the result
        //    console.log(obj)F
        // loa
    } catch (err) {
        console.log(err);
    }
}

main();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
