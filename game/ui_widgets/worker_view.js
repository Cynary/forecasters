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
    this.imgPerson.input.useHandCursor = true;
    this.imgPerson.input.enableDrag(true);
    var scale = Math.pow(50.0*50.0*50.0 / (this.imgPerson.width * this.imgPerson.width * this.imgPerson.height), 1/3.0);
    this.imgPerson.scale = { x: scale, y: scale };

    this.imgPerson.events.onDragStart.add(this.onDragStart, this);
    this.imgPerson.events.onDragStop.add(this.onDragStop, this);
    
    this.imgPerson.events.onInputUp.add(this.onClick, this);
    this.imgPerson.events.onInputOver.add(this.onMouseOver, this);

    this.imgAnchor = this.uiGroup.create(0, 0, this.personKey);
    this.imgAnchor.alpha = 0.0;
    this.imgAnchor.anchor.setTo(0.5,1.0);
    this.imgAnchor.scale = { x: scale, y: scale };

    this.imgStatus = this.uiGroup.create(0, -this.imgPerson.height, 'statusIcons', 2);
    this.imgStatus.anchor.setTo(0.5, 1.0);
    this.imgStatus.scale = { x: 0.3, y: 0.3 };

    this.lifebar = this.uiGroup.create(-25,0,'lifebar');

    this.moving = false;
    this.pointsNum = 10; // Amount of path points between two regions
    this.pointAnimationTimeMsecs = 30; // Animation time of a single point, in milli seconds
    this.pointsVisible = 20; // Maximum amount of points visible together at each point of path animation
  },

  {

    update: function() {
      var worker = this.worker;
      var game = worker.global.game;

      if (worker.health <= 0 && this.moving == false) {
        worker.health = 0
        this.moving = true
        this.imgStatus.frame = 4
        var time = (game.height - this.uiGroup.y);
        var tween = game.add.tween(this.uiGroup).to({ x: this.uiGroup.x, y: game.height-50 }, time, Phaser.Easing.Linear.InOut);
        tween.onComplete.add(this.onDeathComplete, this);
        tween.start();
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
          this.imgStatus.frame = 6;
        } else if (worker.currentRegionIndex > worker.targetRegionIndex) {
          this.imgStatus.frame = 8;
        } else if (worker.homeRegionIndex === worker.currentRegionIndex) {
          if (worker.building) {
            this.imgStatus.frame = 0;
          } else {
            this.imgStatus.frame = 2;
          }
        } else {
          this.imgStatus.frame = 4;
        }
      }
      this.lifebar.scale.x = this.worker.health*0.01;
    },

    onDragStart: function(sprite, pointer) {
      this.game.sound.play('click');
      this.imgAnchor.alpha = 1.0;
      this.imgPerson.alpha = 0.5;
    },
    
    onDeathComplete: function(){
        // Remove the worker view
        this.imgPerson.visible = false;
        this.imgAnchor.visible = false;
        this.lifebar.visible = false;
        this.imgStatus.visible = false;
        this.moving = false;
        // So that it gets cleaned up from region & regionView
        this.worker.dead = true;
        this.worker.global.dmgCause = this.worker.dmgCause;
        return;
    },

    onDragStop: function(sprite, pointer) {
      this.imgAnchor.alpha = 0.0;
      this.imgPerson.alpha = 1.0;
      var closestRegionIndex = this.closestRegion().regionIndex;
      this.game.sound.play('click');
      this.worker.targetRegionIndex = closestRegionIndex;
      if (closestRegionIndex != this.worker.currentRegionIndex) {
        this.animatePath();
      }
      this.imgPerson.x = 0;
      this.imgPerson.y = 0;
    },

    onMoveComplete: function() {
      this.moving = false;
    },
    
    onMouseOver: function() {
      this.animatePath();
    },

    onClick: function() {
      this.changeState();
    },

    animatePath: function() {
      var sign = Math.sign(this.worker.targetRegionIndex-this.worker.currentRegionIndex);
      var pointCounter = 0;
      for (var regionIndex = this.worker.currentRegionIndex; regionIndex != this.worker.targetRegionIndex; regionIndex += sign) {
        var region1 = this.worker.global.regions[regionIndex];
        var region2 = this.worker.global.regions[regionIndex + sign];
        for (var point = 0; point < this.pointsNum; point++) {
          var ratioX = point/this.pointsNum;
          var ratioY = 0.5*(1-Math.cos(ratioX * Math.PI)); // cos function will make curvy path
          setTimeout(function(x, y){
              var pointView = this.worker.global.game.add.sprite(x, y, "point");
              pointView.scale = {x: 0.2, y:0.2};
              pointView.anchor.setTo(0.5, 0.5);
              pointView.alpha = 0;
              var tween1 = this.worker.global.game.add.tween(pointView).to({alpha: 1}, this.pointAnimationTimeMsecs*this.pointsVisible/2);
              tween1.onComplete.add(function() {
                  var tween2 = this.worker.global.game.add.tween(pointView).to({alpha: 0}, this.pointAnimationTimeMsecs*this.pointsVisible/2);
                  tween2.onComplete.add(function(){pointView.destroy();}, this);
                  tween2.start();
                }, this);
              tween1.start();
            }.bind(this),
            pointCounter * this.pointAnimationTimeMsecs,
            (1-ratioX)*region1.x + ratioX*region2.x,
            (1-ratioY)*region1.y + ratioY*region2.y);
          pointCounter++;
        }
      }
    },

    changeState: function(){
      // If the worker is in a different region, then just show where it is going
      if (this.worker.currentRegionIndex != this.worker.homeRegionIndex) {
        this.animatePath();
      } else {
        // Otherwise, change the state between gathering <-> building
        this.worker.targetRegionIndex = this.worker.currentRegionIndex;
        if (this.worker.building == true){
          this.worker.building = false;
        }else if (this.worker.homeRegionIndex === this.worker.currentRegionIndex){
          this.worker.building = true;
        }
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
