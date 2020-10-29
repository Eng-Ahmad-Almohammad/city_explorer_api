'use strict';
const client = require('./client.js');

const superAgent = require('superagent');

const gecoodeKey = process.env.GEOCODE_API_KEY;

function Location(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
};

var location ={
 handleLocation: function (city, res) {

    superAgent.get(`https://us1.locationiq.com/v1/search.php?key=${gecoodeKey}&q=${city}&format=json`).then((data) => {
        let jsonObject = data.body[0];
        let locationObject = new Location(city, jsonObject.display_name, jsonObject.lat, jsonObject.lon);
        res.status(200).json(locationObject);
        client.query(`INSERT INTO cityexplorer(search_query, formatted_query, latitude, longitude) values ('${locationObject.search_query}', '${locationObject.formatted_query}','${locationObject.latitude}', '${locationObject.longitude}')`)
    }).catch(() => {
        res.send('error');

    });

}  
}

module.exports = location;