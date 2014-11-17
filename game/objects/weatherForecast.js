'use strict';

function WeatherForecast(days) {
  this.waterLevels = []; // Forecast array. 0th element is the current day (100% correct)
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