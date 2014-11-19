'use strict';

var Views = require('./views');
var RegionView = require('./region_view');
var TurnView = require('./turn_view');
var WaveView = require('./wave_view');
var ForecastView = require('./forecast_view');
var WorkerView = require('./worker_view');

var GlobalView = Views.createViewType(
  function (global) {
    Views.call(this, global.game, 0, 0);
    this.global = global;

    // Create region views. They will take care of creating WorkerViews recursively
    this.regionViews = [];
    for(var index in this.global.regions) {
      this.regionViews.push(new RegionView(this.global.regions[index]));
    }
    for(var index in this.regionViews) {
      for(var i in this.regionViews[index].region.workers) {
        this.regionViews[index].workerViews[i] = new WorkerView(this.regionViews[index].region.workers[i]);
      }
    }
    
    
    // Create TurnView. this.global contains all necessary information
    this.turnView = new TurnView(this.global, this.global.game.width/2, 500);

    this.waveView = new WaveView(this.global.weather);

    this.forecastView = new ForecastView(this.global.weather, 550, 50);

    this.createText("Victory", this.game.width/2, 5, 'Victory progress 0%', { font: "32px Open Sans Condensed", fill: "#408c99", align: "center" });
    this.txtVictory.anchor = {x:0.5, y:0};

    this.createText("Supplies", this.game.width/2, 35, 'Supplies: 0', { font: "32px Open Sans Condensed", fill: "#408c99", align: "center" })
  },

  {

    update: function() {
      this.txtVictory.text = 'Victory progress ' + Math.floor(this.global.buildProgress*10)/10 + '%';
      this.txtSupplies.text = 'Supplies: ' + this.global.supply;
      var numWorkersAlive = 0;
      // If any worker is in wrong region (maybe (s)he moved) then move the worker
      // and workerView in the correct region before the real update happens
      for (var regionViewIndex in this.regionViews) {
        var regionView = this.regionViews[regionViewIndex];
        var workerViews = regionView.workerViews;
        for (var workerViewIndex in workerViews) {
          var workerView = workerViews[workerViewIndex];
          numWorkersAlive++;
          if (workerView.worker.dead) {
            // Remove worker from the region
            regionView.workerViews.splice(workerViewIndex, 1);
            regionView.region.workers.splice(regionView.region.workers.indexOf(workerView.worker), 1);
            numWorkersAlive--;
          } else if (workerView.worker.currentRegionIndex != regionViewIndex) {
            // Remove from the old region
            regionView.workerViews.splice(workerViewIndex, 1);
            regionView.region.workers.splice(regionView.region.workers.indexOf(workerView.worker), 1);
            // Add to the new region
            this.regionViews[workerView.worker.currentRegionIndex].workerViews.push(workerView);
            this.global.regions[workerView.worker.currentRegionIndex].workers.push(workerView.worker);
          }
        }
      }
      if (numWorkersAlive == 0) {
        this.global.game.won = false;
        this.game.state.start('gameover');
      }
      for (var regionViewIndex in this.regionViews) {
        this.regionViews[regionViewIndex].update();
      }
      this.waveView.update();
      this.forecastView.update();
    },

  }
);

module.exports = GlobalView;
