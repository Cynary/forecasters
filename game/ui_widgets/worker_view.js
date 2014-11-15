'use strict';

var Worker = require('../objects/worker.js');
var Views = require('./views');
var _ = require('underscore');

var WorkerView = Views.createViewType(
  function (game, worker) {
    Views.call(this, game, worker.x, worker.y);
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
  },

  {

    update: function() {
      //this.uiGroup.x = this.worker.x;
      //this.uiGroup.y = this.worker.y;
    },

    nextTurn: function() {
      //
    },

    onDragStart: function(sprite, pointer) {
      this.imgAnchor.alpha = 1.0;
      this.imgPerson.alpha = 0.5;
    },

    onDragStop: function(sprite, pointer) {
      this.imgAnchor.alpha = 0.0;
      this.imgPerson.alpha = 1.0;

      this.uiGroup.x += this.imgPerson.x;
      this.uiGroup.y += this.imgPerson.y;
      this.imgPerson.x = 0;
      this.imgPerson.y = 0;
    }
  }
);

module.exports = WorkerView;
