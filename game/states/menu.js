
'use strict';
var TransitionUtils = require('./widgets/transition_utils');

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.game.add.sprite(0, 0, 'menubg');

    this.playButton = this.game.add.button(400, 490, 'playbutton', this.onClickPlay, this, 1, 0);
    this.playButton.anchor.setTo(0.5, 0.5);
    this.playButton.onInputOver.add(this.onClickOver, this);
    this.playButton.onInputOut.add(this.onClickOut, this);

    // TODO when the wave asset is changed, fix this
    this.wave = this.game.add.sprite(0, 600, 'wave');
    this.rad = 0;
    this.lastY = 600;

    this.hovering = false;
    this.transitioning = false;

    TransitionUtils.fadeIn(this);
  },
  update: function() {
    this.wave.x = (this.wave.x-1)%100;
    var waterLevel = this.hovering ? 7 : -20;
    if (this.transitioning) {
      waterLevel = 200;
    }

    this.rad += 0.03;
    waterLevel += (Math.sin(this.rad))*1;

    var maxChange = this.transitioning ? 5 : 3;

    // Clamp the maximum motion of the wave
    var wantY = this.levelToY(waterLevel) - 126;
    var newY = this.lastY + Math.max(Math.min(wantY - this.lastY, maxChange), -maxChange);

    this.wave.y = newY;
    this.lastY = newY;
  },
  onClickPlay: function() {
    this.transitioning = true;
    TransitionUtils.fadeOut(this, 'play');
  },
  onClickOver: function() {
    this.hovering = true;
  },
  onClickOut: function() {
    this.hovering = false;
  },

  // TODO Move this back to it's proper location in global.js
  levelToY: function(level) {
    // ranges from 0 to 100
    return (this.game.height - 200) * 0.01*(100-level) + 100 * 0.01*level + 120;
  },
};

module.exports = Menu;
