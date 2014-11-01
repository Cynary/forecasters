//A Button to be displayed on top of a region.
//Onclick: function that is fired when the button is clicked.
//This by itself doesn't do anything. It is used with the 'Region' Class.
//The onclick method is Passed with the region the button is tied to.
function Button(texture, onclick){
    this.texture = texture
    this.onclick = onclick 
}


module.exports = Button;