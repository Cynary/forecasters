
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('city', 'assets/city.png');
    this.load.image('fortify', 'assets/fortify.png');
    this.load.image('supplies', 'assets/supplies.png');
    this.load.image('evac', 'assets/evac.png');
    this.load.spritesheet('next_turn', 'assets/next_turn.png', 220, 104);
    

    WebFont.load({
      google: {
        families: ['Open Sans Condensed:300']
      }
    });
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
