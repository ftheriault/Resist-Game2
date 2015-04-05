
module.exports = Level = function(name, title, spawnX, spawnY) {
	this.name = name;
	this.title = title;
	this.spawnX = spawnX;
	this.spawnY = spawnY;

	this.previousNow = new Date();
}

// Server only
Level.prototype.init = function () {
	this.spriteList = [];

	for (var i = 0; i < global.wsServer.clients.length; i++) {
		this.spriteList.push(global.wsServer.clients[i].sprite);
	}

	this.initLevel();
}
// Server only
Level.prototype.tick = function () {
	var now = new Date();
	var delta = now - this.previousNow;
	this.previousNow = now;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		global.level.spriteList[i].tick(delta);
	}

	this.tickLevel(delta);
}

// Client only
Level.prototype.draw = function () {
	if (this.map == null) {
		this.map = new Image();
		this.map.src = "images/map-assets/" + this.name.toLowerCase() + ".jpg";
	}

	if (this.map.complete) {
		game.ctx.drawImage(this.map, 0, 0, 700, 700);
	}

	this.drawLevel();
}