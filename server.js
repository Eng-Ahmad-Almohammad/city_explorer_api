let express = require('express');

let cors = require('cors');

let superAgent = require('superagent');

let pg = require('pg');


let app = express();

app.use(cors());

require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;
let client = new pg.Client(DATABASE_URL);
const PORT = process.env.PORT;



app.get('/location', checkLocation);
app.get('/weather', handelWeather);
app.get('/trails', handelTrail);
app.get('/movies',handelMovies);

function checkLocation(req, res) {
    let city = req.query.city;
    client.query(`SELECT search_query, formatted_query, latitude, longitude FROM cityexplorer WHERE search_query = '${city}'`).then((data) => {
      if(data.rowCount===0){
          handleLocation(city,res);
      }else {
        res.status(200).json(data.rows[0]);
        console.log('hello');
      }
       
        
    })
}

function Location(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
};



function handleLocation(city, res) {

    
    let key = process.env.GEOCODE_API_KEY;
    superAgent.get(`https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`).then((data) => {
        let jsonObject = data.body[0];
        let locationObject = new Location(city, jsonObject.display_name, jsonObject.lat, jsonObject.lon);
        res.status(200).json(locationObject);
        client.query(`INSERT INTO cityexplorer(search_query, formatted_query, latitude, longitude) values ('${locationObject.search_query}', '${locationObject.formatted_query}','${locationObject.latitude}', '${locationObject.longitude}')`)
    }).catch(() => {
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
function Weather(description, valid_date) {
    this.forecast = description;

    this.time = valid_date;
}
function transform(value) {

    var d = (new Date(value) + '').split(' ');
    return [d[0], d[1], d[2], d[3]].join(' ');
}





function handelWeather(req, res) {
    let city = req.query.search_query;

    let key = process.env.WEATHER_API_KEY;
    superAgent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`).then((data) => {

        let jsonObject = data.body.data;
        let result = jsonObject.map(function (element) {
            let forcast = element.weather.description;
            let time = transform(Date.parse(element.valid_date))
            let weatherObject = new Weather(forcast, time);

            return weatherObject;
        });


        res.status(200).json(result);
    }).catch(() => {
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
function Trials(name, location, length, stars, star_votes, summary, trail_url, conditions, condition_date) {
    this.name = name;
    this.location = location;
    this.length = length;
    this.stars = stars;
    this.star_votes = star_votes;
    this.summary = summary;
    this.trail_url = trail_url;
    this.conditions = conditions;
    this.condition_date = condition_date.slice(0, 9);
    this.condition_time = condition_date.slice(11, 18);
}



function handelTrail(req, res) {
    // let city = req.query.city;
    // let key = process.env.GEOCODE_API_KEY;
    // superAgent.get(`https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`).then((data) => {
    //     let jsonObject = data.body[0];
    //     var latit = jsonObject.lat;
    //     var longit = jsonObject.lon;


    let trailKey = process.env.TRAIL_API_KEY
    superAgent.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${trailKey}`).then((data) => {
        let jsonObject = data.body.trails;
        let result = jsonObject.map(function (element) {
            let trailsObject = new Trials(element.name, element.location, element.length, element.stars, element.starVotes, element.summary, element.url, element.conditionStatus, element.conditionDate);
            return trailsObject;
        });


        res.status(200).json(result);
    }).catch(() => {
        res.send('error');
    });
    // }).catch(()=>{
    //     res.send('error');
    // })



}
// [
//     {
//       "name": "Rattlesnake Ledge",
//       "location": "Riverbend, Washington",
//       "length": "4.3",
//       "stars": "4.4",
//       "star_votes": "84",
//       "summary": "An extremely popular out-and-back hike to the viewpoint on Rattlesnake Ledge.",
//       "trail_url": "https://www.hikingproject.com/trail/7021679/rattlesnake-ledge",
//       "conditions": "Dry: The trail is clearly marked and well maintained.",
//       "condition_date": "2018-07-21",
//       "condition_time": "0:00:00 "
//     },
//     {
//       "name": "Mt. Si",
//       "location": "Tanner, Washington",
//       "length": "6.6",
//       "stars": "4.4",
//       "star_votes": "72",
//       "summary": "A steep, well-maintained trail takes you atop Mt. Si with outrageous views of Puget Sound.",
//       "trail_url": "https://www.hikingproject.com/trail/7001016/mt-si",
//       "conditions": "Dry",
//       "condition_date": "2018-07-22",
//       "condition_time": "0:17:22 "
//     },
//     ...
//   ]
 function Movies (title,overview,average_votes,total_votes,image_url,popularity,released_on){
    this.title = title;
    this.overview = overview;
    this.average_votes = average_votes;
    this.total_votes = total_votes;
    this.image_url = image_url;
    this.popularity = popularity;
    this.released_on = released_on;

 }

function handelMovies(req , res){
    let city= req.query.search_query;
    let key = process.env.MOVIE_API_KEY
    superAgent.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${city}`).then(data=>{
        let jsonObject = data.body.results;
        let result = jsonObject.map(value=>{
            let movieObject = new Movies(value.title,value.overview,value.vote_average,value.vote_count,value.poster_path,value.popularity,value.release_date);
            return movieObject;
        })
        res.status(200).json(result);
    }).catch(() => {
        res.send('error');
    });

}


// [
//   {
//     "title": "Sleepless in Seattle",
//     "overview": "A young boy who tries to set his dad up on a date after the death of his mother. He calls into a radio station to talk about his dad’s loneliness which soon leads the dad into meeting a Journalist Annie who flies to Seattle to write a story about the boy and his dad. Yet Annie ends up with more than just a story in this popular romantic comedy.",
//     "average_votes": "6.60",
//     "total_votes": "881",
//     "image_url": "https://image.tmdb.org/t/p/w500/afkYP15OeUOD0tFEmj6VvejuOcz.jpg",
//     "popularity": "8.2340",
//     "released_on": "1993-06-24"
//   },
//   {
//     "title": "Love Happens",
//     "overview": "Dr. Burke Ryan is a successful self-help author and motivational speaker with a secret. While he helps thousands of people cope with tragedy and personal loss, he secretly is unable to overcome the death of his late wife. It's not until Burke meets a fiercely independent florist named Eloise that he is forced to face his past and overcome his demons.",
//     "average_votes": "5.80",
//     "total_votes": "282",
//     "image_url": "https://image.tmdb.org/t/p/w500/pN51u0l8oSEsxAYiHUzzbMrMXH7.jpg",
//     "popularity": "15.7500",
//     "released_on": "2009-09-18"
//   },
//   ...
// ]

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log('app is listning on port' + PORT);
    });
}).catch(err => {
    console.log('Sorry there is an error' + err);
});