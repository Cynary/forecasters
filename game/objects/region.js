'use strict';

var Worker = require('./worker');

// Broad Region Class.
function Region (global, regionIndex, height, numWorkers) {
  this.global = global;
  this.height = height;
  this.regionIndex = regionIndex;
  this.workers = [];
  // Create a hash set of workers to be able to add/remove them by reference
  for(var index = 0; index < numWorkers; index++) {
    this.workers[index] = new Worker(global, regionIndex);
  }

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
