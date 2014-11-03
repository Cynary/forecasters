'use strict';

function RegionView(game, region, x, y) {
  this.game = game;
  this.region = region;

  this.x = x || 0;
  this.y = y || 0;

  var uiGroup = game.add.group();
  this.uiGroup = uiGroup;
  this.uiGroup.x = this.x;
  this.uiGroup.y = this.y;

  uiGroup.create(0, 0, 'city');

  this.createButton('Gather', 10, 10, 'fortify', this.gatherOnClick);
  this.createButton('Build', 60, 10, 'fortify', this.buildOnClick);
  this.createButton('Evac', 110, 10, 'fortify', this.evacOnClick);

  this.createText('Health', 10, 55, 'health', { font: "16px Arial", fill: "#000000" });
  this.createText('Supplies', 10, 72, 'supplies', { font: "16px Arial", fill: "#000000" });
}

RegionView.prototype = {

update: function() {
  this.txtHealth.text = 'health: ' + Math.floor(this.region.health) + '%';
  this.txtSupplies.text = 'supplies: ' + Math.floor(this.region.supplies);
},

createButton: function(name, x, y, key, callback) {
  var btn = this.game.add.button(x, y, key, callback, this);
  this['btn' + name] = btn;
  this.uiGroup.add(btn);
},

createText: function(name, x, y, text, style) {
  var txt = this.game.add.text(x, y, text, style);
  this['txt' + name] = txt;
  this.uiGroup.add(txt);
},

// TODO: Make these actions make sense
gatherOnClick: function() {
  this.region.supplies += 1;
},

buildOnClick: function() {
  this.region.health += 2;
},

evacOnClick: function() {
  this.region.health -= 5;
},

};

module.exports = RegionView;
