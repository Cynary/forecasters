
'use strict';
var Decorators = require('./widgets/decorators');

function Credits() {}

Credits.prototype = {
  preload: function() {

  },
  create: function() {

    this.game.add.sprite(0, 0, 'credits');
    this.game.input.onDown.add(this.onClickPlay, this);
    $('canvas').css('cursor', 'pointer')

    Decorators.addWave(this);

    this.hovering = false;
    this.transitioning = false;

    Decorators.fadeIn(this);

  },
  update: function() {
    var waterLevel = this.hovering ? 16 : -24;
    if (this.transitioning) {
      waterLevel = 200;
    }

    var speed = this.transitioning ? 5 : 3;

    Decorators.updateWave(this, waterLevel, speed);
  },
  onClickPlay: function() {
    this.sound.play('click');
    this.transitioning = true;

    Decorators.fadeOut(this, 'realmenu');
  },
  onClickOver: function() {
    this.hovering = true;
  },
  onClickOut: function() {
    this.hovering = false;
  },
};

module.exports = Credits;
