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
  this.region1 = new Region(this.game);
  this.rv1 = new RegionView(this.game, this.region1, 60, 60);


  this.turnView = new TurnView(this.game, this, 300, 300);

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
    this.game.add.text(0,420,"Rainfall predictions", {font: "20px Arial", fill: "#ffffff", align: "center"})];

  this.weather = new Weather();
  this.frame = 0;
  this.msPerFrame = 15;

  this.txtVictory = this.game.add.text(0, 0, 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%', { font: "20px Arial", fill: "#ffffff", align: "center" });

  this.losses = 0;

  this.txtLosses = this.game.add.text(0, 20, 'Losses ', { font: "20px Arial", fill: "#ffffff", align: "center" });

  this.txtDisaster = this.game.add.text(0, 40, '', { font: "20px Arial", fill: "#ff0000", align: "center" });

  this.nextTurnRequested = false;
},

update: function() {
  ++this.frame;

  // Update UIs
  this.rv1.update();

  this.txtVictory.text = 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%';
  this.txtLosses.text = 'Losses ' + Math.floor(this.losses);

  // Update turn
  if (this.nextTurnRequested) {
    this.region1.nextTurn();

    var todayRainfall = this.weather.newRainfall();

    if (todayRainfall > 2.0) {
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
    this.nextTurnRequested = false;
  }
},

requestNextTurn: function() {
  // Could add more complex turn structure here.
  this.nextTurnRequested = true;
}

};

module.exports = Play;
