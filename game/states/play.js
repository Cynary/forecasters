'use strict';

var Region = require('../objects/region');
var RegionView = require('../ui_widgets/region_view');

function Play() {}

Play.prototype = {

create: function() {
  this.region1 = new Region(this.game);
  this.rv1 = new RegionView(this.game, this.region1, 60, 60);

  this.region2 = new Region(this.game);
  this.rv2 = new RegionView(this.game, this.region2, 120, 260);
},

update: function() {
  this.region1.update(0.015);
  this.rv1.update();
  this.region2.update(0.015);
  this.rv2.update();
},


};

module.exports = Play;
