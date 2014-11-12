'use strict';

function WeatherView(game, weather, forecast, x, y) {
  this.game = game;
  this.weather = weather;
  this.forecast = forecast;

  this.x = x || 0;
  this.y = y || 0;

  var uiGroup = game.add.group();
  this.uiGroup = uiGroup;
  uiGroup.x = this.x;
  uiGroup.y = this.y;

  // We need a picture here, instead of bunch of geometrical objects
  var graphics = uiGroup.add(game.add.graphics(0, 0));
  graphics.lineStyle(1, 0x408c99, 0.5);
  this.w = 320; // width of whole 7 day forecast
  this.h = 30; // height of single line
  this.w1 = 80; // width of rainfall/correctness
  this.days = 6; // amount of days to corecast
  this.w2 = (this.w-this.w1)/this.days; // width of single cell
  this.fontStyle = { font: "18px Open Sans Condensed", fill: "#ffffff" };
  this.smallFontStyle = { font: "16px Open Sans Condensed", fill: "#ffffff" };
  graphics.drawRect(0, 0, this.w, this.h);
  this.createText('forecast', this.w/2, this.h/2, this.days+' Day Forecast', this.fontStyle, {x:0.5, y:0.5});
  graphics.drawRect(0, this.h, this.w1, this.h);
  this.createText('forecast', 10, 3*this.h/2, 'Rainfall', this.fontStyle, {x:0, y:0.5});
  graphics.drawRect(0, 2*this.h, this.w1, this.h);
  this.createText('forecast', 10, 5*this.h/2, 'Disaster', this.fontStyle, {x:0, y:0.5});
  for (var day = 0; day < this.days; day++) {
    graphics.drawRect(this.w1+day*this.w2, this.h, this.w2, this.h);
    this.createText('_r'+day, this.w1+(day+0.5)*this.w2, 1.5*this.h, '', this.smallFontStyle, {x:0.5, y:0.5});
    graphics.drawRect(this.w1+day*this.w2, 2*this.h, this.w2, this.h);
    this.createText('_d'+day, this.w1+(day+0.5)*this.w2, 2.5*this.h, '', this.smallFontStyle, {x:0.5, y:0.5});
  }
}

WeatherView.prototype = {

nextTurn: function(todayRainfall) {
  this.forecast.observe(todayRainfall);
  this.forecast.newDay();
  var newForecast = this.forecast.forecast(this.days);
  for (var day in newForecast.disaster) {
    this['txt_d'+day].text = (Math.round(newForecast.disaster[day]*100)) + "%";
  }
  for (var day in newForecast.rain) {
    this['txt_r'+day].text = (Math.round(newForecast.rain[day]*100)/10) + '"';
  }
  console.log(newForecast.rain);
  console.log(newForecast.disaster);
  console.log("$$");
},

update: function() {
  // update stuff
},

createButton: function(name, x, y, key, callback) {
  var btn = this.game.add.button(x, y, key, callback, this);
  this['btn' + name] = btn;
  this.uiGroup.add(btn);
},

createText: function(name, x, y, text, style, anchor) {
  var txt = this.game.add.text(x, y, text, style);
  txt.anchor = anchor;
  this['txt' + name] = txt;
  this.uiGroup.add(txt);
},

};

module.exports = WeatherView;
