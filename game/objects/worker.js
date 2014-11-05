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
  update: function(dt) {
    this.currentState.update(dt);
    if (this.currentState.nextState != null) {
      this.currentState = new this.currentState.nextState(this, this.currentState);
    }
  },

};

// Defines an interface for worker states
Worker.State = function(worker, lastState) {
  this.worker = worker;

  // Set this to non-null to tell the state machine to switch states
  this.nextState = null;
}
Worker.State.prototype = {
  update: function(dt) {},
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
      this.gatherTimer = 2.0;
    },
    {
      update: function(dt) {
        this.gatherTimer -= dt * this.worker.currentRegion.efficiency;
        if (this.gatherTimer <= 0.0) {
          this.gatherTimer += 2.0;
          this.worker.currentRegion.supplies += 1;
        }
      },

      getStatusText: function() {
        var gatherTime = this.gatherTimer / this.worker.currentRegion.efficiency;
        return "Gathering: " + Math.floor(10.0 * gatherTime) / 10.0;
      }
    });

createStateType('Evac',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      if (lastState instanceof Worker.EvacReturnState) {
        this.evacTimer = 5.0 - lastState.evacTimer;
      } else {
        this.evacTimer = 5.0;
      }
      this.worker.safe = false;
      console.log(this.worker.safe);
    },
    {
      update: function(dt) {
        if (this.evacTimer > 0.0) {
          this.evacTimer -= dt * this.worker.currentRegion.efficiency;
        } else {
          this.evacTimer = 0.0;
          this.worker.safe = true;
        }
      },

      requestState: function(state) {
        this.nextState = Worker.EvacReturnState;
        this.worker.safe = false;
        this.requestedState = state;
      },

      getStatusText: function() {
        if (this.worker.safe) {
          return "Safe";
        } else {
          var evacTime = this.evacTimer / this.worker.currentRegion.efficiency;
          return "Evacuating: " + Math.floor(10.0 * evacTime) / 10.0;
        }
      }
    });


createStateType('EvacReturn',
    function(worker, lastState) {
      // Make a call to the super constructor
      Worker.State.call(this, worker, lastState);
      this.evacTimer = 5.0 - lastState.evacTimer;
      this.requestedState = lastState.requestedState
    },
    {
      update: function(dt) {
        if (this.evacTimer > 0.0) {
          this.evacTimer -= dt * this.worker.currentRegion.efficiency;
        } else {
          this.evacTimer = 0.0;
          this.nextState = this.requestedState;
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
        var evacTime = this.evacTimer / this.worker.currentRegion.efficiency;
        return "Returning: " + Math.floor(10.0 * evacTime) / 10.0;
      }
    });

createStateType('Build',
    function(worker, lastState) {
      Worker.State.call(this, worker, lastState);
    },
    {
      update: function(dt) {
        // TODO: Add building
      },

      getStatusText: function() {
        return "Buildling"
      }
    });

module.exports = Worker;
