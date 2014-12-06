'use strict';

function Views(game, x, y) {
  // Use Views.call(this, game, x, y) in subclasses
  this.game = game;

  var uiGroup = game.add.group();
  this.uiGroup = uiGroup;
  uiGroup.x = x || 0;
  uiGroup.y = y || 0;

  Views.all.push(this);
}

Views.prototype = {
  update: function() {},

  // Creates a button called btnname
  createButton: function(name, x, y, key, callback) {
    var btn = this.game.add.button(x, y, key, callback, this);
    this['btn' + name] = btn;
    this.uiGroup.add(btn);
    btn.input.useHandCursor = true;
  },

  // Creates a text called txtname
  createText: function(name, x, y, text, style) {
    var txt = this.game.add.text(x, y, text, style);
    this['txt' + name] = txt;
    this.uiGroup.add(txt);
  }

};

Views.all = [];

// Use this function to subclass a view
Views.createViewType = function(ctor, proto) {
  ctor.prototype = Object.create(Views.prototype);
  for (var k in proto) {
    ctor.prototype[k] = proto[k];
  }
  ctor.prototype.constructor = ctor;
  return ctor;
}

Views.update = function() {
  for (var i in Views.all) {
    Views.all[i].update();
  }
}

module.exports = Views;
