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
    var stateToProbs = this.transition(this.state);
    var observation = this.observation(this.state);
    this.state = this.chooseState(stateToProbs);
    console.log("#step$");
    console.log(this.state);
    console.log(stateToProbs);
    return observation;
  },

  chooseState: function(stateToProbs)
  {
    var choice = Math.random();
    var accum = 0;
    for(var state in stateToProbs)
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
