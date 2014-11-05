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

  //this.region2 = new Region(this.game);
  //this.rv2 = new RegionView(this.game, this.region2, 120, 260);

  this.forecast = new Forecast();
  this.forecastText = [
    this.game.add.text(0,530,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(200,530,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(400,530,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(0,550,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(200,550,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(400,550,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(0,510,"Probabilities of disaster approaching, or hitting", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(0,450,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(200,450,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(400,450,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(0,480,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(200,480,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(400,480,"", {font: "20px Arial", fill: "#ffffff", align: "center"}),
    this.game.add.text(0,420,"Rainfall predictions", {font: "20px Arial", fill: "#ffffff", align: "center"})
];

  this.weather = new Weather();
  this.frame = 0;
  this.msPerFrame = 15;

  this.txtVictory = this.game.add.text(0, 0, 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%', { font: "20px Arial", fill: "#ffffff", align: "center" });

  this.losses = 0;

  this.txtLosses = this.game.add.text(0, 20, 'Losses ', { font: "20px Arial", fill: "#ffffff", align: "center" });

  this.txtDisaster = this.game.add.text(0, 40, '', { font: "20px Arial", fill: "#ff0000", align: "center" });
},

update: function() {
  ++this.frame;
  this.region1.update(0.015);
  this.rv1.update();
  //this.region2.update(0.015);
  //this.rv2.update();
  //
  var second = Math.floor(1000/this.msPerFrame);

  if (this.disaster) {
    for (var i in this.region1.workers) {
      if (!this.region1.workers[i].safe) {
        if (this.region1.supplies <= 0) {
          this.losses += Math.max(0.0, 0.95 - this.region1.health);
        } else if ((this.frame % second) == 0) {
          this.region1.supplies -= 1;
        }
      }
    }
  }

  this.txtVictory.text = 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%';
  this.txtLosses.text = 'Losses ' + Math.floor(this.losses);

  if ((this.frame % second) == 0)
  {
    var todayRainfall = this.weather.newRainfall();

    if (todayRainfall > 3.0) {
      this.disaster = true;
      this.txtDisaster.text = 'DISASTER';
      this.region1.health -= todayRainfall/100;
    } else {
      this.disaster = false;
      this.txtDisaster.text = '';
    }

    console.log("####");
    console.log(todayRainfall);
    this.forecast.observe(todayRainfall);
    this.forecast.newDay();
    var newForecast = this.forecast.forecast(6);
    for (var day in newForecast.disaster)
    {
      this.forecastText[Number(day)].text =
        "Day #" + (Number(day)+1) + ": " + (Number(newForecast.disaster[day])*100).toPrecision(2) + "%";
    }
    for (var day in newForecast.rain)
    {
      this.forecastText[Number(day)+7].text =
        "Day #" + (Number(day)+1) + ": " + (Number(newForecast.rain[day])*10).toPrecision(3) + " inch";
    }
  }
}

};

module.exports = Play;
