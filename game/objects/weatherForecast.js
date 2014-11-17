'use strict';

function WeatherForecast(global, days) {
  this.global = global;
  // Forecast array. 0th element is the current day (100% correct)
  // The levels are from 0 to 100.
  this.waterLevels = [];
  while(days--) {
  	this.waterLevels.push(0);
  }
};

WeatherForecast.prototype = {
  nextDay: function() {
  	// TODO
  },

  getCurrentWaterLevel: function() {
  	return this.waterLevels[0];
  },

  getForecast: function() {
  	return this.waterLevels;
  }
}

module.exports = WeatherForecast;