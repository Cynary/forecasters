'use strict';

var Views = require('./views');

var RegionView = Views.createViewType(
  function (game, region) {
    Views.call(this, game, region.x, region.y);
    this.region = region;

    this.imgCity = this.uiGroup.create(0, 0, 'region');
    this.imgCity.anchor.setTo(0.5, 1.0);
  },

  {

    update: function() {
      //
    },

    nextTurn: function() {
      console.log(this.region.x);
    },

  }
);

module.exports = RegionView;
