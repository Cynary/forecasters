Region = require('../objects/Region');
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      regionTest = new Region(this.game,'city', this.game.width/2, this.game.height/3, {preparedness: 10});
      game= this.game;
      button = new Button('fortify', function(region){
        console.log('clicked')
        console.log(region.preparedness)
        region.preparedness += 50
      })
      regionTest.addButton(button, 10, 10);
      regionTest.addText('preparedness',10,50,true);
    },
    update: function() {
      regionTest.update();
      regionTest.preparedness -= 1;
    },
  };
  
  module.exports = Play;