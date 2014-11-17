'use strict';

var Views = require('./views');

var ForecastView = Views.createViewType(
  function (weather, x, y) {
    Views.call(this, weather.global.game, x, y);
    this.weather = weather;

    this.graphics = this.weather.global.game.add.graphics(0,0);
    this.uiGroup.add(this.graphics);

    this.needsUpdate = true;
    this.lastWaterLevels = this.weather.getForecast();
  },

  {
    update: function() {
      var waterLevels = this.weather.getForecast();

      for (var i in waterLevels) {
        if (this.lastWaterLevels[i] != waterLevels[i]) {
          this.needsUpdate = true;
        }
      }

      if (this.needsUpdate) {
        var graphics = this.graphics;

        // Clear the area
        graphics.clear();
        
        // Draw the bars
        graphics
        .lineStyle(1, 0x5577ff, 1)
        .beginFill(0x5577ff, 1);
        for (var i in waterLevels) {
          var level = waterLevels[i];
          graphics.drawRect(i*25, 100-level, 25, level);
        }
        this.lastWaterLevels = waterLevels.slice(0);
        this.needsUpdate = false;
      }
    },
  }
);

module.exports = ForecastView;
