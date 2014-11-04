'use strict';

var Worker = require('./worker');

// Broad Region Class.
function Region (game) {
  // Utility variables
  this.game = game;

  // Resources
  this.health = 100.0;
  this.supplies = 0;

  // Other game variables
  this.efficiency = 1.0;
  this.disaster = false;

  this.workers = [new Worker(game, this), new Worker(game, this)];
}

Region.prototype = {

// Called every frame for a given delta time
update: function(dt) {
  // Assume some sort of logistic restoration for health. Note that this is for small dt.
  this.health += 0.005 * this.health * (100.0 - this.health) * dt;

  for (var i in this.workers) {
    this.workers[i].update(dt);
  }
},

};

module.exports = Region;
