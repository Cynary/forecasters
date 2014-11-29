
'use strict';
function Preload() {
  this.asset = null;
  this.loadReady = false;
  this.fontReady = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.image('wave', 'assets/wave.png');
    this.load.image('line', 'assets/line.png');
    this.load.image('lifebar', 'assets/lifebar.png');
    this.load.image('regions', 'assets/region.jpg');
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

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    
    var that = this;
    WebFont.load({
      google: {
        families: ['Open Sans Condensed:300']
      },
      active: function() {
        that.fontReady = true;
      }
    });
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    // Check for this.loadReady as well when you actually start loading assets
    if(!!this.fontReady) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.loadReady = true;
  }
};

module.exports = Preload;
