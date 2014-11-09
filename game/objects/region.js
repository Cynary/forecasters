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

  for (var i in this.workers) {
    this.workers[i].nextTurn();
  }
},

};

module.exports = Region;
