'use strict';

var Worker = require('./worker');

// Broad Region Class.
function Region (game) {
  // Utility variables
  this.game = game;

  // Resources
  this.health = 1.0;
  this.supplies = 0;

  // Other game variables
  this.disaster = false;

  this.workers = [new Worker(game, this), new Worker(game, this), new Worker(game, this)];
}

Region.prototype = {

// Called every turn
nextTurn: function() {
  // Do stuff
  var usedSupplies = 0;

  if (this.health < 1.0) {
    // Either use 10% of supplies or enough supplies to heal the city, whichever is less
    usedSupplies = Math.ceil(this.supplies / 10.0);
    usedSupplies = Math.min(Math.ceil((1.0-this.health)*100/3), usedSupplies)

    this.supplies -= usedSupplies;
    this.health += 0.03 * usedSupplies;
    this.health = Math.min(this.health, 1.0);
  }

  var numSupplyWorkers = 0;
  for (var i in this.workers) {
    this.workers[i].nextTurn();
    if (this.workers[i].currentState instanceof Worker.GatherState) {
      numSupplyWorkers++;
    }
  }

  if (usedSupplies == 0 && this.supplies > numSupplyWorkers * 10) {
    this.supplies -= Math.ceil(this.supplies / 10.0);
  }
},

};

module.exports = Region;
