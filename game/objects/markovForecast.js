'use strict';

var Forecast = require('./forecast');

function MarkovForecast(global, days) {
  this.days = days;
  this.global = global;
  this.forecast = new Forecast();
  this.waterLevels = this.forecast.forecast(this.days)[rain];
  this.weather = new Weather();
}

MarkovForecast.prototype = {
  nextDay: function() {
    this.forecast.newDay();
    this.currentRainfall = this.weather.newRainfall();
    this.observe(this.currentRainfall);
    this.waterLevels = this.forecast.forecast(this.days)[rain];
    this.waterLevels[0] = this.currentRainfall;
  },

  getCurrentWaterLevel: function() {
    return this.currentRainfall;
  },

  getForecast: function() {
    return this.waterLevels;
  }
};

module.exports = MarkovForecast;
