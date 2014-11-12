'use strict';

var WorkerView = require('./worker_view.js');
var WeatherView = require('./weather_view.js');

function RegionView(game, region, weather, forecast, x, y) {
  this.game = game;
  this.region = region;

  this.x = x || 0;
  this.y = y || 0;

  var uiGroup = game.add.group();
  this.uiGroup = uiGroup;
  uiGroup.x = this.x;
  uiGroup.y = this.y;

  var sprite = game.add.sprite(0, 0, 'city');
  sprite.scale.setTo(0.1,0.1);
  uiGroup.add(sprite);

  this.createText('Health', 160, 10, 'health', { font: "16px Arial", fill: "#000000" });
  this.createText('Supplies', 160, 32, 'supplies', { font: "16px Arial", fill: "#000000" });
  this.createText('Disaster', 160, 54, '', { font: "20px Arial", fill: "#ff0000", align: "center" });
  this.workerViews = new Array(region.workers.length);

  for (var i in region.workers) {
    this.workerViews[i] = new WorkerView(game, region.workers[i], 0, 55*i);
    uiGroup.add(this.workerViews[i].uiGroup);
  }

  this.weatherView = new WeatherView(game, weather, forecast, 0, 240);
  uiGroup.add(this.weatherView.uiGroup);
}

RegionView.prototype = {

update: function() {
  this.txtHealth.text = 'health: ' + Math.floor(this.region.health*100) + '%';
  this.txtSupplies.text = 'supplies: ' + Math.floor(this.region.supplies);
  for (var i in this.workerViews) {
    this.workerViews[i].update();
  }
  this.weatherView.update();
},

createButton: function(name, x, y, key, callback) {
  var btn = this.game.add.button(x, y, key, callback, this);
  this['btn' + name] = btn;
  this.uiGroup.add(btn);
},

createText: function(name, x, y, text, style) {
  var txt = this.game.add.text(x, y, text, style);
  this['txt' + name] = txt;
  this.uiGroup.add(txt);
},

nextTurn: function() {
  this.region.nextTurn();
  var todayRainfall = this.weatherView.weather.newRainfall();
  console.log(todayRainfall);
  if (todayRainfall > 2.0) {
    // Disaster happened
    this.txtDisaster.text = 'DISASTER';
    console.log(this.region.workers)
    for(var i=0; i<3; i++){
      var worker = this.region.workers[i]
      if (worker.safe && this.region.supplies >= 1){
        this.region.supplies -= 1;
      }else{
        this.region.health -= todayRainfall/100;
        if (this.region.health < 0) {
          this.game.won = false;
          this.game.state.start('gameover');
        }
      }
    }
  } else {
    // Disaster didn't happen
    this.txtDisaster.text = '';
  }
  this.weatherView.nextTurn(todayRainfall);
},

};

module.exports = RegionView;
