
'use strict';
var Decorators = require('./widgets/decorators');
function GameOver() {}

// win text color 405bb2

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '36px Architects Daughter', fill: '#FFFFFF', align: 'center'};


    if (this.won) {
      this.game.add.sprite(0, 0, 'winbg');
      this.congratsText = this.game.add.text(this.game.world.centerX, 370, 'You won in ' + this.turnsTaken + ' turns!', style);
      this.congratsText.anchor.setTo(0.5, 0.5);
    } else {
      this.game.add.sprite(0, 0, 'losebg');
      var ctext = "You lost!";
      if (this.loseCondition == "water") {
        ctext = "Your toys are lost to the waves!";
      } else if (this.loseCondition == "candy") {
        ctext = "Your toys ran out of candy!";
      }
      this.congratsText = this.game.add.text(this.game.world.centerX, 250, ctext, style);
      this.congratsText2 = this.game.add.text(this.game.world.centerX, 325, 'You finished ' + (Math.floor(this.castleProgress*10)/10) + '% of the castle', style);
      this.congratsText.anchor.setTo(0.5, 0.5);
      this.congratsText2.anchor.setTo(0.5, 0.5);
    }

    this.instructionText = this.game.add.text(this.game.world.centerX, 530, 'click to return to main menu', style);
    this.instructionText.anchor.setTo(0.5, 0.5);

    Decorators.fadeIn(this);
    this.endReady = false;
    this.time.events.add(600, function() { this.endReady = true; }, this);
    $('canvas').css('cursor', 'pointer')
  },
  update: function () {
    if(this.endReady && this.game.input.activePointer.justPressed()) {
      this.endReady = false;
      $('canvas').css('cursor', '')
      this.sound.play('click');
      this.game.input.useHandCursor = false;
      Decorators.fadeOut(this, 'realmenu');
    }
  },
  init: function(won, p1, p2) {
    this.won = won;
    if (this.won) {
      this.turnsTaken = p1;
    } else {
      this.castleProgress = p1;
      this.loseCondition = p2;
    }
  }
};
module.exports = GameOver;
