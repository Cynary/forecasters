'use strict';

var Views = require('./views');

var WaveView = Views.createViewType(
  function (weather) {
    Views.call(this, weather.global.game, 0, 0);
    this.weather = weather;
    this.wave = this.uiGroup.create(0, 0, 'wave');
    // This is a hack for wave demo
    this.rad = 0;

    this.lastY = 600;
    this.rising = false;
  },

  {
    update: function() {
      this.wave.x = (this.wave.x-1)%100;
      var waterLevel = this.weather.getCurrentWaterLevel();

      this.rad += 0.01;
      waterLevel += (Math.sin(this.rad))*15;

      // 0 level: y = game.height - 200
      // 100 level: y = 100

      // Clamp the maximum motion of the wave
      var wantY = (this.weather.global.game.height - 200) * 0.01*(100-waterLevel) + 100 * 0.01*waterLevel;
      var newY = this.lastY + Math.max(Math.min(wantY - this.lastY, 3), -3);

      this.wave.y = newY;
      this.lastY = newY;
    },

    onRisingComplete: function() {
      this.rising = false;
    }
  }
);

module.exports = WaveView;
