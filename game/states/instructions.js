
'use strict';
var Decorators = require('./widgets/decorators');

function Instructions() {}

Instructions.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '32px Architects Daughter', fill: '#c7ba7a', align: 'center'};

    this.instr = this.game.add.sprite(0, 0, 'instructionpages', 0);
    this.game.input.onDown.add(this.onMouseClick, this);
    $('canvas').css('cursor', 'pointer')

    Decorators.addWave(this);

    this.transitioning = false;
    this.instructiondone = false;

    Decorators.fadeIn(this);
  },
  update: function() {
    Decorators.updateWave(this, this.transitioning ? 200 : -30, this.transitioning ? 5 : 3);
  },

  onMouseClick: function() {
    if (this.instructiondone) {
      $('canvas').css('cursor', '')

      this.sound.play('click');
      Decorators.fadeOut(this, 'realmenu');
      this.transitioning = true;
    }
    else{
      this.sound.play('click');
      if (this.instr.frame <= 1){
        this.instr.frame += 1;
      }
      else if (this.instr.frame == 2){
        this.instructiondone = true;
      }
    }
  },

};

// box size 225 x 175
// bg color f8efd6
// text color aa9f74
// box bg color e8dfb4

module.exports = Instructions;
