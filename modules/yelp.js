'use strict';

const superAgent = require('superagent');

const yelpKey = process.env.YELP_API_KEY;

function Yelp(name, image_url, price, rating, url) {
    this.name = name;
    this.image_url = image_url;
    this.price = price;
    this.rating = rating;
    this.url = url;
};

var page = 1;
var yelp = {
    ylepFunction : function (city,res){
        const pageNum = 5;
    const start = ((page - 1) * pageNum + 1);
    let obj = {
        location: city,
        limit: pageNum,
        offset: start
    };
    page++;
    superAgent.get(`https://api.yelp.com/v3/businesses/search`).query(obj).set('Authorization', `Bearer ${yelpKey}`).then(data => {
        let jsonObject = data.body.businesses;
        let result = jsonObject.map(value => {
            let YelpObject = new Yelp(value.name, value.image_url, value.price, value.rating, value.url);
            return YelpObject;
        })
        res.status(200).json(result);
    }).catch(() => {
        res.send('error');


    })
    }
};

module.exports = yelp;