'use strict';

var Worker = require('./worker');

// Broad Region Class.
function Region (global, regionIndex, height, worker) {
  this.global = global;
  this.height = height;
  this.regionIndex = regionIndex;
  this.workers = [worker];

  // TODO: change this once we have normal regions
  this.x = 100+150*regionIndex;
  this.y = this.global.levelToY(height);
}

Region.prototype = {

  nextDay: function() {
    for (var workerIndex in this.workers) {
      this.workers[workerIndex].nextDay();
    }
  },

};

module.exports = Region;
