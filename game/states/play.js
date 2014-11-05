'use strict';

var Region = require('../objects/region');
var RegionView = require('../ui_widgets/region_view');
var Weather = require('../objects/weather');
var Forecast = require('../objects/forecast');

function Play() {}

Play.prototype = {

create: function() {
  //Everything that relates to buildProgress is a temporary patch just to get it in for playtest.
  this.game.buildProgress = 0;

  this.region1 = new Region(this.game);
  this.rv1 = new RegionView(this.game, this.region1, 60, 60);

  this.region2 = new Region(this.game);
  this.rv2 = new RegionView(this.game, this.region2, 120, 260);

  this.forecast = new Forecast();
  this.forecastText = this.game.add.text(0,550, "Forecast: " + this.forecast.forecast(7), {font: "20px Arial", fill: "#ffffff", align: "center"});

  this.weather = new Weather();
  
  this.txtVictory = this.game.add.text(0, 0, 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%', { font: "20px Arial", fill: "#ffffff", align: "center" });

  this.losses = 0;

  this.txtLosses = this.game.add.text(0, 20, 'Losses ', { font: "20px Arial", fill: "#ffffff", align: "center" });
},

update: function() {
  this.region1.update(0.015);
  this.rv1.update();
  this.region2.update(0.015);
  this.rv2.update();

  for (var i in this.region1.workers) {
    if (!this.region1.workers[i].safe) {
      this.losses += Math.max(0.0, 0.8 - this.region1.health);
    }
  }
  for (var i in this.region2.workers) {
    if (!this.region2.workers[i].safe) {
      this.losses += Math.max(0.0, 0.8 - this.region1.health);
    }
  }
  
  this.txtVictory.text = 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%';
  this.txtLosses.text = 'Losses ' + Math.floor(this.losses);

  this.forecastText.text = "Forecast: " + this.forecast.forecast(7);
  console.dir(this.forecast.forecast(7));
}

};

module.exports = Play;
