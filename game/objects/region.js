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

// Called every frame for a given delta time
update: function(dt) {
  // Assume some sort of logistic restoration for health.
  if (this.health >= 0.25) {
    this.health += 0.1 * this.health * (1.0 - this.health) * dt;
  } else {
    this.health = 0.25;
  }

  for (var i in this.workers) {
    this.workers[i].update(dt);
  }
},

};

module.exports = Region;
