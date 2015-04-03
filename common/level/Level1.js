
module.exports = Level1 = function() {
	this.name = "Level1";
	this.title = "Level 1";
	this.spawnX = 350;
	this.spawnY = 350;

}

// Server only
Level1.prototype.init = function () {
	this.spriteList = [];

	for (var i = 0; i < global.wsServer.clients.length; i++) {
		this.spriteList.push(global.wsServer.clients[i].sprite);
	}

	// add monsters
}

// Client only
Level1.prototype.draw = function () {
	if (this.map == null) {
		this.map = new Image();
		this.map.src = "images/level1.jpg";
	}

	if (this.map.complete) {
		game.ctx.drawImage(this.map, 0, 0, 700, 700);
	}
}