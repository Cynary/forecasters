'use strict';

var Worker = require('../objects/worker.js');
var Views = require('./views');
var _ = require('underscore');

var WorkerView = Views.createViewType(
  function (game, worker, playState) {
    Views.call(this, game, worker.currentRegion.x, worker.currentRegion.y);
    this.worker = worker;
    this.playState = playState;

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
  },

  {

    update: function() {
      var cs = this.worker.currentState;
      if (this.oldStatusText != cs.getStatusText()) {
        this.oldStatusText = cs.getStatusText();
        this.txtStatus.text = this.oldStatusText;
      }
      // Do some sort of region testing here
    },

    nextTurn: function() {
      var worker = this.worker;
      var currentRegion = worker.currentRegion;
      var crWorkers = currentRegion.workers;

      var nextX = currentRegion.x;
      var nextY = currentRegion.y;

      var offset = _.indexOf(crWorkers, worker) - (crWorkers.length - 1) * 0.5;
      nextX += offset * 52;

      this.uiGroup.x = nextX;
      this.uiGroup.y = nextY;
    },

    onDragStart: function(sprite, pointer) {
      this.imgAnchor.alpha = 1.0;
      this.imgPerson.alpha = 0.5;
    },

    onDragStop: function(sprite, pointer) {
      this.imgAnchor.alpha = 0.0;
      this.imgPerson.alpha = 1.0;


      //this.uiGroup.x += this.imgPerson.x;
      //this.uiGroup.y += this.imgPerson.y;
      
      this.worker.requestMove(this.closestRegion());

      this.imgPerson.x = 0;
      this.imgPerson.y = 0;
    },

    closestRegion: function() {
      var x = this.uiGroup.x + this.imgPerson.x;
      var y = this.uiGroup.y + this.imgPerson.y;
      return _.min(this.playState.regions, function(region) {
        return (x-region.x)*(x-region.x) + (y-region.y)*(y-region.y);
      });
    }
  }
);

module.exports = WorkerView;
