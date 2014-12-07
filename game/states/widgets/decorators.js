'use strict';

var _ = require('underscore');

module.exports = {
  fadeIn: function(state) {
    state.g = state.game.add.graphics(0,0);
    state.g.alpha = 1.0;
    state.g.lineStyle(1, 0xffffff, 1).beginFill(0xffffff,1).drawRect(0,0,state.game.width,state.game.height);
    var tween = state.game.add.tween(state.g).to({alpha: 0.0}, 300, Phaser.Easing.Exponential.In);
    tween.start();
  },

  fadeOut: function(state, target, p1, p2, p3) {
    if (!state.g) {
      state.g = state.game.add.graphics(0,0);
      state.g.alpha = 0.0;
      state.g.lineStyle(1, 0xffffff, 1).beginFill(0xffffff,1).drawRect(0,0,state.game.width,state.game.height);
    }
    var tween = state.game.add.tween(state.g).to({alpha: 1.0}, 300, Phaser.Easing.Exponential.In);
    tween.onComplete.add(_.partial(this.fadeOutTweenComplete, target, p1, p2, p3), state);
    tween.start();
  },

  fadeOutTweenComplete: function(target, p1, p2, p3) {
    this.game.state.start(target, true, false, p1, p2, p3);
  },

  addWave: function(state) {
    state.wave = state.game.add.sprite(0, 600, 'wave');
    state.rad = 0;
    state.lastY = 600;
  },

  updateWave: function(state, waterLevel, speed) {
    speed = speed || 3;

    state.wave.x = (state.wave.x-1)%100;

    state.rad += 0.03;
    waterLevel += (Math.sin(state.rad))*1;

    var maxChange = state.transitioning ? 5 : 3;

    // Clamp the maximum motion of the wave
    var wantY = this.levelToY(state, waterLevel) - 46;
    var newY = state.lastY + Math.max(Math.min(wantY - state.lastY, speed), -speed);

    state.wave.y = newY;
    state.lastY = newY;
  },

  // TODO Move this back to it's proper location in global.js
  levelToY: function(state, level) {
    // ranges from 0 to 100
    return (state.game.height - 200) * 0.01*(100-level) + 100 * 0.01*level + 120;
  },
};
