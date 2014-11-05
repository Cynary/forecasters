'use strict';

var Region = require('../objects/region');
var RegionView = require('../ui_widgets/region_view');

function Play() {}

Play.prototype = {

create: function() {
  //Everything that relates to buildProgress is a temporary patch just to get it in for playtest.
  this.game.buildProgress = 0
  this.region1 = new Region(this.game);
  this.rv1 = new RegionView(this.game, this.region1, 60, 60);

  this.region2 = new Region(this.game);
  this.rv2 = new RegionView(this.game, this.region2, 120, 260);
  
  this.text = this.game.add.text(0, 0, 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%', { font: "20px Arial", fill: "#ffffff", align: "center" });
},

update: function() {
  this.region1.update(0.015);
  this.rv1.update();
  this.region2.update(0.015);
  this.rv2.update();
  
  this.text.text = 'Victory progress ' + Math.floor(this.game.buildProgress / 5.0) + '%'
},


};

module.exports = Play;
