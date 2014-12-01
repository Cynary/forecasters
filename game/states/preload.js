
'use strict';
var Decorators = require('./widgets/decorators');

function Preload() {
  this.asset = null;
  this.loadReady = false;
  this.fontReady = false;
}

Preload.prototype = {
  preload: function() {
    var that = this;
    WebFont.load({
      google: {
        families: ['Architects Daughter']
      },
      active: function() {
        that.fontReady = true;
      }
    });

    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.spritesheet('playbutton', 'assets/clicktoplaybutton.png', 376, 66);
    this.load.image('menubg', 'assets/title screen.png');

    this.load.image('wave', 'assets/wave.png');
    this.load.image('line', 'assets/line.png');
    this.load.image('lifebar', 'assets/lifebar.png');
    this.load.spritesheet('next_turn', 'assets/next_turn.png', 220, 104);

    this.load.image('region0', 'assets/bear castle.png');
    this.load.image('region1', 'assets/bobble castle.png');
    this.load.image('region2', 'assets/dinosaur castle.png');
    this.load.image('region3', 'assets/duck castle.png');
    this.load.image('region4', 'assets/truck castle.png');

    this.load.image('regionb', 'assets/broken castle.png');

    this.load.image('background', 'assets/backgroundbeach.png');

    this.load.image('point', 'assets/point.png');

    this.load.image('person0', 'assets/bear.png');
    this.load.image('person1', 'assets/bobble.png');
    this.load.image('person2', 'assets/dinosaur.png');
    this.load.image('person3', 'assets/duck.png');
    this.load.image('person4', 'assets/truck.png');

    this.load.image('mega1', 'assets/mega1-01.png');
    this.load.image('mega2', 'assets/mega2-01.png');
    this.load.image('mega3', 'assets/mega3-01.png');
    this.load.image('mega4', 'assets/mega4-01.png');
    this.load.image('mega5', 'assets/mega5-01.png');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    // Check for this.loadReady as well when you actually start loading assets
    if(!!this.fontReady && !!this.loadReady) {
      Decorators.fadeOut(this, 'menu');
    }
  },
  onLoadComplete: function() {
    this.loadReady = true;
  }
};

module.exports = Preload;
