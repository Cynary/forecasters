'use strict';

var _ = require('underscore');

function WeatherForecast(global, days) {
  this.global = global;
  // Forecast array. 0th element is the current day (100% correct)
  // The levels are from 0 to 100.
  this.waterLevels = [];
  var rainLevel = 0;
  while(days--) {
    rainLevel += Math.random() * 40 - 20;
    if (rainLevel < 0) {
      rainLevel = Math.random() * 5;
    } else if (rainLevel > 100) {
      rainLevel = 100 - Math.random() * 5;
    }

  	this.waterLevels.push({min: rainLevel, max: rainLevel, mean: rainLevel});
  }
};

WeatherForecast.prototype = {
  nextDay: function() {
    // TODO: Replace with actual weather
  	this.waterLevels.splice(0, 1);
    var rainLevel = this.waterLevels[this.waterLevels.length-1].mean;
    var newLevel = rainLevel + Math.random() * 40 - 20;
    if (newLevel < 0) {
      newLevel = Math.random() * 5;
    } else if (newLevel > 100) {
      newLevel = 100 - Math.random() * 5;
    }
    this.waterLevels.push({min: newLevel, max: newLevel, mean: newLevel});

    var clamp = function(level) {
      return Math.max(Math.min(level, 100), 0);
    };

    for (var i in this.waterLevels) {
      this.waterLevels[i].mean = clamp(this.waterLevels[i].mean + Math.random()*4 - 2);
      this.waterLevels[i].min = clamp(this.waterLevels[i].mean - 2*i);
      this.waterLevels[i].max = clamp(this.waterLevels[i].mean + 2*i);
    }
  },

  getCurrentWaterLevel: function() {
  	return this.waterLevels[0].mean;
  },

  getForecast: function() {
  	return _.map(this.waterLevels, _.clone);
  }
}

module.exports = WeatherForecast;
