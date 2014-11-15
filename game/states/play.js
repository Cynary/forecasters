'use strict';

var Region = require('../objects/region');
var Worker = require('../objects/worker');
var Views = require('../ui_widgets/views');
var RegionView = require('../ui_widgets/region_view');
var WorkerView = require('../ui_widgets/worker_view');
var TurnView = require('../ui_widgets/turn_view');
var Weather = require('../objects/weather');
var Forecast = require('../objects/forecast');
var _ = require('underscore');

function Play() {}

Play.prototype = {

create: function() {
  //Everything that relates to buildProgress is a temporary patch just to get it in for playtest.
  this.game.buildProgress = 0;
  this.regions = [
    new Region(this.game, 60, 400),
    new Region(this.game, 160, 420),
    new Region(this.game, 260, 300),
    new Region(this.game, 360, 250),
    new Region(this.game, 460, 300),
    new Region(this.game, 560, 320),
  ];

  this.workers = [];

  for (var i in this.regions) {
    new RegionView(this.game, this.regions[i]);
    var worker = new Worker(this.game, this.regions[i]);
    this.workers.push(worker);
    this.regions[i].workers.push(worker);
    new WorkerView(this.game, worker);
  }

  this.turnView = new TurnView(this.game, this, this.game.width/2, 500);

  this.txtVictory = this.game.add.text(this.game.width/2, 5, 'Victory progress ' + Math.floor(this.game.buildProgress * 2)/10 + '%', { font: "32px Open Sans Condensed", fill: "#408c99", align: "center" });
  this.txtVictory.anchor = {x:0.5, y:0};

  this.nextTurnRequested = false;
},

update: function() {
  this.txtVictory.text = 'Victory progress ' + Math.floor(this.game.buildProgress * 2)/10 + '%';
  if (Math.floor(this.game.buildProgress * 0.2) >= 100) {
    // You won!
    this.game.won = true;
    this.game.state.start('gameover');
  }

  Views.update();

  if (this.nextTurnRequested) {
    Views.nextTurn();
    this.nextTurnRequested = false;
  }
},

requestNextTurn: function() {
  // Could add more complex turn structure here.
  this.nextTurnRequested = true;
}

};

module.exports = Play;
