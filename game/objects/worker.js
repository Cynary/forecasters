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
      this.GATHER_TIME = 0.8;
      this.gatherTimer = this.GATHER_TIME;
    },
    {
      nextTurn: function() {
      },

      getStatusText: function() {
        return "Placeholder";
      }
    });

createStateType('Evac',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      if (lastState instanceof Worker.EvacReturnState) {
        this.evacTimer = 3.0 - lastState.evacTimer;
      } else {
        this.evacTimer = 3.0;
      }
      this.worker.safe = false;
    },
    {
      nextTurn: function() {
      },
    });


createStateType('EvacReturn',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      this.evacTimer = 3.0 - lastState.evacTimer;
      this.requestedState = lastState.requestedState
    },
    {
      nextTurn: function() {
      },
    });

createStateType('Build',
    function(worker, lastState) {
      Worker.State.call(this, worker, lastState);
    },
    {
      nextTurn: function() {
      },

      getStatusText: function() {
        return "Building"
      }
    });

module.exports = Worker;
