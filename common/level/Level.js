module.exports = Level = function(name, title, spawnX, spawnY) {
	this.name = name;
	this.title = title;
	this.spawnX = spawnX;
	this.spawnY = spawnY;

	this.previousNow = new Date();

	this.spriteList = [];
	this.obstacles = [];
}

// Server only
Level.prototype.init = function () {
	this.spriteList = [];

	for (var i = 0; i < global.wsServer.clients.length; i++) {
		this.spriteList.push(global.wsServer.clients[i].sprite);
	}

	this.initLandscape();
}

Level.prototype.getSpawnPoint = function () {
	var range = 100;
	var point = {x : this.spawnX - range/2, y : this.spawnY - range/2};
	var valid = false;

	while (!valid) {
		valid = true;

		for (var i = 0; i < global.level.spriteList.length; i++) {
			var distance = Math.sqrt(Math.pow(point.x - this.spriteList[i].data.x, 2) + Math.pow(point.y - this.spriteList[i].data.y, 2));

			if (distance < 30) {
				point.x += 32;

				if (point.x > this.spawnX + range/2) {
					point.y += 32;
					point.x = this.spawnX - range/2;

					if (point.y > this.spawnY + range/2) {
						range *= 2;
						point = {x : this.spawnX - range/2, y : this.spawnY - range/2};
					}
				}

				valid = false;
				break;
			}
		}
	}

	return point;
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

Level.prototype.getWalkableCost = function (x, y, exceptId) {
	var cost = 0;

	if (x <= 0 || x >= 670 || y < 0 || y > 670) {
		cost = -1;
	}

	if (cost == 0) {
		for (var i = 0; i < this.spriteList.length; i++) {
			if (this.spriteList[i].data.id != exceptId) {
				var distance = Math.sqrt(Math.pow(x - this.spriteList[i].data.x, 2) + Math.pow(y - this.spriteList[i].data.y, 2));

				if (distance < 30) {
					cost = -1;
					break;
				}
			}
		}
	}

	if (cost == 0) {
		for (var i = 0; i < this.obstacles.length; i++) {
			var distance = Math.sqrt(Math.pow(x - this.obstacles[i].x, 2) + Math.pow(y - this.obstacles[i].y, 2));

			if (distance < this.obstacles[i].minDistance) {
				cost = -1;
				break;
			}
		}
	}
	
	return cost;
}

// Client only
Level.prototype.draw = function (ctx) {
	if (this.map == null) {
		this.map = new Image();
		this.map.src = "images/map-assets/" + this.name.toLowerCase() + ".jpg";
	}

	if (this.map.complete) {
		ctx.drawImage(this.map, 0, 0, 700, 700);
	}

	for (var i = 0; i < this.obstacles.length; i++) {
		this.obstacles[i].draw(ctx);
	};	

	this.drawLevel(ctx);
}