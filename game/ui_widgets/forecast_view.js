'use strict';

var Views = require('./views');
var _ = require('underscore');

var ForecastView = Views.createViewType(
  function (weather, x, y) {
    Views.call(this, weather.global.game, x, y);
    this.weather = weather;

    this.graphics = this.weather.global.game.add.graphics(0,0);
    this.uiGroup.add(this.graphics);

    // Note: updating every frame has performance issues, so this makes it less slow.
    this.needsUpdate = true;
    this.lastWaterLevels = this.weather.getForecast();
    this.lastSelectedRegionIndex = -1;
  },

  {
    update: function() {
      var waterLevels = this.weather.getForecast();

      // Check if water levels have been updated
      for (var i in waterLevels) {
        if (this.lastWaterLevels[i] != waterLevels[i]) {
          this.needsUpdate = true;
        }
      }

      var mx = this.weather.global.game.input.mousePointer.x;
      var my = this.weather.global.game.input.mousePointer.y;
      // Check if city selection has changed
      var selectedRegion = _.min(this.weather.global.regions, function(region) {
        return (mx-region.x)*(mx-region.x) + (my-region.y)*(my-region.y);
      });

      if (selectedRegion.regionIndex != this.lastSelectedRegionIndex) {
        this.needsUpdate = true;
        this.lastSelectedRegionIndex = selectedRegion.regionIndex;
      }

      if (this.needsUpdate) {
        var graphics = this.graphics;

        // Clear the area
        graphics.clear();
        
        // Draw bar graph
        graphics.lineStyle(1, 0x5577ff, 1);
        graphics.beginFill(0x5577ff, 1);
        for (var i in waterLevels) {
          var level = waterLevels[i];
          graphics.drawRect(i*25, 100-level, 25, level);
        }

        // Draw the flooding line
        graphics.lineStyle(1, 0xff0000, 1);
        graphics.moveTo(0, 100-selectedRegion.height);
        graphics.lineTo(waterLevels.length*25, 100-selectedRegion.height);

        this.lastWaterLevels = waterLevels.slice(0);
        this.needsUpdate = false;
      }
    },
  }
);

module.exports = ForecastView;
