'use strict';

var Views = require('./views');
var WorkerView = require('./worker_view');

var RegionView = Views.createViewType(
  function (region) {
    Views.call(this, region.global.game, region.x, region.y);
    this.region = region;
    this.inDanger = false;
    this.imgCity = this.uiGroup.create(0, 0, 'region' + this.region.regionIndex, 0);
    this.imgCity.anchor.setTo(0.5, 1.0);
    this.imgCity.scale = {x: 0.2, y: 0.2};

    //this.imgRegion = this.uiGroup.create(-0, 0, 'regions');
    //this.imgRegion.scale = {x: 0.25, y: 3};
    //this.imgRegion.anchor.x = 0.5;


  },

  {
    update: function() {
      //A littlebit complicated switching code. This is to avoid reloading texture every frame.
      
      if (this.region.global.weather.getCurrentWaterLevel() > this.region.height){
        if (!this.inDanger){
          this.inDanger = true;
          this.imgCity.loadTexture('regionb', 1)
        }
      }else{
        if(this.inDanger){
          this.inDanger = false;
          this.imgCity.loadTexture('region' + this.region.regionIndex, 0)
        }
      }
      
    },
  }
);

module.exports = RegionView;
