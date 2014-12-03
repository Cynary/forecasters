'use strict';

var Views = require('./views');
var _ = require('underscore');
var tooltip_displayed = false

var TooltipView = Views.createViewType(
    function (global, x, y, text, turn) {
        Views.call(this, global.game, x, y);
        this.global = global
        this.turn = turn
        this.text = text
        this.displayed = false;
        this.style = { font: "20px Architects Daughter", fill: "#ffffff", align: 'center'};
        
    },
  {
    update: function(currentTurn){
        if(currentTurn == this.turn && this.displayed == false && tooltip_displayed == false){
            this.show()
            this.displayed = true;
        }
        if(currentTurn > this.turn && tooltip_displayed == false){
            if (this.text.length - 1 >= currentTurn - this.turn){
              this.txthint1.text = this.text[currentTurn - this.turn]
            }
        }
    },
    show: function(){
        this.imgbackground = this.uiGroup.create(0, 0, 'hint', 0);
        this.createText("hint1", 20, 0, this.text[0], this.style);
        this.createButton('close', 5, 60, 'hint_close', function(){
          this.uiGroup.visible = false;
          tooltip_displayed = true;
        })
    }
  }
)

module.exports = TooltipView;