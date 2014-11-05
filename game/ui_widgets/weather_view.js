'use strict';

var 

function WeatherView(game, weather, x, y) {
  this.game = game;
  this.weather = weather;

  this.x = x || 0;
  this.y = y || 0;

  var uiGroup = game.add.group();
  this.uiGroup = uiGroup;
  this.uiGroup.x = this.x;
  this.uiGroup.y = this.y;
  
  this.createText('Rain', 0, 0, 'rain', { font: "16px Arial", fill: "#ffffff" });
  this.createText('State', 0, 20, 'state', { font: "16px Arial", fill: "#ffffff" });
  this.createText('Forecast', 0, 40, 'forecast', { font: "12px Arial", fill: "#ffffff" });
}

WeatherView.prototype = {

update: function() {
  // update stuff
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

};

module.exports = WeatherView;
