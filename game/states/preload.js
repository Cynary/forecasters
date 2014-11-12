
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
    this.load.image('city1', 'assets/city1.png');
    this.load.image('city2', 'assets/city2.png');
    this.load.spritesheet('fortify', 'assets/fortify.png', 55, 55);
    this.load.spritesheet('supplies', 'assets/supplies.png', 55, 55);
    this.load.spritesheet('evac', 'assets/evac.png', 55, 55);
    this.load.image('person', 'assets/person.png');
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
