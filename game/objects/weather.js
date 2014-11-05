'use strict';

var GaussianDist = require('gaussian');
var Markov = require('./markov');

// http://jeshua.me/blog/SamplingUnivariateGaussianinJavascript
Math.normrnd = function(mean,std) {
  if(this.extra == undefined){
    var u,v;var s = 0;
    while(s >= 1 || s == 0){
      u = Math.random()*2 - 1; v = Math.random()*2 - 1;
      s = u*u + v*v;
    }
    var n = Math.sqrt(-2 * Math.log(s)/s);
        this.extra = v * n;
    return mean + u * n * std;
  } else{
    var r = mean + this.extra * std;
    this.extra = undefined;
        return r;
  }
};

function Gaussian(mean, stddev) {
  this.mean = mean;
  this.stddev = stddev;
  this.dist = GaussianDist(mean,stddev);
}

Gaussian.prototype = {
  sample: function()
  {
    return Math.normrnd(this.mean, this.stddev);
  },

  pdf: function(value)
  {
    return this.dist.pdf(value);
  }
};

var disasterProperties = {
  MAX_RAINFALL: 10,
  DURATION: 10,
  VARIANCE: 1
};

var NORMAL = 0;
var DISASTER_FIRST = 1;

function disasterRainfallAverage(max,expectedDuration) {
  // 4.6 is a magic number, in order to have a high probability of having max rainfall on the last day of the disaster.
  //
  var lambda = 4.6/expectedDuration;
  return function(day)
  {
    return max*2*(1/(1+Math.pow(Math.E, -lambda*day)) - 1./2.);
  };
}

// Probability that the disaster will end on its dayth day.
//
function disasterEndProb(expectedDuration) {
  var prob = 1./expectedDuration;
  return function(day) {
    return 1-Math.pow(1-prob,day-1)*prob;
  };
}

function WeatherModel()
{
  this.disaster = {
    average: disasterRainfallAverage(disasterProperties.MAX_RAINFALL,disasterProperties.DURATION),
    end: disasterEndProb(disasterProperties.DURATION)
  };

  // Normal days are sunny
  //
  this.normalRainfall = new Gaussian(0,0.1);
}

WeatherModel.prototype = {
  distGivenState: function(state)
  {
    var dist = this.normalRainfall;
    if (state != NORMAL)
    {
      var average = this.disaster.average(state);
      dist = new Gaussian(average, disasterProperties.VARIANCE);
    }
    return dist;
  },

  // Observe rainfall
  //
  observation: function(state)
  {
    return abs(this.distGivenState(state).sample());
  },

  probObsGivenState: function(obs,state)
  {
    var dist = this.normalRainfall;
    if (state != NORMAL)
    {
      var average = this.disaster.average(state);
      dist = new Gaussian(average, disasterProperties.VARIANCE);
    }
    return dist.pdf(obs) + dist.pdf(-obs);
  },

  transition: function(state)
  {
    var probs = {};
    if (state == NORMAL)
    {
      var disasterProb = 0.1; // Math.random()
      probs[NORMAL] = 1-disasterProb;
      probs[DISASTER_FIRST] = disasterProb;
      return probs;
    }
    else
    {
      var day = Number(state);
      var nextState = Number(state)+1;
      var normalProb = this.disaster.end(state);
      probs[NORMAL] = normalProb;
      probs[nextState] = 1-normalProb;
      return probs;
    }
  }
};

function Weather()
{
  this.model = new WeatherModel();
  this.markov = new Markov(NORMAL, this.model.transition, this.model.observation);
}

Weather.prototype = {
  newRainfall: function()
  {
    return this.markov.step();
  },

  getModel: function()
  {
    return this.model;
  }
};

module.exports = Weather;
