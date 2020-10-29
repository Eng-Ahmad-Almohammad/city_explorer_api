
'use strict';

// Require dependencies
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());

// --------------------------------------------------------------------------------------------------------

// Our dependencies
const client = require('./modules/client.js');
let location = require('./modules/location.js');
let weather = require('./modules/weather.js');
let trails = require('./modules/trails.js')
let movie = require('./modules/movie.js');
let yelp = require('./modules/yelp.js');


// --------------------------------------------------------------------------------------------------------

// Reqired KEYS
const PORT = process.env.PORT;

// --------------------------------------------------------------------------------------------------------
// Required request
app.get('/location', checkLocation);
app.get('/weather', handelWeather);
app.get('/trails', handelTrail);
app.get('/movies', handelMovies);
app.get('/yelp', handelYelp);
app.get('/*',handelError);
// --------------------------------------------------------------------------------------------------------

// Location function

function checkLocation(req, res) {
    let city = req.query.city;
    client.query(`SELECT search_query, formatted_query, latitude, longitude FROM cityexplorer WHERE search_query = '${city}'`).then((data) => {
        if (data.rowCount === 0) {
            location.handleLocation(city, res);
        } else {
            res.status(200).json(data.rows[0]);
            
        }
    })
}

// --------------------------------------------------------------------------------------------------------

// Weather function

function handelWeather(req, res) {
    let city = req.query.search_query;
    weather.weatherFunction(city,res);
}

// --------------------------------------------------------------------------------------------------------

// Trails function

function handelTrail(req, res) {

  trails.trailsFunction(req,res);
};

// --------------------------------------------------------------------------------------------------------

// Movie function

function handelMovies(req, res) {
    let city = req.query.search_query;
     movie.movieFunction(city,res);
   
}

// --------------------------------------------------------------------------------------------------------

// Yelp function
function handelYelp(req, res) {
    let city = req.query.search_query;

    yelp.ylepFunction(city,res);

};

// --------------------------------------------------------------------------------------------------------

// Error function
function handelError(req,res){
res.status(404).send('404 Not found');
};

// --------------------------------------------------------------------------------------------------------

// server starting function
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log('app is listning on port' + PORT);
    });
}).catch(err => {
    console.log('Sorry there is an error' + err);
});