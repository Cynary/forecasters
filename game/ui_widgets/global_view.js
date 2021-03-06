'use strict';

var Views = require('./views');
var RegionView = require('./region_view');
var WaveView = require('./wave_view');
var MegaView = require('./mega_view');
var WorkerView = require('./worker_view');
var GameView = require('./game_view');
var Decorators = require('../states/widgets/decorators');
var TooltipView = require('./tooltip_view');

var GlobalView = Views.createViewType(
  function (global, playState) {
    Views.call(this, global.game, 0, 0);
    this.global = global;

    this.playState = playState;

    this.background = this.uiGroup.create(0, 0, 'background', 0);
    this.background.scale = { x: 0.5, y: 0.5 };

    this.megaView = new MegaView(this.global, 480, 170);

    // Create region views. They will take care of creating WorkerViews recursively
    this.regionViews = [];
    for(var index in this.global.regions) {
      this.regionViews.push(new RegionView(this.global.regions[index]));
    }
    this.workerViews = [];
    for(var index in this.regionViews) {
      for(var i in this.regionViews[index].region.workers) {
        this.workerViews.push(new WorkerView(this.regionViews[index].region.workers[i]));
      }
    }

    this.waveView = new WaveView(this.global.weather);

    this.gameView = new GameView(this.global, 0, 450);
    //this.tooltip1 = new TooltipView(this.global, 515, 20, ['Click your toys \n to change their status.','Drag and drop toys \n to keep them away \n from the waves', 'Reference the forecast \n to prepare in advance', "You'll lost the game \n if you lose more than \n 2 workers.", 'Build the megacastle \n to win the game.'], 1)
  },

  {

    update: function() {
      var numWorkersAlive = 0;
      // If any worker is in wrong region (maybe (s)he moved) then move the worker
      // and workerView in the correct region before the real update happens

      for (var w = 0; w < this.workerViews.length; ++w) {
        var workerView = this.workerViews[w];
        var worker = workerView.worker;
        var regionView = this.regionViews[worker.currentRegionIndex];
        var region = regionView.region;
        numWorkersAlive++;

        if (workerView.worker.dead) {
          region.workers.splice(region.workers.indexOf(worker), 1);
          this.workerViews.splice(w, 1);
          numWorkersAlive--;
          w -= 1;
        }
      }

      if (numWorkersAlive <= 3) {
        Decorators.fadeOut(this.playState, 'gameover', false, this.global.buildProgress, this.global.dmgCause);
      } else if (this.global.buildProgress >= 100) {
        Decorators.fadeOut(this.playState, 'gameover', true, this.global.turn);
      }

      for (var regionViewIndex in this.regionViews) {
        this.regionViews[regionViewIndex].update();
      }
      for (var workerViewIndex in this.workerViews) {
        this.workerViews[workerViewIndex].update();
      }

      this.waveView.update();
      this.megaView.update();
      this.gameView.update();
      //this.tooltip1.update(this.global.turn);
    },

  }
);

module.exports = GlobalView;
