'use strict';

var Views = require('./views');
var WorkerView = require('./worker_view');

var RegionView = Views.createViewType(
  function (region) {
    Views.call(this, region.global.game, region.x, region.y);
    this.region = region;
    this.inDanger = false;
    this.imgCity = this.uiGroup.create(0, 0, 'region', 0);
    this.imgCity.anchor.setTo(0.5, 1.0);
    this.imgCity.scale.x = 0.2;
    this.imgCity.scale.y = 0.2;

    this.workerViews = [];
    for(var index in this.region.workers) {
      this.workerViews[index] = new WorkerView(this.region.workers[index]);
    }
  },

  {
    update: function() {
      //A littlebit complicated switching code. This is to avoid reloading texture every frame.
      
      if (this.region.global.weather.getCurrentWaterLevel() > this.region.height){
        if (!this.inDanger){
          console.log('switching')
          this.inDanger = true;
          this.imgCity.loadTexture('region', 1)
        }
      }else{
        if(this.inDanger){
          this.inDanger = false;
          this.imgCity.loadTexture('region', 0)
        }
      }
      
      for(var index in this.region.workers) {
        this.workerViews[index].update();
      }
    },
  }
);

module.exports = RegionView;
