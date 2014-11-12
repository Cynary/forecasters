'use strict';


//Simple model, generates a probability for each day by randomly moving the prob up or down by .1 each day.
// inDisaster keeps track if city is currently in disaster
// disasterCount keeps track of how many days of disaster are left, including current day (i.e. if === 1, tomorrow will not be part of this disaster)
function SimpleWeatherModel(){
	this.currentProb = .3;
	this.probabilities = [];
	this.inDisaster = false;
	this.disasterCount = -1;
	for (var i = 0; i < 10; i++){
		this.probabilities.push(this.nextProb())
	}
}

SimpleWeatherModel.prototype = {
	//1/3 of the time, increase by .1. 1/3 of the time, decrease by .1
	nextProb: function(){
		var roll = Math.random();
		if (roll > .66){
			this.currentProb += .1;
			this.currentProb = Math.min(1, this.currentProb);
		} else if (roll < .33){
			this.currentProb  -= .1;
			this.currentProb = Math.max(0, this.currentProb);
		}
		return this.currentProb;
	},
	chanceOfDisaster: function(daysInTheFuture){
		if (daysInTheFuture === 0) return undefined;
		return this.probabilities[daysInTheFuture-1];
	},
	//Decide the state of the next day and move into it.
	step: function(){
		if (!this.inDisaster){
			var roll = Math.random();
			var chanceOfDisasterTomorrow = this.chanceOfDisaster(1);
			console.log(roll + " " + chanceOfDisasterTomorrow);
			if (roll <= chanceOfDisasterTomorrow){
				this.inDisaster = true;
				//Set length of disaster based on the probability of bad weather and the unluckiness of the roll.
				//Simple estimate for length is chanceOfDisasterTomorrow*3 + [0-3], 
				//tending towards the lower side of the second termas chanceOfDisasterTomorrow increases.
				this.disasterCount = Math.ceil(3*chanceOfDisasterTomorrow + 3*(1-roll));
			}
		}
		else{
			this.disasterCount-=1;
			if (this.disasterCount<=0){
				this.inDisaster = false;
				this.disasterCount = -1;
			}
		}
		//Keep shifting probabilities even in disaster. Thought it may create nicer 
		//dynamics by making it less likely you get pounded by multiple disasters all in a row. 
		this.probabilities.shift();
		this.probabilities.push(this.nextProb());
	}
}

function SimpleWeather(){
	this.model = new SimpleWeatherModel();
}

SimpleWeather.prototype = {
	chanceOfDisaster: function(daysInTheFuture){
		return this.model.chanceOfDisaster(daysInTheFuture);
	},
	startNextDay: function(){
		this.model.step();
		return this.model.inDisaster;
	},
	//Number of days left in disaster after the current day. If negative, not currently in disaster.
	daysLeftinDisaster: function(){
		return this.model.disasterCount-1;
	}

};