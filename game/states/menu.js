
'use strict';
var Decorators = require('./widgets/decorators');

var done = false;

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    this.game.add.sprite(0, 0, 'menubg');
    
    Decorators.addWave(this);

    this.hovering = false;
    this.transitioning = false;

    Decorators.fadeIn(this, 750);
    
    this.time.events.add(Phaser.Timer.SECOND * 3, function () {
          this.onTimeOut();
        }, this);

    // Another sound maybe?
//    this.sound.add('main');
//    this.sound.add('click');
//    this.sound.stopAll();
//    this.sound.play('main',1,true);
  },
  update: function() {
    // detect esc button pressed.
    if(this.input.keyboard.addKey(Phaser.Keyboard.ESC).isDown){
      this.onTimeOut();
    }
  },
  onTimeOut: function() {
    if(!done) {
      done = true;
      Decorators.fadeOut(this, 'realmenu', null, null, null, 750);
    }
  },
};

module.exports = Menu;
