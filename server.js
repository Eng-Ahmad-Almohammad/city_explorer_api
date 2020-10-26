let express = require('express');

let cors = require('cors');

let superAgent = require('superagent');


let app = express();

app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT , ()=>{
    console.log('app is listning on port'+ PORT);
});

app.get('/location' , handleLocation);
app.get('/weather', handelWeather);

function Location(search_query,formatted_query,latitude,longitude){
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
};



function handleLocation(req,res){
    
let city = req.query.city;
let key= process.env.GEOCODE_API_KEY;
superAgent.get(`https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`).then((data)=>{
    let jsonObject = data.body[0];
    let locationObject = new Location(city, jsonObject.display_name , jsonObject.lat,jsonObject.lon);
res.status(200).json(locationObject);
}).catch(()=>{
    res.send('error');

});


}

// we can use send(locationObject) isted of json(locationObject)
// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }
function Weather(description,valid_date){
    this.forecast = description;
    
    this.time = valid_date;
}
 function transform (value){
    
        var d = (new Date(value) + '').split(' ');
        return [d[0], d[1], d[2], d[3]].join(' ');
    }
   




function handelWeather(req,res){
    let city = req.query.city;
        
    let key = process.env.WEATHER_API_KEY;
    superAgent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`).then((data)=>{
      
    let jsonObject = data.body.data;
    let result = jsonObject.map(function(element){
        let forcast = element.weather.description;
        let time = transform(Date.parse(element.valid_date))
        let weatherObject = new Weather(forcast,time);
       
        return weatherObject;
    });
     

     res.status(200).json(result);
    }).catch(()=>{
        res.send('error');
    });
    

   


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