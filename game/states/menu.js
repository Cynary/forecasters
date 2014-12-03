
'use strict';
var Decorators = require('./widgets/decorators');

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

    Decorators.addWave(this);

    this.hovering = false;
    this.transitioning = false;

    Decorators.fadeIn(this);

    this.sound.add('main');
    this.sound.add('click');
    this.sound.stopAll();
    this.sound.play('main',1,true);
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

    Decorators.fadeOut(this, 'instructions');
  },
  onClickOver: function() {
    this.hovering = true;
  },
  onClickOut: function() {
    this.hovering = false;
  },

};

module.exports = Menu;
