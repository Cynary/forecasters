'use strict';

// Broad worker class
function Worker(game, homeRegion) {
  // Utility variables
  this.game = game;

  // Game-relevant variables
  this.safe = false;

  this.currentState = new Worker.GatherState(this, null);
  this.currentRegion = homeRegion;
  this.homeRegion = homeRegion;
}

Worker.prototype = {

  // Called every frame for a given delta time
  nextTurn: function() {
    if (this.currentState.nextState){
      this.currentState = new this.currentState.nextState(this, this.currentState)
    }
    this.currentState.nextTurn();
  },

};

// Defines an interface for worker states
Worker.State = function(worker, lastState) {
  this.worker = worker;

  // Set this to non-null to tell the state machine to switch states
  this.nextState = null;
}
Worker.State.prototype = {
  nextTurn: function() {},
  requestState: function(state) { this.nextState = state },
  getStatusText: function() {
    return "Placeholder";
  },
};

// Helper function to create states that inherit from Worker.State
function createStateType(name, ctor, proto) {
  ctor.prototype = Object.create(Worker.State.prototype);
  for (var k in proto) {
    ctor.prototype[k] = proto[k];
  }
  ctor.prototype.constructor = ctor;
  Worker[name + 'State'] = ctor;
}

createStateType('Gather',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
    },
    {
      nextTurn: function() {
        this.worker.currentRegion.supplies += this.worker.currentRegion.health;
      },

      getStatusText: function() {
        return "Gathering Supply";
      }
    });

createStateType('Evac',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      if (lastState instanceof Worker.EvacReturnState) {
        this.evacTimer = 3 - lastState.evacTimer;
      } else {
        this.evacTimer = 3;
      }
      this.worker.safe = false;
    },
    {
      nextTurn: function() {
        this.evacTimer -= this.worker.currentRegion.health;
        if (this.evacTimer <= 0){
          this.evacTimer = 0
          this.worker.safe = true;
        }
      },
      requestState: function(state) {
        this.nextState = Worker.EvacReturnState;
        this.worker.safe = false;
        this.requestedState = state;
      },
      getStatusText: function(){
        if (this.worker.safe){
          return 'safe';
        }
        return 'Evacuating: ' + Math.floor(this.evacTimer / this.worker.currentRegion.health) + 'turns left'
      }
    });


createStateType('EvacReturn',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      this.evacTimer = 3 - lastState.evacTimer;
      this.requestedState = lastState.requestedState      
    },
    {
      nextTurn: function() {
        this.evacTimer -= this.worker.currentRegion.health;
        if (this.evacTimer <= 0){
          this.evacTimer = 0
          this.nextState = this.requestedState
        }
      },
      requestState: function(state) {
        if (state == Worker.EvacState) {
          this.nextState = state;
        } else {
          this.requestedState = state;
        }
      },
      getStatusText: function() {
        var evacTime = this.evacTimer / this.worker.currentRegion.health;
        return "Returning: " + Math.floor(evacTime) + 'turns left';
      }
    });

createStateType('Build',
    function(worker, lastState) {
      Worker.State.call(this, worker, lastState);
    },
    {
      nextTurn: function(dt) {
        var progress = 3*this.worker.currentRegion.health;
        this.worker.game.buildProgress += progress;
      },

      getStatusText: function() {
        return "Buildling"
      }
    });
module.exports = Worker;
