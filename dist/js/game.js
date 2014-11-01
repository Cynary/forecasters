(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'forecasters');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
//A Button to be displayed on top of a region.
//Onclick: function that is fired when the button is clicked.
//This by itself doesn't do anything. It is used with the 'Region' Class.
//The onclick method is Passed with the region the button is tied to.
function Button(texture, onclick){
    this.texture = texture
    this.onclick = onclick 
}


module.exports = Button;
},{}],3:[function(require,module,exports){
Button = require('../objects/Button')

// Broad Region Class.
// attributes: JS object (dictionary) to additionally specify the details of the region. optional.
function Region (game, texture, locX, locY, attributes){
  this.game = game;
  this.texture = texture;
  this.locX = locX;
  this.locY = locY; 
  var self = this;
  this.buttons = []
  this.texts = []
  if (attributes){
    Object.keys(attributes).map(function(attribute){
      self[attribute] = attributes[attribute]
    })
  }


  this.sprite = game.add.sprite(locX, locY, texture);
  this.sprite.inputEnabled = true;

  this.addButton = function(button, x, y){
    var x = x || 0;
    var y = y || 0;
    var buttonsprite = game.add.sprite(locX + x, locY + y, button.texture);
    buttonsprite.inputEnabled = true;
    buttonsprite.events.onInputDown.add(function(){button.onclick(self)});
    console.log(buttonsprite.events.onInputDown)
    self.sprite.events.onInputDown.add(function(){console.log('clicked here')})
    this.buttons.push({
      'buttonobj':button,
      'x':x,
      'y':y,
      'buttonsprite':buttonsprite
    })
  }
  
  this.addText = function(name,x,y, isAttribute){
    if(isAttribute){
      var text = name + ' ' + self[name]
    }else{
      var text = name;
    }
    console.log(text)
    textobj = game.add.text(locX + x, locY+ y, text);
    this.texts.push({
      'isAttribute':isAttribute,
      'name':name,
      'textobj': textobj,
      'x':x,
      'y':y
    })
  }
  
  
  this.update = function(){
    self.texts.map(function(text){
      if(text.isAttribute){
       textobj.text = text.name + ' ' + self[text.name];
      }
    })
  }
}

module.exports = Region;
},{"../objects/Button":2}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){
Region = require('../objects/Region');
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      regionTest = new Region(this.game,'city', this.game.width/2, this.game.height/3, {preparedness: 10});
      game= this.game;
      button = new Button('fortify', function(region){
        console.log('clicked')
        console.log(region.preparedness)
        region.preparedness += 50
      })
      regionTest.addButton(button, 10, 10);
      regionTest.addText('preparedness',10,50,true);
    },
    update: function() {
      regionTest.update();
      regionTest.preparedness -= 1;
    },
  };
  
  module.exports = Play;
},{"../objects/Region":3}],8:[function(require,module,exports){

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
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.image('city', 'assets/city.jpg');
    this.load.image('fortify', 'assets/fortify.png');

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

},{}]},{},[1])