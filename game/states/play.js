'use strict';

var Region = require('../objects/region');
var RegionView = require('../ui_widgets/region_view');
var TurnView = require('../ui_widgets/turn_view');
var Weather = require('../objects/weather');
var Forecast = require('../objects/forecast');

function Play() {}

Play.prototype = {

create: function() {
  //Everything that relates to buildProgress is a temporary patch just to get it in for playtest.
  this.game.buildProgress = 0;
  this.regionViews = [
    new RegionView(this.game, new Region(this.game), new Weather(), new Forecast(), 60, 60),
    new RegionView(this.game, new Region(this.game), new Weather(), new Forecast(), 420, 60)
  ];

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

  for (var index in this.regionViews) {
    var regionView = this.regionViews[index];
    // Update Region View
    regionView.update();
    // Update turn
    if (this.nextTurnRequested) {
      regionView.nextTurn();
    }
  }
  this.nextTurnRequested = false;

},

requestNextTurn: function() {
  // Could add more complex turn structure here.
  this.nextTurnRequested = true;
}

};

module.exports = Play;
