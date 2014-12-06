
'use strict';
var Decorators = require('./widgets/decorators');

function Instructions() {}

Instructions.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '32px Architects Daughter', fill: '#ffffff', align: 'center'};

    var instr = this.game.add.sprite(0, 0, 'instructionbg');
    $('canvas').css('cursor', 'pointer')

    Decorators.addWave(this);

    this.transitioning = false;

    Decorators.fadeIn(this);
  },
  update: function() {
    Decorators.updateWave(this, this.transitioning ? 200 : -24, this.transitioning ? 5 : 3);

    if (!this.transitioning && this.game.input.activePointer.justPressed()) {
      $('canvas').css('cursor', '')

      this.sound.play('click');
      Decorators.fadeOut(this, 'play');
      this.transitioning = true;
    }
  },

};

module.exports = Instructions;
