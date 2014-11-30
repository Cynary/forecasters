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

  fadeOut: function(state, target) {
    if (!state.g) {
      state.g = state.game.add.graphics(0,0);
      state.g.alpha = 0.0;
      state.g.lineStyle(1, 0xffffff, 1).beginFill(0xffffff,1).drawRect(0,0,state.game.width,state.game.height);
    }
    var tween = state.game.add.tween(state.g).to({alpha: 1.0}, 300, Phaser.Easing.Exponential.In);
    tween.onComplete.add(_.partial(this.fadeOutTweenComplete, target), state);
    tween.start();
  },

  fadeOutTweenComplete: function(target) {
    this.game.state.start('play');
  }
};
