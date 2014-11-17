'use strict';

// Broad worker class
function Worker(global, homeRegionIndex) {
  this.global = global;
  this.homeRegionIndex = homeRegionIndex;
  this.currentRegionIndex = homeRegionIndex;
  this.targetRegionIndex = homeRegionIndex;
  this.building = false;
  this.health = 100;
}

Worker.prototype = {

  nextDay: function() {
    this.status = "";
    // If the worker is under water, decrease its health.
    if (this.global.weather.getCurrentWaterLevel() >= this.global.regions[this.currentRegionIndex].height) {
      this.health -= 10;
    }
    // If the worker is at home, (s)he'll either collect supply, or build the dam
    if (this.homeRegionIndex === this.currentRegionIndex) {
      if (this.building) {
        this.buildState();
      } else {
        this.gatherState();
      }
    } else {
      // Otherwise, (s)he'll decrease supply and move left or right
      this.building = false;
      this.global.decreaseSupply(this);
    }
    if (this.currentRegionIndex != this.targetRegionIndex) {
      this.moveState();
    }
  },

  buildState: function() {
    this.global.increaseBuildProgress(this);
  },

  gatherState: function() {
    this.global.increaseSupply(this);
  },

  moveState: function() {
    if (this.currentRegionIndex < this.targetRegionIndex) {
      this.currentRegionIndex++;
    } else if (this.currentRegionIndex > this.targetRegionIndex) {
      this.currentRegionIndex--;
    }
  },

};

module.exports = Worker;
