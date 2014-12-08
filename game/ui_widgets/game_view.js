'use strict';

var Views = require('./views');
var ForecastView = require('./forecast_view');
var _ = require('underscore');

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
    btn.input.useHandCursor = true;

    this.uiGroup.add(btn);

    var soundTex = this.global.game.sound.mute ? 'sound_off' : 'sound_on';
    this.btnSound = this.global.game.add.button(796, 150, soundTex, this.soundOnClick, this);
    this.btnSound.input.useHandCursor = true;
    this.btnSound.anchor = {x: 1.0, y: 1.0}
    this.btnSound.scale.setTo(0.5, 0.5);
    this.uiGroup.add(this.btnSound);

    this.helpButton = this.global.game.add.button(796, 100, 'help', this.helpOnClick,this);
    this.helpButton.input.useHandCursor = true;
    this.helpButton.anchor = {x:1.0, y:1.0};
    this.helpButton.scale.setTo(0.8, 0.8);
    this.uiGroup.add(this.helpButton)
    this.helpOpen = false;

    this.game.input.onDown.add(this.onMouseClick, this);

    // Created by useiconic.com
    // from the Noun Project
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
        if(this.global.weather.waterLevels[1].mean >= 50){
          this.game.sound.play('largeWave');
        }
        else{
          this.game.sound.play('smallWave');
        }
        this.nextTurnReady = false;
        this.nextDayAnimation(); // This MUST happen before global.nextDay()
        this.global.nextDay();
        this.global.game.time.events.add(600, function() { this.nextTurnReady = true; }, this);
      }
    },

    soundOnClick: function() {
      if (this.global.game.sound.mute) {
        this.global.game.sound.mute = false;
        this.btnSound.loadTexture('sound_on');
      } else {
        this.global.game.sound.mute = true;
        this.btnSound.loadTexture('sound_off');
      }
    },

    helpOnClick: function(){
    this.helpOpen = true;
    this.instr = this.game.add.sprite(0, 0, 'instructionbg', 0);
    $('canvas').css('cursor', 'pointer')

    },

    onMouseClick: function(){
      if(this.helpOpen){
        this.instr.destroy();
        this.helpOpen = false;
      $('canvas').css('cursor', '')

      }
    }, 

    nextDayAnimation: function() {
      for(var regionIndex in this.global.regions) {
        var region = this.global.regions[regionIndex];
        var crWorkers = region.workers;
        var candiesLeft = this.global.supply;
        for (var workerIndex in region.workers) {
          var worker = region.workers[workerIndex];
          var offset = _.indexOf(crWorkers, worker) - (crWorkers.length - 1) * 0.5;
          if (worker.building && worker.homeRegionIndex == worker.currentRegionIndex) {
            continue; // Candy isn't used or produced if the worker is building
          }
          var point1 = {x:region.x + offset*52, y:region.y-15};
          var point2 = {x: 150, y: 485};
          if (worker.homeRegionIndex != worker.currentRegionIndex) {
            // If worker isn't at home (s)he is consuming a candy
            var temp = point1;
            point1 = point2;
            point2 = temp;
            if (candiesLeft <= 0) {
              continue;
            } else {
              candiesLeft -= 1;
            }
          } else {
            candiesLeft += 1;
          }
          var sprite = this.game.add.sprite(point1.x, point1.y, 'candy');
          sprite.anchor.set(0.5,0.5);
          sprite.scale.set(0.5,0.5);
          var tween = this.global.game.add.tween(sprite).to(point2, 600, Phaser.Easing.Linear.InOut);
          tween.onComplete.add(function(){this.visible=false;}, sprite);
          tween.start();
        }
      }
    },


  }

);

module.exports = GameView;
