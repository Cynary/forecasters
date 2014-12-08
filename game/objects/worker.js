'use strict';

function generateName(){
  var firstNames = ["Matt", "Tony", "Norman", "Rodrigo", "Tsotne", "John", "Eva", "Tricia"];
  var lastNames = ["Smith", "Johnson", "Jones", "Jackson"];
  var firstName = firstNames[parseInt(Math.random()*firstNames.length)];
  var lastName = lastNames[parseInt(Math.random()*lastNames.length)];
  var name = firstName +" " + lastName;
  return name
}
// Broad worker class
function Worker(global, homeRegionIndex) {
  this.global = global;
  this.homeRegionIndex = homeRegionIndex;
  this.currentRegionIndex = homeRegionIndex;
  this.targetRegionIndex = homeRegionIndex;
  this.building = false;
  this.health = 100;
  this.name = generateName();
}

Worker.prototype = {

  nextDay: function() {
    this.status = "";
    var damaged = false;

    // If the worker is at home, (s)he'll either collect supply, or build the dam
    if (this.homeRegionIndex === this.currentRegionIndex && this.homeRegionIndex === this.targetRegionIndex) {
      if (this.building) {
        this.buildState();
      } else {
        this.gatherState();
      }
    } else {
      // Otherwise, (s)he'll decrease supply and move left or right
      this.building = false;
      if (this.global.supply <= 0){
        this.health -= 20;
        this.dmgCause = "candy";
      }
      this.global.decreaseSupply(this);

    }
    if (this.currentRegionIndex != this.targetRegionIndex) {
      this.moveState();
    }
  },

  buildState: function() {
    this.building = true;
    this.global.increaseBuildProgress(this);
  },

  gatherState: function() {
    this.building = false;
    this.global.increaseSupply(this);
  },

  moveState: function() {
    if (this.currentRegionIndex < this.targetRegionIndex) {
      this.currentRegionIndex++;
    } else if (this.currentRegionIndex > this.targetRegionIndex) {
      this.currentRegionIndex--;
    }
  },

};

module.exports = Worker;
