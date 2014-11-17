'use strict';

var Views = require('./views');
var WorkerView = require('./worker_view');

var RegionView = Views.createViewType(
  function (region) {
    Views.call(this, region.global.game, region.x, region.y);
    this.region = region;

    this.imgCity = this.uiGroup.create(0, 0, 'region');
    this.imgCity.anchor.setTo(0.5, 1.0);

    this.workerViews = [];
    for(var index in this.region.workers) {
      this.workerViews[index] = new WorkerView(this.region.workers[index]);
    }
  },

  {
    update: function() {
      for(var index in this.region.workers) {
        this.workerViews[index].update();
      }
    },
  }
);

module.exports = RegionView;
