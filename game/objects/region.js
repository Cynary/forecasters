'use strict';

var Worker = require('./worker');

// Broad Region Class.
function Region (game, x, y) {
  // Utility variables
  this.game = game;

  // Resources
  this.health = 1.0;
  this.supplies = 0;

  // Other game variables
  this.disaster = false;

  // Locational information
  this.x = x;
  this.y = y;

  // Workers at this location
  this.workers = [];
}

Region.prototype = {

// Called every turn
nextTurn: function() {
  // Stuff
},

};

module.exports = Region;
