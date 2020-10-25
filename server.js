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
app.get('/weather', handelWeather)

function Location(search_query,formatted_query,latitude,longitude){
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}



function handleLocation(req,res){
    try{
let city = req.query.city;
let jsonData = require('./data/location.json');
let jsonObject = jsonData[0];
let locationObject = new Location(city, jsonObject.display_name , jsonObject.lat,jsonObject.lon);
res.status(200).json(locationObject);
}
catch{
res.status(500).send("Sorry, something went wrong");
}
}

// we can use send(locationObject) isted of json(locationObject)
// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }
function Weather(description,valid_date){
    this.forcast = description;
    
    this.time = valid_date;
}
 function transform (value){
    
        var d = (new Date(value) + '').split(' ');
        return [d[0], d[1], d[2], d[3]].join(' ');
    }
   




function handelWeather(req,res){
    try{
    let jsonData = require('./data/weather.json');
    let jsonObject = jsonData.data;
    let result = [];
     jsonObject.forEach(element=>{
         let forcast = element.weather.description;
         let time = transform(Date.parse(element.valid_date))
         let weatherObject = new Weather(forcast,time);
        
         result.push(weatherObject);
     });

     res.status(200).json(result);
    }catch{
        res.status(500).send("Sorry, something went wrong");  
    }


}

// [
//     {
//       "forecast": "Partly cloudy until afternoon.",
//       "time": "Mon Jan 01 2001"
//     },
//     {
//       "forecast": "Mostly cloudy in the morning.",
//       "time": "Tue Jan 02 2001"
//     },
//     ...
//   ]