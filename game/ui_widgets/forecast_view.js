'use strict';

var Views = require('./views');
var _ = require('underscore');

var ForecastView = Views.createViewType(
  function (weather, x, y) {
    Views.call(this, weather.global.game, x, y);
    this.weather = weather;

    var game = weather.global.game;

    // Note: updating every frame has performance issues, so this makes it less slow.
    this.needsUpdate = true;
    this.isUpdating = false;
    this.waterLevels = this.weather.getForecast();
    this.lastSelectedRegionIndex = -1;
    
    // This counts how many tweens have been dispatched
    this.numTweens = 0;

    // Graphics object for the bars on the bar graph
    this.barG = game.add.graphics(0,0);
    this.uiGroup.add(this.barG);

    // Graphics object for the rest of the bar graph
    this.graphG = game.add.graphics(0,0);
    this.uiGroup.add(this.graphG);

    // Graphics object that masks the bar graph
    this.maskG = game.add.graphics(25, 0);
    this.uiGroup.add(this.maskG);
    this.maskG.beginFill();
    this.maskG.drawRect(0, 0, 25*this.waterLevels.length, 100);
    this.maskG.endFill();

    this.barG.mask = this.maskG;

    var textStyle = { font: "24px Architects Daughter", fill: "#408c99", align: "center" };
    var regionHeightStyle = { font: "12px Architects Daughter", fill: "#FF0000", align: "center" };
    // Graphics object for the water level prediction
    this.lineG = game.add.graphics(0,0);
    this.txtMax = game.add.text(25, 0, "predicted high", textStyle);
    this.txtMax.visible = false;
    this.txtMin = game.add.text(25, 0, "predicted low", textStyle);
    this.txtMin.visible = false;
    this.createText("RegionHeight", 25, 0, "Castle Height", regionHeightStyle);
    this.txtRegionHeight.visible = false;
  },

  {
    update: function() {
      var game = this.weather.global.game;
      var waterLevels = this.weather.getForecast();
      
      var bg = this.barG;
      var gg = this.graphG;

      // Check if water levels have been updated
      if (!this.isUpdating) {
        for (var i in waterLevels) {
          if (Math.abs(this.waterLevels[i].mean - waterLevels[i].mean) > 0.001) {
            this.needsUpdate = true;
          }
        }
      }
      
      // If an update is needed, set all the tweens and get the graphics object ready to be redrawn
      if (this.needsUpdate) {
        bg.clear();

        // Draw all the old bars shifted over and set up the tweens
        for (var i in this.waterLevels) {
          // Old uncertainty bar
          this.drawBar(bg, i-1, this.waterLevels[i]);
        }

        // Draw the newest bar
        this.drawBar(bg, waterLevels.length-1, waterLevels[this.waterLevels.length-1]);

        // Shift uncertainties over by one
        this.waterLevels.splice(0, 1);
        this.waterLevels.push(waterLevels[waterLevels.length-1]);

        // Tween the water levels. Note the newest bar doesn't need to be tweened
        for (var i = 0; i < waterLevels.length-1; ++i) {
          var tween = game.add.tween(this.waterLevels[i]).to(_.clone(waterLevels[i]), 500);
          tween.onStart.add(this.onUpdateStart, this);
          tween.onComplete.add(this.onUpdateComplete, this);
          tween.start();
        }

        // Reset the position of the graphics object
        bg.x = 25;

        // Movement tween
        var btween = game.add.tween(bg).to({ x: 0 }, 500);
        btween.onStart.add(this.onUpdateStart, this);
        btween.onComplete.add(this.onUpdateComplete, this);
        btween.start();

        this.needsUpdate = false;
        this.isUpdating = true;
      }

      if (this.isUpdating) {
        for (var i in this.waterLevels) {
          this.drawBar(bg, i, this.waterLevels[i]);
        }
      }

      var mx = game.input.mousePointer.x;
      var my = game.input.mousePointer.y;

      // Check if city selection has changed and draw forecast line
      var selectedRegion = _.min(this.weather.global.regions, function(region) {
        return (mx-region.x)*(mx-region.x);
      });

      if (Math.abs(my-selectedRegion.y+50) > 100) {
        selectedRegion = null;
      }

      if (selectedRegion == null) {
        this.txtRegionHeight.visible=false;
        this.lastSelectedRegionIndex = -1;

        gg.clear();

      } else if (selectedRegion.regionIndex != this.lastSelectedRegionIndex) {
        this.lastSelectedRegionIndex = selectedRegion.regionIndex;

        gg.clear();

        // Draw the flooding line
        gg.lineStyle(1, 0xff0000, 1);
        gg.moveTo(25, 100-selectedRegion.height);
        gg.lineTo(this.waterLevels.length*25+25, 100-selectedRegion.height);
        this.txtRegionHeight.y = 80-selectedRegion.height;
        this.txtRegionHeight.visible=true;


      }

      var lg = this.lineG;

      // Draw forecast line on screen if hovering over bar chart
      var bpos = this.toLocal(bg, {x: mx, y: my});
      if (bpos.x >= 50 && bpos.x < this.waterLevels.length*25+25 && bpos.y >= 0 && bpos.y <= 100) {
        var i = Math.floor((bpos.x-25)/25);

        lg.clear();
        lg.lineStyle(5, 0x408c99, 0.5);
        lg.moveTo(0, this.weather.global.levelToY(this.waterLevels[i].max));
        lg.lineTo(800, this.weather.global.levelToY(this.waterLevels[i].max));
        lg.moveTo(0, this.weather.global.levelToY(this.waterLevels[i].min));
        lg.lineTo(800, this.weather.global.levelToY(this.waterLevels[i].min));

        this.txtMax.y = this.weather.global.levelToY(this.waterLevels[i].max)-25;
        this.txtMax.text = "high prediction in " + i + " turn" + ((i > 1) ? "s" : "");
        this.txtMax.visible = true;
        this.txtMin.y = this.weather.global.levelToY(this.waterLevels[i].min)-10;
        this.txtMin.text = "low prediction in " + i + " turn" + ((i > 1) ? "s" : "");
        this.txtMin.visible = true;
      } else {
        lg.clear();

        this.txtMax.visible = false;
        this.txtMin.visible = false;
      }
    },

    drawBar: function(bg, i, level) {
      i = Math.floor(i);

      // Clear out the old bar
      bg.lineStyle(0, 0xffffff, 1);
      bg.beginFill(0xffffff, 1);
      bg.drawRect((i+1)*25, 0, 25, 100);

      var loColor = 0x7bced8;
      var hiColor = 0x35807b;

      // Draw the new bar
      bg.lineStyle(0, loColor, 1);
      bg.beginFill(loColor, 1);
      bg.drawRect((i+1)*25, 100-level.mean, 25, level.mean);
      // Uncertainty bar
      bg.lineStyle(0, hiColor, 1);
      bg.beginFill(hiColor, 1);
      bg.drawRect((i+1)*25, 100-level.max, 25, level.max-level.min);

    },

    onUpdateStart: function() {
      this.numTweens += 1;
      this.isUpdating = true;
    },

    onUpdateComplete: function() {
      this.numTweens -= 1;
      if (this.numTweens <= 0) {
        this.isUpdating = false;
        this.numTweens = 0;
      }
    },

    toLocal: function(obj, pos) {
      var o = obj;
      var p = _.clone(pos);
      while (o != null) {
        p.x -= o.x;
        p.y -= o.y;
        o = o.parent;
      }
      return p;
    }
  }
);

module.exports = ForecastView;
