'use strict';

var Views = require('./views');
var ForecastView = require('./forecast_view');

var GameView = Views.createViewType(


  function (global, x, y) {
    Views.call(this, global.game, x, y);
    this.global = global;

    var btn = this.global.game.add.button(global.game.width/2, 15, 'next_turn', this.nextTurnOnClick, this, 2, 1, 0);
    btn.anchor = {x:0.5, y:0.0};
    this.uiGroup.add(btn);

    this.nextTurnReady = true;

    var style = { font: "32px Architects Daughter", fill: "#408c99", align: "center" };

    this.createText("Victory", 20, 20, 'Victory progress 0%', style);
    this.createText("Supplies", 20, 60, 'Supplies: 0', style);

    this.forecastView = new ForecastView(this.global.weather, 590, 450);
  },

  {

    update: function() {
      this.txtVictory.text = 'Victory progress ' + Math.floor(this.global.buildProgress*10)/10 + '%';
      this.txtSupplies.text = 'Supplies: ' + this.global.supply;

      this.forecastView.update();
    },

    nextTurnOnClick: function() {
      if (this.nextTurnReady) {
        this.nextTurnReady = false;
        this.global.nextDay();
        this.global.game.time.events.add(600, function() { this.nextTurnReady = true; }, this);
      }
    }

  }

);

module.exports = GameView;
