'use strict';

const superAgent = require('superagent');

const trailKey = process.env.TRAIL_API_KEY;

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
};

var trails = {
    trailsFunction: function (req, res) {
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
    }
};

module.exports = trails;