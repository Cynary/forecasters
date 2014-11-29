'use strict';

var Worker = require('../objects/worker.js');
var Views = require('./views');
var _ = require('underscore');

var WorkerView = Views.createViewType(
  function (worker) {
    Views.call(this, worker.global.game, worker.global.regions[worker.homeRegionIndex].x, worker.global.regions[worker.homeRegionIndex].y);
    this.worker = worker;

    this.personKey = 'person' + this.worker.homeRegionIndex;

    this.imgPerson = this.uiGroup.create(0, 0, this.personKey);
    this.imgPerson.anchor.setTo(0.5,1.0);
    this.imgPerson.inputEnabled = true;
    this.imgPerson.input.enableDrag(true);
    var scale = 50.0 / this.imgPerson.width;
    this.imgPerson.scale = { x: scale, y: scale };

    this.imgPerson.events.onDragStart.add(this.onDragStart, this);
    this.imgPerson.events.onDragStop.add(this.onDragStop, this);
    
    this.imgPerson.events.onInputUp.add(this.onClick, this);

    this.imgAnchor = this.uiGroup.create(0, 0, this.personKey);
    this.imgAnchor.alpha = 0.0;
    this.imgAnchor.anchor.setTo(0.5,1.0);
    this.imgAnchor.scale = { x: scale, y: scale };

    this.lifebar = this.uiGroup.create(-25,-100,'lifebar');

    this.createText('Status', -25, -100, 'status',
      { font: "16px Open Sans Condensed", fill: "#408c99", align: "center" });
    this.txtStatus.wordWrapWidth = 50;
    this.oldStatusText = "";
    
    this.createText('Name', -20, 0, this.worker.name,
      { font: "12px Open Sans Condensed", fill: "#408c99", align: "center" });
    this.moving = false;
    this.lastClick = 0;
    this.isSingleClick = {};
    this.double_click_delay = 500;
  },

  {

    update: function() {
      var worker = this.worker;
      var game = worker.global.game;

      if (worker.health <= 0) {
        // Remove the worker view
        this.imgPerson.visible = false;
        this.imgAnchor.visible = false;
        this.lifebar.visible = false;
        this.txtStatus.visible = false;
        this.txtName.visible = false;
        // So that it gets cleaned up from region & regionView
        worker.dead = true;
        return;
      }
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
          this.txtStatus.text = "Moving >>";
        } else if (worker.currentRegionIndex > worker.targetRegionIndex) {
          this.txtStatus.text = "<< Moving";
        } else if (worker.homeRegionIndex === worker.currentRegionIndex) {
          if (worker.building) {
            this.txtStatus.text = "Building";
          } else {
            this.txtStatus.text = "Gathering";
          }
        } else {
          this.txtStatus.text = "Evacuated";
        }
        this.txtStatus.x = -this.txtStatus.width * 0.5;
      }
      this.lifebar.scale.x = this.worker.health*0.01;
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
    
    onClick: function() {
      var lastClick = (new Date).getTime();
      if (lastClick - this.lastClick < this.double_click_delay) {
        // double click
        this.changeState();
        delete this.isSingleClick[this.lastClick];
        this.lastClick = 0;
      } else {
        // potential single click
        this.lastClick = lastClick;
        this.isSingleClick[lastClick] = true;
        setTimeout(function(){this.animatePath(lastClick);}.bind(this), this.double_click_delay + 10);
      }
    },

    animatePath: function(clickTime) {
      if (this.isSingleClick.hasOwnProperty(clickTime)) {
        // This means the last click wasn't followed by another click,
        // therefore double-click didn't happen, and we can start animating path.
        delete this.isSingleClick[clickTime];
      }
    },

    changeState: function(){
      if (this.worker.building == true){
        this.worker.building = false;
      }else if (this.worker.homeRegionIndex === this.worker.currentRegionIndex){
        this.worker.building = true;
      }
    },

    closestRegion: function() {
      var x = this.uiGroup.x + this.imgPerson.x;
      var y = this.uiGroup.y + this.imgPerson.y;
      return _.min(this.worker.global.regions, function(region) {
        return (x-region.x)*(x-region.x);
      });
    }
  }
);

module.exports = WorkerView;
