
'use strict';
var Decorators = require('./widgets/decorators');

function Instructions() {}

Instructions.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '32px Open Sans Condensed', fill: '#ffffff', align: 'center'};


    this.instructionsText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 120, 'Instructions go here; Click anywhere to play', style);
    this.instructionsText.anchor.setTo(0.5, 0.5);

    Decorators.addWave(this);

    this.transitioning = false;

    Decorators.fadeIn(this);
  },
  update: function() {
    Decorators.updateWave(this, this.transitioning ? 200 : -20, this.transitioning ? 5 : 3);

    if (this.game.input.activePointer.justPressed()) {
      Decorators.fadeOut(this, 'play');
      this.transitioning = true;
    }
  },

};

module.exports = Instructions;
