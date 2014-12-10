
'use strict';
var Decorators = require('./widgets/decorators');

function Realmenu() {}

Realmenu.prototype = {
  preload: function() {

  },
  create: function() {

    this.game.add.sprite(0, 0, 'truemenu');

    this.playButton = this.game.add.button(400, 350, 'playbutton', this.onClickPlay, this, 1, 0);
    this.playButton.anchor.setTo(0.5, 0.5);
    this.playButton.onInputOver.add(this.onClickOver, this);
    this.playButton.onInputOut.add(this.onClickOut, this);
    this.playButton.input.useHandCursor = true;

    this.instrButton = this.game.add.button(400, 410, 'instrbutton', this.onClickInstr, this, 1, 0);
    this.instrButton.anchor.setTo(0.5, 0.5);
    this.instrButton.input.useHandCursor = true;

    this.credsButton = this.game.add.button(400, 470, 'creditsbutton', this.onClickCred, this, 1, 0);
    this.credsButton.anchor.setTo(0.5, 0.5);

    this.credsButton.input.useHandCursor = true;
    Decorators.addWave(this);

    this.hovering = false;
    this.transitioning = false;

    Decorators.fadeIn(this);

    this.sound.add('main');
    this.sound.add('click', 0.5);
    this.sound.stopAll();
    this.sound.play('main',0.5,true);
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

    Decorators.fadeOut(this, 'play');
  },
  onClickInstr: function() {
    this.sound.play('click');
    this.transitioning = true;

    Decorators.fadeOut(this, 'instructions');
  },
  onClickCred: function() {
    this.sound.play('click');
    this.transitioning = true;

    Decorators.fadeOut(this, 'credits');
  },
  onClickOver: function() {
    this.hovering = true;
  },
  onClickOut: function() {
    this.hovering = false;
  },

};

module.exports = Realmenu;
