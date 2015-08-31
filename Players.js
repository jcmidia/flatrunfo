var shortid = require('shortid');

function Player(name){
	this.id = shortid.generate();
	this.name = name;
}

Player.prototype.setName = function(name)
{
  this.name = name;
}


module.exports = Player;