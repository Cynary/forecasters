'use strict';

function Markov(startState, transition, observation)
{
  this.state = startState;
  this.transition = transition;
  this.observation = observation;
}

Markov.prototype = {
  step: function()
  {
    var stateToProbs = this.transition(this.State);
    var observation = this.observation(this.State);
    this.state = this.chooseState(stateToProbs);
    return observation;
  },

  chooseState: function(stateToProbs)
  {
    var choice = Math.random();
    var accum = 0;
    for(state in stateToProbs)
    {
      accum += stateToProbs[state];
      if (accum >= choice)
      {
        return state;
      }
    }
    return state;
  }
};

module.exports = Markov;
