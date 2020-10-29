'use strict';

const superAgent = require('superagent');

const weatherKey = process.env.WEATHER_API_KEY;


function Weather(description, valid_date) {
    this.forecast = description;

    this.time = valid_date;
}
function transform(value) {

    var d = (new Date(value) + '').split(' ');
    return [d[0], d[1], d[2], d[3]].join(' ');
}


var weather = {

    weatherFunction : function (city,res){
        superAgent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${weatherKey}`).then((data) => {

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

    },
}

module.exports = weather;