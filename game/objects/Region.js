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