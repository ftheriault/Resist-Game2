module.exports = Level = function(name, title, spawnX, spawnY, enemySpawnX, enemySpawnY) {
	this.name = name;
	this.title = title;
	this.spawnX = spawnX;
	this.spawnY = spawnY;

	this.enemySpawnX = enemySpawnX;
	this.enemySpawnY = enemySpawnY;

	this.previousNow = new Date();

	this.spriteList = [];
	this.obstacles = [];

	this.startAt = null;
}

Level.prototype.getPlayers = function () {
	return global.wsServer.clients;
}

Level.prototype.distanceBetween = function(sprite1, sprite2) {
	return Math.sqrt(Math.pow(sprite1.data.x - sprite2.data.x, 2) + Math.pow(sprite1.data.y - sprite2.data.y, 2));
};

// Server only
Level.prototype.init = function () {
	this.spriteList = [];

	this.initLandscape();

	for (var i = 0; i < global.wsServer.clients.length; i++) {
		var point = this.getSpawnPoint(true);
		global.wsServer.clients[i].sprite.data.path = null;
		global.wsServer.clients[i].sprite.data.x = point.x;
		global.wsServer.clients[i].sprite.data.y = point.y;
		global.wsServer.clients[i].sprite.data.destX = point.x;
		global.wsServer.clients[i].sprite.data.destY = point.y;
		this.spriteList.push(global.wsServer.clients[i].sprite);
	}
}

Level.prototype.getSpawnPoint = function (isPlayer) {
	var middleX = this.spawnX;
	var middleY = this.spawnY;

	if (!isPlayer) {
		middleX = this.enemySpawnX;
		middleY = this.enemySpawnY;
	}

	var range = 150;
	var point = {x : middleX - range/2, y : middleY - range/2};
	var valid = false;

	while (!valid) {
		valid = true;

		for (var i = 0; i < global.level.spriteList.length; i++) {
			var distance = Math.sqrt(Math.pow(point.x - this.spriteList[i].data.x, 2) + Math.pow(point.y - this.spriteList[i].data.y, 2));

			if (distance < global.level.spriteList[i].data.minDistance) {
				point.x += global.level.spriteList[i].data.minDistance;

				if (point.x > middleX + range/2) {
					point.y += global.level.spriteList[i].data.minDistance;
					point.x = middleX - range/2;

					if (point.y > middleY + range/2) {
						range *= 2;
						point = {x : middleX - range/2, y : middleY - range/2};
					}
				}

				valid = false;
				break;
			}
		}
	}

	return point;
}

Level.prototype.checkIfCompleted = function () {
	var allPlayers = true;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (!global.level.spriteList[i].data.isPlayer) {
			allPlayers = false;
			break;
		}

	}

	if (allPlayers) {
		this.gotoNextLevel();
	}
}

// Server only
Level.prototype.tick = function () {
	var now = new Date();
	var delta = now - this.previousNow;
	this.previousNow = now;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		global.level.spriteList[i].tick(delta);
	}

	if (global.wsServer.clients.length > 0) {
		if (this.startAt == null) {
			this.startAt = now.getTime() + 5000;
		}
		else if (this.startAt < now.getTime()) {
			this.tickLevel(now.getTime(), delta);
		}
	}
	else {
		if (this.name != "Level1" || this.startAt != null) {
			console.log("- Starting back to Level1");
			global.level = new Level1();
			global.level.init();
		}
	}

	return delta;
}

Level.prototype.addNPC = function (npc) {
	this.spriteList.push(npc);	
	var spawnPoint = this.getSpawnPoint(false);
	npc.setLocation(spawnPoint.x, spawnPoint.y);
	npc.broadcastState();
}

Level.prototype.moveTo = function (sprite, destX, destY, withSprites, exceptSprites) {
	if (exceptSprites == null) {
		exceptSprites = [ sprite.data.id ];
	}
	exceptSprites.push(sprite.data.id);

	var path = global.aStar.calculatePath(sprite.data.x, sprite.data.y, destX, destY, exceptSprites, withSprites);

	if (path != null && path.length > 0) {
		var firstPoint = path.shift();
		sprite.data.path = path;
		sprite.data.destX = firstPoint.x;
		sprite.data.destY = firstPoint.y;
		global.wsServer.broadcastState(sprite);
	}
}

Level.prototype.checkSpriteCollision = function (x, y, exceptIds) {
	var collided = false;
	
	for (var i = 0; i < this.spriteList.length; i++) {
		if (exceptIds.indexOf(this.spriteList[i].data.id) == -1) {
			var distance = Math.sqrt(Math.pow(x - this.spriteList[i].data.x, 2) + Math.pow(y - this.spriteList[i].data.y, 2));

			if (distance < this.spriteList[i].data.minDistance) {
				collided = true;
				break;
			}
		}
	}

	return collided;
}

Level.prototype.getWalkableCost = function (x, y, exceptIds, withSprites) {
	var cost = 0;

	if (x <= 0 || x >= 670 || y < 0 || y > 670) {
		cost = -1;
	}	

	if (withSprites === true) {
		if (this.checkSpriteCollision(x, y, exceptIds)) {
			cost = -1;
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