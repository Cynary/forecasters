'use strict';

var Weather = require('./weather');

var NORMAL = 0;
var DISASTER_FIRST = 1;

function normalize(a)
{
  var z = 0;
  for (var i in a)
  {
    z += a[i];
  }
  for (var i in a)
  {
    a[i] /= z;
  }
}

function Forecast() {
  this.stateProbabilities = { 0 /*NORMAL*/: 1.0 };
  this.weather = new Weather().getModel();
  this.epsilon = 0.0001;
}

Forecast.prototype = {
  newDay: function()
  {
    var newProbs = {};
    for (var state in this.stateProbabilities)
    {
      var transition = this.weather.transition(state);
      for (var nextState in transition)
      {
        newProbs[nextState] =
          ((nextState in newProbs) ? newProbs[nextState]:0) +
          transition[nextState]*this.stateProbabilities[state];
      }
    }
    this.stateProbabilities = newProbs;
  },

  observe: function(rainfall)
  {
    for (var state in this.stateProbabilities)
    {
      this.stateProbabilities[state] *= this.weather.probObsGivenState(rainfall,state);
    }
    normalize(this.stateProbabilities);
  },

  forecast: function(days)
  {
    var storeProbs = this.stateProbabilities;
    var day = 0;
    var rain = [];
    var disaster = [];
    do
    {
      rain[day] = 0.;
      var self = this;
      var probDay = function(day)
      {
        if (day in self.stateProbabilities)
        {
          var p = 1;
          for (var x = 0; x < day; ++x)
          {
            p -= self.stateProbabilities[x];
          }
          return p;
        }
        else
        {
          return 0.;
        }
      };
      disaster[day] = probDay(7);
      for (var state in this.stateProbabilities)
      {
        rain[day] += this.stateProbabilities[state]*this.weather.distGivenState(state).mean;
      }
      ++day;
      this.newDay();
    } while(day < days);

    this.stateProbabilities = storeProbs;
    return {rain: rain, disaster: disaster};
  }
};

module.exports = Forecast;
