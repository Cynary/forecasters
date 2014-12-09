
'use strict';
var Decorators = require('./widgets/decorators');

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
          Decorators.fadeOut(this, 'realmenu', null, null, null, 750);
        }, this);

    // Another sound maybe?
//    this.sound.add('main');
//    this.sound.add('click');
//    this.sound.stopAll();
//    this.sound.play('main',1,true);
  },
  update: function() {
    var waterLevel = this.hovering ? 16 : -24;
    if (this.transitioning) {
      waterLevel = 200;
    }

    var speed = this.transitioning ? 5 : 3;

    Decorators.updateWave(this, waterLevel, speed);
  },

};

module.exports = Menu;
