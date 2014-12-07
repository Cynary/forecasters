'use strict';

var Views = require('./views');

var MegaView = Views.createViewType(
  function (global, x, y) {
    Views.call(this, global.game, x, y);

    this.global = global;

    var megaFlipped = [
      this.uiGroup.create(0, 0, 'mega5'),
      this.uiGroup.create(0, 0, 'mega4'),
      this.uiGroup.create(0, 0, 'mega3'),
      this.uiGroup.create(0, 0, 'mega2'),
      this.uiGroup.create(0, 0, 'mega1')
      ];
    this.mega = new Array(megaFlipped.length);

    for (var i = 0; i < this.mega.length; ++i) {
      this.mega[i] = megaFlipped[this.mega.length - i - 1];
      this.mega[i].anchor.setTo(0.5, 1.0);
      this.mega[i].scale = { x: 0.8, y: 0.8 };
      this.mega[i].alpha = 0.0;
    }

    this.lastProgress = 0.0;
  },

  {
    update: function() {
      
      if (this.global.buildProgress != this.lastProgress) {
        var bp = this.global.buildProgress;
        var j = Math.min(Math.floor(bp/20.0),4);
        for (var i = 0; i < j; ++i) {
          this.mega[i].alpha = 1.0;
        }
        this.mega[i].alpha = Math.min(1.0, bp/20.0-j);
      }
      
    }
  }
);

module.exports = MegaView;
