'use strict';

var WeatherForecast = require('./weatherForecast');
var Region = require('./region');
var Worker = require('./worker');

// Global class, containing regions, weather, victory progress, etc.
// forecastDays - positive integer meaning how many days the forecast should show
// regionHeights - an array containing heights (from 0..100) of the regions
// numWorkersPerRegion - amount of workers per region
function Global(game, forecastDays, regionHeights, numWorkersPerRegion) {
  this.game = game;
  this.buildProgress = 0;
  this.supply = 0;
  this.turn = 0;
  this.weather = new WeatherForecast(this, forecastDays);
  this.regions = [];
  this.workers = [];
  for(var index in regionHeights) {
    var worker = new Worker(this, Number(index));
    this.workers.push(worker);
    this.regions.push(new Region(this, Number(index), regionHeights[index], worker));
  }
}

Global.prototype = {

  nextDay: function() {
    for(var index in this.regions) {
      this.regions[index].nextDay();
    }
    this.weather.nextDay();
    for(var index in this.workers) {
      var worker = this.workers[index];
      // If the worker ends its turn under water and hasn't already taken damage, decrease its health.
      if (this.weather.getCurrentWaterLevel() >= this.regions[worker.currentRegionIndex].height) {
        if (!worker.damaged) {
          worker.health -= 50;
          worker.dmgCause = "water";
        }
      }
    }
    this.turn += 1

    for (var r in this.regions) {
      var region = this.regions[r];
      for (var w = 0; w < region.workers.length; ++w) {
        var worker = region.workers[w];
        if (worker.currentRegionIndex != r) {
          region.workers.splice(w, 1);
          w -= 1;
          this.regions[worker.currentRegionIndex].workers.push(worker);
        }
      }
    }
  },

  increaseBuildProgress: function(worker) {
    // Currently it doesn't depend on worker, but it may in the future
    this.buildProgress += 1;
  },

  increaseSupply: function(worker) {
    // Currently it doesn't depend on worker, but it may in the future
    this.supply += 1;
  },

  decreaseSupply: function(worker) {
    // Currently it doesn't depend on worker, but it may in the future
    this.supply -= 1;
    this.supply = Math.max(0, this.supply);
  },

  levelToY: function(level) {
    // ranges from 0 to 100
    return 230 + (100-level)/100.0 * (430 - 230);
  },

  yToLevel: function(y) {
    // TODO: Implement this function
  },

};

module.exports = Global;
