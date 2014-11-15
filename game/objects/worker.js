'use strict';

var _ = require('underscore');

var nextWorkerUid = 0;

// Broad worker class
function Worker(game, homeRegion) {
  this.workerUid = nextWorkerUid;
  nextWorkerUid++;

  // Utility variables
  this.game = game;

  // Game-relevant variables
  this.safe = false;

  this.currentState = new Worker.GatherState(this, null);
  this.currentRegion = homeRegion;
  this.homeRegion = homeRegion;
  this.nextRegion = null;
}

Worker.prototype = {

  // Called every frame for a given delta time
  nextTurn: function() {
    if (this.nextRegion != null) {
      // Remove this worker from the current region
      this.currentRegion.workers = _.without(this.currentRegion.workers, this);
      this.currentRegion = this.nextRegion;
      this.nextRegion.workers.push(this);
      this.nextRegion = null;
    }
    /*
    this.currentState.nextTurn();
    if (this.currentState.nextState){
      this.currentState = new this.currentState.nextState(this, this.currentState)
    }
    */
  },

  requestState: function(state) {
    var newState = this.currentState.requestState(state);
    if (newState != null) {
      this.currentState = newState;
    }
  }

};

// Defines an interface for worker states
Worker.State = function(worker, lastState) {
  this.worker = worker;

  // Set this to non-null to tell the state machine to switch states
  this.nextState = null;
}
Worker.State.prototype = {
  nextTurn: function() {},
  requestState: function(state) {
    return new state(this.worker, this)
  },
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
        return "+1 Supply";
      }
    });

createStateType('Evac',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      if (lastState instanceof Worker.EvacReturnState) {
        this.evacTimer = 2 - lastState.evacTimer;
      } else {
        this.evacTimer = 2;
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
        this.worker.safe = false;
        this.requestedState = state;

        // If the evac hasn't started yet, change states immediately
        if (this.evacTimer == 2) {
          return new state(this.worker, this);
        } else {
          return new Worker.EvacReturnState(this.worker, this);
        }
      },
      getStatusText: function(){
        if (this.worker.safe){
          return 'Safe';
        }
        return 'Evacuating in ' + Math.ceil(this.evacTimer / this.worker.currentRegion.health) + ' days'
      }
    });


createStateType('EvacReturn',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      this.evacTimer = 2 - lastState.evacTimer;
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
          return new state(this.worker, this);
        } else {
          this.requestedState = state;
        }
      },
      getStatusText: function() {
        var evacTime = this.evacTimer / this.worker.currentRegion.health;
        return "Returning in " + Math.ceil(evacTime) + 'days';
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
        return "+0.5 Victory"
      }
    });
module.exports = Worker;
