'use strict'

Gaussian = require('gaussian');
function sampleDist(dist)
{
  var choice = Math.random();
  var start;
}

disasterProperties = {
  MAX_RAINFALL: 10,
  DURATION: 10,
  VARIANCE: 1
};

function WeatherModel()
{
  this.disaster = {
    average: disasterRainfallAverage(disasterProperties.MAX_RAINFALL,disasterProperties.DURATION),
    end: disasterEndProb(disasterProperties.DURATION)
  };

  // Normal days are sunny
  //
  this.normalRainfall = Gaussian(0,0.1);
}

WeatherModel.prototype = {
  NORMAL: 0,
  DISASTER_FIRST: 1,

  disasterRainfallAverage: function(max,expectedDuration) {
    // 4.6 is a magic number, in order to have a high probability of having max rainfall on the last day of the disaster.
    //
    var lambda = 4.6/expectedDuration;
    return function(day)
    {
      return max*2*(1/(1+Math.pow(Math.E, -lambda*day)) - 1./2.);
    };
  },

  // Probability that the disaster will end on its dayth day.
  //
  disasterEndProb: function(expectedDuration) {
    var prob = 1./expectedDuration;
    return function(day) {
      return 1-Math.pow(1-prob,day-1)*prob;
    };
  },

  // Observe rainfall
  //
  observation: function(state)
  {
    var dist = this.normalRainfall;
    if (state != NORMAL)
    {
      var average = this.disaster.average(state);
      dist = Gaussian(average, disasterProperties.VARIANCE);
    }
    return sampleDist(dist);
  },

  probObsGivenState: function(obs,state)
  {
    var dist = this.normalRainfall;
    if (state != NORMAL)
    {
      var average = this.disaster.average(state);
      dist = Gaussian(average, disasterProperties.VARIANCE);
    }
    return dist.pdf(obs);
  },

  transition: function(state)
  {
    if (state == NORMAL)
    {
      var disasterProb = Math.random();
      return {NORMAL: 1-disasterProb, DISASTER_FIRST: disasterProb};
    }
    else
    {
      var day = state;
      var nextState = state+1;
      var normalProb = this.disaster.end(state);
      return {NORMAL: normalProb, nextState: 1-normalProb};
    }
  }
};

function Weather()
{
  
}

Weather.prototype = {
  
};

module.exports = Weather;
