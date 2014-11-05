'use strict';

var Region = require('../objects/region');
var RegionView = require('../ui_widgets/region_view');
var Weather = require('../objects/weather');
var Forecast = require('../objects/forecast');

function Play() {}

Play.prototype = {

create: function() {
  //Everything that relates to buildProgress is a temporary patch just to get it in for playtest.
  this.game.buildProgress = 0
  this.region1 = new Region(this.game);
  this.rv1 = new RegionView(this.game, this.region1, 60, 60);

  this.region2 = new Region(this.game);
  this.rv2 = new RegionView(this.game, this.region2, 120, 260);

  this.text = this.game.add.text(0, 0, 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%', { font: "20px Arial", fill: "#ffffff", align: "center" });


  this.forecast = new Forecast();
  this.forecastText = this.game.add.text(0,550, "Forecast: " + this.forecast.forecast(7), {font: "20px Arial", fill: "#ffffff", align: "center"});

  this.weather = new Weather();
  this.frame = 0;
  this.msPerFrame = 15;
},

update: function() {
  ++this.frame;
  this.region1.update(0.015);
  this.rv1.update();
  this.region2.update(0.015);
  this.rv2.update();

  this.text.text = 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%';

  var second = Math.floor(1000/this.msPerFrame);
  if ((this.frame % second) == 0)
  {
    this.forecastText.text = "Forecast: " + this.forecast.forecast(7);
    console.dir(this.forecast.forecast(7));
  }
}

};

module.exports = Play;
