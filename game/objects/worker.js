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
  this.moveRegion = null;
}

Worker.prototype = {

  // Called every frame for a given delta time
  nextTurn: function() {
    this.currentState.nextTurn();
    if (this.currentState.nextState){
      this.currentState = new this.currentState.nextState(this, this.currentState)
    }
  },

  requestState: function(state) {
    var newState = this.currentState.requestState(state);
    if (newState != null) {
      this.currentState = newState;
    }
  },

  requestMove: function(region) {
    this.moveRegion = region;
    this.requestState(Worker.MoveState);
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

createStateType('Move',
    function(worker, lastState) {
      Worker.State.call(this, worker, lastState);
      // Index of current region
      this.indCr = _.indexOf(Worker.MoveState.regions, worker.currentRegion);
      this.indMr = _.indexOf(Worker.MoveState.regions, worker.moveRegion);
    },
    {
      nextTurn: function() {
        var worker = this.worker;
        var cr = worker.currentRegion;

        if (worker.moveRegion != null && worker.moveRegion != worker.currentRegion) {
          this.indCr = _.indexOf(Worker.MoveState.regions, worker.currentRegion);
          this.indMr = _.indexOf(Worker.MoveState.regions, worker.moveRegion);

          var indNext = this.indCr;

          if (this.indMr > this.indCr) {
            indNext += 1;
          } else {
            indNext -= 1;
          }

          var nextRegion = Worker.MoveState.regions[indNext];

          worker.currentRegion.workers = _.without(cr.workers, worker);
          worker.currentRegion = nextRegion;
          nextRegion.workers.push(worker);
        }
        if (worker.moveRegion == null || worker.moveRegion == worker.currentRegion) {
          worker.moveRegion = null;
          // TODO: Come up with an evacuated state
          worker.requestState(Worker.GatherState);
        }
      },

      getStatusText: function() {
        if (this.indMr > this.indCr) {
          return ">>>";
        } else {
          return "<<<";
        }
      },

      requestState: function(state) {
        this.worker.moveRegion = null;
        return new state(this.worker, this)
      },
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
