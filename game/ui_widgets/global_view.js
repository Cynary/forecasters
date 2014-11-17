'use strict';

var Views = require('./views');
var RegionView = require('./region_view');
var TurnView = require('./turn_view');
var WaveView = require('./wave_view');

var GlobalView = Views.createViewType(
  function (global) {
    Views.call(this, global.game, 0, 0);
    this.global = global;

    // Create region views. They will take care of creating WorkerViews recursively
    this.regionViews = [];
    for(var index in this.global.regions) {
      this.regionViews.push(new RegionView(this.global.regions[index]));
    }
    // Create TurnView. this.global contains all necessary information
    this.turnView = new TurnView(this.global, this.global.game.width/2, 500);

    this.waveView = new WaveView(this.global.weather);

    this.createText("Victory", this.game.width/2, 5, 'Victory progress 0%', { font: "32px Open Sans Condensed", fill: "#408c99", align: "center" });
    this.txtVictory.anchor = {x:0.5, y:0};
  },

  {

    update: function() {
      this.txtVictory.text = 'Victory progress ' + Math.floor(this.global.buildProgress*10)/10 + '%';
      // If any worker is in wrong region (maybe (s)he moved) then move the worker
      // and workerView in the correct region before the real update happens
      for (var regionViewIndex in this.regionViews) {
        var regionView = this.regionViews[regionViewIndex];
        var workerViews = regionView.workerViews;
        for (var workerViewIndex in workerViews) {
          var workerView = workerViews[workerViewIndex];
          if (workerView.worker.currentRegionIndex != regionViewIndex) {
            // Remove from the old region
            regionView.workerViews.splice(workerViewIndex, 1);
            regionView.region.workers.splice(regionView.region.workers.indexOf(workerView.worker), 1);
            // Add to the new region
            this.regionViews[workerView.worker.currentRegionIndex].workerViews.push(workerView);
            this.global.regions[workerView.worker.currentRegionIndex].workers.push(workerView.worker);
          }
        }
      }
      for (var regionViewIndex in this.regionViews) {
        this.regionViews[regionViewIndex].update();
      }
      this.waveView.update();
    },

  }
);

module.exports = GlobalView;
