'use strict';

var Worker = require('../objects/worker.js');

function WorkerView(game, worker, x, y) {
  this.game = game;
  this.worker = worker;

  this.x = x || 0;
  this.y = y || 0;

  var uiGroup = game.add.group();
  this.uiGroup = uiGroup;
  this.uiGroup.x = this.x;
  this.uiGroup.y = this.y;

  this.createButton('Action', 0, 0, 'supplies', this.actionOnClick);
  this.createButton('Evac', 40, 0, 'evac', this.evacOnClick);

  this.createText('Status', 0, 40, 'supplies', { font: "12px Arial", fill: "#000000" });

  this.lastWorkedState = worker.currentState.constructor;
}

WorkerView.prototype = {

update: function() {
  var cs = this.worker.currentState;
  this.txtStatus.text = cs.getStatusText();
},

createButton: function(name, x, y, key, callback) {
  var btn = this.game.add.button(x, y, key, callback, this);
  this['btn' + name] = btn;
  btn.scale.setTo(0.05,0.05);
  this.uiGroup.add(btn);
},

createText: function(name, x, y, text, style) {
  var txt = this.game.add.text(x, y, text, style);
  this['txt' + name] = txt;
  this.uiGroup.add(txt);
},

actionOnClick: function() {
  var cs = this.worker.currentState;
  if (cs instanceof Worker.EvacState || cs instanceof Worker.EvacReturnState) {
    cs.requestState(this.lastWorkedState);
  } else {
    if (this.lastWorkedState == Worker.BuildState) {
      cs.requestState(Worker.GatherState);
      this.lastWorkedState = Worker.GatherState;
      // TODO: Replace loadTexture by having all the buttons on a single spritesheet
      this.btnAction.loadTexture('supplies');
    } else {
      cs.requestState(Worker.BuildState);
      this.lastWorkedState = Worker.BuildState;
      this.btnAction.loadTexture('fortify');
    }
  }
},

evacOnClick: function() {
  var cs = this.worker.currentState;
  if (!(cs instanceof Worker.EvacState)) {
    cs.requestState(Worker.EvacState);
  }
},

};

module.exports = WorkerView;
