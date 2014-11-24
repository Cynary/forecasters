'use strict';

var _ = require('underscore');

function WeatherForecast(global, days) {
  this.global = global;
  // Forecast array. 0th element is the current day (100% correct)
  // The levels are from 0 to 100.
  this.period0 = 12; // Fast period
  this.period1 = 6; // Slow period, in terms of period0
  this.day = Math.floor(Math.random()*this.period1)*this.period0;
  this.noiseLevel = 0;
  this.waterLevels = [];

  var rainLevel = 0;

  for (var i = 0; i < days; ++i) {
    this.noiseLevel += Math.random() * 20 - 10;
    this.noiseLevel = this.clamp(this.noiseLevel, -20, 20);

    var rainLevel = this.clamp(this.rainFunction(this.day) + this.noiseLevel);

    this.day += 1;

  	this.waterLevels.push({
      min: this.clamp(rainLevel - 2*i),
      max: this.clamp(rainLevel + 2*i),
      mean: rainLevel
      });
  }
};

WeatherForecast.prototype = {
  nextDay: function() {
    // Remove the oldest day
  	this.waterLevels.splice(0, 1);

    // Set new rain level
    this.noiseLevel += Math.random() * 20 - 10;
    this.noiseLevel = this.clamp(this.noiseLevel, -20, 20);

    var rainLevel = this.clamp(this.rainFunction(this.day) + this.noiseLevel);

    this.day += 1;

  	this.waterLevels.push({
      min: this.clamp(rainLevel - 2*6),
      max: this.clamp(rainLevel + 2*6),
      mean: rainLevel
      });

    for (var i in this.waterLevels) {
      this.waterLevels[i].mean = this.clamp(this.waterLevels[i].mean + Math.random()*4 - 2);
      this.waterLevels[i].min = this.clamp(this.waterLevels[i].mean - 2*i);
      this.waterLevels[i].max = this.clamp(this.waterLevels[i].mean + 2*i);
    }
  },

  clamp: function(level, min, max) {
    min = min || 0;
    max = max || 100;
    return Math.max(Math.min(level, max), min);
  },

  rainFunction: function(day) {
    // 12-turn periodic tides with 72-turn larger period
    return (1.0 - Math.cos(day / this.period0 * 2.0 * Math.PI)) * 35.0 + (1.0 - Math.cos(day / this.period0 / this.period1 * 2.0 * Math.PI)) * 5.0;
  },

  getCurrentWaterLevel: function() {
  	return this.waterLevels[0].mean;
  },

  getForecast: function() {
  	return _.map(this.waterLevels, _.clone);
  }
}

module.exports = WeatherForecast;
