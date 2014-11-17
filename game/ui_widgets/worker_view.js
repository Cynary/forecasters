'use strict';

var Worker = require('../objects/worker.js');
var Views = require('./views');
var _ = require('underscore');

var WorkerView = Views.createViewType(
  function (worker) {
    Views.call(this, worker.global.game, worker.global.regions[worker.homeRegionIndex].x, worker.global.regions[worker.homeRegionIndex].y);
    this.worker = worker;

    this.imgPerson = this.uiGroup.create(0, 0, 'person');
    this.imgPerson.anchor.setTo(0.5,1.0);
    this.imgPerson.inputEnabled = true;
    this.imgPerson.input.enableDrag(true);

    this.imgPerson.events.onDragStart.add(this.onDragStart, this);
    this.imgPerson.events.onDragStop.add(this.onDragStop, this);

    this.imgAnchor = this.uiGroup.create(0, 0, 'person');
    this.imgAnchor.alpha = 0.0;
    this.imgAnchor.anchor.setTo(0.5,1.0);

    this.createText('Status', -25, -100, 'status',
      { font: "12px Open Sans Condensed", fill: "#ffffff", align: "center" });
    this.txtStatus.wordWrapWidth = 50;
    this.oldStatusText = "";

    this.moving = false;
  },

  {

    update: function() {
      var worker = this.worker;
      var game = worker.global.game;

      // Check whether or not the worker should move
      var currentRegion = worker.global.regions[worker.currentRegionIndex];
      var crWorkers = currentRegion.workers;

      var nextX = worker.global.regions[worker.currentRegionIndex].x;
      var nextY = worker.global.regions[worker.currentRegionIndex].y;

      var offset = _.indexOf(crWorkers, worker) - (crWorkers.length - 1) * 0.5;
      nextX += offset * 52;

      if (!this.moving) {
        if (nextX != this.uiGroup.x || nextY != this.uiGroup.y) {
          var time = Math.hypot(this.uiGroup.x-nextX,this.uiGroup.y-nextY) * 5;
          var tween = game.add.tween(this.uiGroup).to({ x: nextX, y: nextY }, time, Phaser.Easing.Quadratic.InOut);
          tween.onComplete.add(this.onMoveComplete, this);
          tween.start();
          this.moving = true;
        }
      }

      // Update the worker's status text
      if (!this.moving) {
        if (worker.currentRegionIndex < worker.targetRegionIndex) {
          this.txtStatus.text = ">>>";
        } else if (worker.currentRegionIndex > worker.targetRegionIndex) {
          this.txtStatus.text = "<<<";
        } else if (worker.homeRegionIndex === worker.currentRegionIndex) {
          if (worker.building) {
            this.txtStatus.text = "Building";
          } else {
            this.txtStatus.text = "Gathering";
          }
        } else {
          this.txtStatus.text = "Evacuated";
        }
      }
    },

    onDragStart: function(sprite, pointer) {
      this.imgAnchor.alpha = 1.0;
      this.imgPerson.alpha = 0.5;
    },

    onDragStop: function(sprite, pointer) {
      this.imgAnchor.alpha = 0.0;
      this.imgPerson.alpha = 1.0;
      this.worker.targetRegionIndex = this.closestRegion().regionIndex;
      this.imgPerson.x = 0;
      this.imgPerson.y = 0;
    },

    onMoveComplete: function() {
      this.moving = false;
    },

    closestRegion: function() {
      var x = this.uiGroup.x + this.imgPerson.x;
      var y = this.uiGroup.y + this.imgPerson.y;
      return _.min(this.worker.global.regions, function(region) {
        return (x-region.x)*(x-region.x) + (y-region.y)*(y-region.y);
      });
    }
  }
);

module.exports = WorkerView;
