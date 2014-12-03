'use strict';

var Views = require('./views');
var ForecastView = require('./forecast_view');

var GameView = Views.createViewType(


  function (global, x, y) {
    Views.call(this, global.game, x, y);
    this.global = global;

    this.uiGroup.create(0, -44, 'bottombg');


    this.nextTurnReady = true;

    var style = { font: "32px Architects Daughter", fill: "#ffffff", align: "center" };

    this.createText("Victory", 650, 90, '0%', style);
    this.createText("Supplies", 150, 90, '0', style);

    this.forecastView = new ForecastView(this.global.weather, 400-112, 18);
    this.uiGroup.add(this.forecastView.uiGroup);

    var btn = this.global.game.add.button(global.game.width/2, 106, 'next_turn', this.nextTurnOnClick, this, 0, 1);
    btn.anchor = {x:0.5, y:0.0};
    this.uiGroup.add(btn);
  },

  {

    update: function() {
      this.txtVictory.text = '' + Math.floor(this.global.buildProgress*10)/10 + '%';
      this.txtVictory.x = 650 - this.txtVictory.width/2;
      this.txtSupplies.text = '' + this.global.supply;
      this.txtSupplies.x = 150 - this.txtSupplies.width/2;

      this.forecastView.update();
    },

    nextTurnOnClick: function() {
      if (this.nextTurnReady) {
        this.game.sound.play('click');
        this.nextTurnReady = false;
        this.global.nextDay();
        this.global.game.time.events.add(600, function() { this.nextTurnReady = true; }, this);
      }
    }

  }

);

module.exports = GameView;
