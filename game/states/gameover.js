
'use strict';
var Decorators = require('./widgets/decorators');
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Architects Daughter', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);


    this.congratsText = this.game.add.text(this.game.world.centerX, 250, 'You '+(this.game.won ? 'Win!' : 'Lose!'), { font: '44px Architects Daughter', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 400, 'Click To Play Again', { font: '28px Architects Daughter', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);

    Decorators.fadeIn(this);
    this.endReady = false;
    this.time.events.add(600, function() { this.endReady = true; }, this);
  },
  update: function () {
    if(this.endReady && this.game.input.activePointer.justPressed()) {
      this.sound.play('click');
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;
