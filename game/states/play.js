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
    new RegionView(this.game, new Region(this.game), new Weather(), new Forecast(), 400, 60)
  ];

  this.turnView = new TurnView(this.game, this, 250, 400);

  this.txtVictory = this.game.add.text(0, 0, 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%', { font: "20px Open Sans Condensed", fill: "#ffffff", align: "center" });

  this.losses = 0;

  this.txtLosses = this.game.add.text(0, 20, 'Losses ', { font: "20px Arial", fill: "#ffffff", align: "center" });

  this.txtDisaster = this.game.add.text(0, 40, '', { font: "20px Arial", fill: "#ff0000", align: "center" });

  this.nextTurnRequested = false;
},

update: function() {
  this.txtVictory.text = 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%';
  this.txtLosses.text = 'Losses ' + Math.floor(this.losses);

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
