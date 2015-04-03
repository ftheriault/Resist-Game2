
module.exports = Level1 = function() {
	this.title = "Level 1";

	// add models and collisions
}

Level1.prototype.init = function () {
	this.spriteList = [];

	for (var i = 0; i < global.wsServer.clients.length; i++) {
		this.spriteList.push(global.wsServer.clients[i].sprite);
	}

	// add monsters
}