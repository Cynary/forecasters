'use strict';

var Views = require('./views');

var WaveView = Views.createViewType(
  function (weather) {
    Views.call(this, weather.global.game, 0, 0);
    this.weather = weather;
    this.wave = this.uiGroup.create(0, 0, 'wave');
    this.rad = 0;
    this.lastY = 600;
  },

  {
    update: function() {
      this.wave.x = (this.wave.x-1)%100;
      var waterLevel = this.weather.getCurrentWaterLevel();

      this.rad += 0.03;
      waterLevel += (Math.sin(this.rad))*1;

      // Clamp the maximum motion of the wave
      var wantY = this.weather.global.levelToY(waterLevel)-46;
      var newY = this.lastY + Math.max(Math.min(wantY - this.lastY, 3), -3);

      this.wave.y = newY;
      this.lastY = newY;

      
    }
  }
);

module.exports = WaveView;
