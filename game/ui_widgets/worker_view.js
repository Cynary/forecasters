'use strict';

var Worker = require('../objects/worker.js');

function WorkerView(game, worker, x, y, index) {
  this.game = game;
  this.worker = worker;
  this.index = index;

  this.x = x || 0;
  this.y = y || 0;

  var uiGroup = game.add.group();
  this.uiGroup = uiGroup;
  this.uiGroup.x = this.x;
  this.uiGroup.y = this.y;

  var person = game.add.sprite(0, 0, 'person');
  person.anchor.setTo(0.5,0);
  this.uiGroup.add(person);
  if (index == 0) {
    var coord = [-45,45, -40,2, -30,-40];
  } else if (index == 1) {
    var coord = [-37,-20, 37,-20, 0,-50];
  } else {
    var coord = [45,45, 40,2, 30,-40];
  }
  this.createButton('Supplies', coord[0], coord[1], 'supplies', this.suppliesOnClick, [2,2,2], {x:0.5, y:0});
  this.createButton('Fortify', coord[2], coord[3], 'fortify', this.fortifyOnClick, [1,0,2], {x:0.5, y:0});
  this.createButton('Evac', coord[4], coord[5], 'evac', this.evacOnClick, [1,0,2], {x:0.5, y:0});

  this.lastWorkedState = worker.currentState.constructor;
}

WorkerView.prototype = {

update: function() {

},

nextTurn: function() {
  var cs = this.worker.currentState;
  if (this.index == 1) {
    var y = 0;
  } else {
    var y = 10;
  }
  var txt = this.game.add.text(0,y, cs.getStatusText(), { font: '16px Open Sans Condensed', fill: '#ffffff', align: 'center'});
  txt.anchor.setTo(0.5, 0.5);
  this.uiGroup.add(txt);
  this.game.add.tween(txt).to({y: -30}, 2500, Phaser.Easing.Linear.None, true);
  this.game.add.tween(txt).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true);
},

createButton: function(name, x, y, key, callback, frames, anchor) {
  var btn = this.game.add.button(x, y, key, callback, this, frames[0], frames[1], frames[2]);
  btn.anchor = anchor;
  this['btn' + name] = btn;
  this.uiGroup.add(btn);
},

createText: function(name, x, y, text, style) {
  var txt = this.game.add.text(x, y, text, style);
  this['txt' + name] = txt;
  this.uiGroup.add(txt);
},

suppliesOnClick: function() {
  this.btnFortify.setFrames(1,0,2);
  this.btnSupplies.setFrames(2,2,2);
  this.btnEvac.setFrames(1,0,2);
  var cs = this.worker.currentState;
  if (cs instanceof Worker.EvacState || cs instanceof Worker.EvacReturnState) {
    this.worker.requestState(this.lastWorkedState);
  } else if (this.lastWorkedState == Worker.BuildState) {
    this.worker.requestState(Worker.GatherState);
    this.lastWorkedState = Worker.GatherState;
  }
},

fortifyOnClick: function() {
  this.btnFortify.setFrames(2,2,2);
  this.btnSupplies.setFrames(1,0,2);
  this.btnEvac.setFrames(1,0,2);
  var cs = this.worker.currentState;
  if (cs instanceof Worker.EvacState || cs instanceof Worker.EvacReturnState) {
    this.worker.requestState(this.lastWorkedState);
  } else if (this.lastWorkedState == Worker.GatherState) {
    this.worker.requestState(Worker.BuildState);
    this.lastWorkedState = Worker.BuildState;
  }
},

evacOnClick: function() {
  this.btnFortify.setFrames(1,0,2);
  this.btnSupplies.setFrames(1,0,2);
  this.btnEvac.setFrames(2,2,2);
  var cs = this.worker.currentState;
  if (!(cs instanceof Worker.EvacState)) {
    this.worker.requestState(Worker.EvacState);
  }
},

};

module.exports = WorkerView;
