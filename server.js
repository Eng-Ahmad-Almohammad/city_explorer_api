let express = require('express');

let cors = require('cors');
const { send } = require('process');
const { json } = require('body-parser');

let app = express();

app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT , ()=>{
    console.log('app is listning on port'+ PORT);
});

app.get('/location' , handleLocation);

function Location(search_query,formatted_query,latitude,longitude){
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}



function handleLocation(req,res){
let city = req.query.city;
let jsonDate = require('./data/location.json');
let jsonObject = jsonDate[0];
let locationObject = new Location(city, jsonObject.display_name , jsonObject.lat,jsonObject.lon);
res.status(200).json(locationObject);
}

// we can use send(locationObject) isted of json(locationObject)
// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }