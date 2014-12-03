'use strict';

var Global = require('../objects/global');
var GlobalView = require('../ui_widgets/global_view');
var Decorators = require('./widgets/decorators');

function Play() {}

Play.prototype = {

create: function() {
  this.global = new Global(this.game, 7, [35, 101, 85, 45, 70], 1);

  this.globalView = new GlobalView(this.global, this);

  Decorators.fadeIn(this);
},

update: function() {
  this.globalView.update();
},

};

module.exports = Play;
