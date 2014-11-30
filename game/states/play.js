'use strict';

var Global = require('../objects/global');
var GlobalView = require('../ui_widgets/global_view');
var TransitionUtils = require('./widgets/transition_utils');

function Play() {}

Play.prototype = {

create: function() {
  this.global = new Global(this.game, 7, [35,110,85,45,70], 1);
  this.globalView = new GlobalView(this.global);

  TransitionUtils.fadeIn(this);
},

update: function() {
  this.globalView.update();
},

};

module.exports = Play;
