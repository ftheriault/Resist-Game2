var fs = require('fs');

module.exports = Level = function(name, spawnX, spawnY, enemySpawnX, enemySpawnY) {
	this.name = name;
	this.spawnX = spawnX;
	this.spawnY = spawnY;

	this.enemySpawnX = enemySpawnX;
	this.enemySpawnY = enemySpawnY;

	this.previousNow = new Date();
	this.debugMessageCooldown =0;
}

Level.prototype.getPlayers = function () {
	return global.wsServer.clients;
}

Level.prototype.commonInit = function () {
	this.startCooldown = null;
	this.spriteList = [];
	this.aStarQueue = [];
	this.previousNow = new Date();
	this.obstacles = [];
}

// Server only
Level.prototype.init = function () {
	this.commonInit();
	this.initLandscape();

	for (var i = 0; i < global.wsServer.clients.length; i++) {
		if (global.wsServer.clients[i].sprite != null) {
			var point = this.getSpawnPoint(true);
			global.wsServer.clients[i].sprite.data.path = null;
			global.wsServer.clients[i].sprite.data.x = point.x;
			global.wsServer.clients[i].sprite.data.y = point.y;
			global.wsServer.clients[i].sprite.data.destX = point.x;
			global.wsServer.clients[i].sprite.data.destY = point.y;
			global.wsServer.clients[i].sprite.restore();
			this.spriteList.push(global.wsServer.clients[i].sprite);
		}
	}

	global.wsServer.broadcastState();
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

	for (var i = 0; i < this.spriteList.length; i++) {
		if (!this.spriteList[i].data.isPlayer) {
			allPlayers = false;
			break;
		}

	}

	if (allPlayers) {

		if (global.maxWaveNumber < global.waveNumber)  {
			global.maxWaveNumber = global.waveNumber;
			fs.writeFile("./data.txt", global.waveNumber); 
		}
		
		global.waveNumber++;

		this.gotoNextLevel();
	}
}

// Server only
Level.prototype.tick = function () {
	var now = new Date();
	var delta = now - this.previousNow;
	this.previousNow = now;

	if (delta == 0) {
		delta = 1;
	}
	
	if (global.debugMode) {
		this.debugMessageCooldown += delta;

		if (this.debugMessageCooldown > 5000) {
			console.log("- Debug : aStar queue size : " + this.aStarQueue.length);
			console.log("- Debug : tick delta : " + delta);
		}
	}
	
	if (this.aStarQueue.length > 0) {
		var elem = this.aStarQueue.shift();
		elem.logic();
	}

	var allPlayersDead = true;
	
	for (var i = 0; i < this.spriteList.length; i++) {
		if (!this.spriteList[i].isAlive()) {
			this.spriteList.splice(i, 1);
			i--;
		}
		else {
			this.spriteList[i].tick(delta);

			if (this.spriteList[i].data.isPlayer) {
				allPlayersDead = false;
			}
		}
	}

	if (this.startCooldown != null && this.startCooldown > 0) {
		if (parseInt((this.startCooldown - delta)/1000) < parseInt(this.startCooldown/1000)) {
			global.wsServer.broadcastMessage("Incoming in : " + parseInt((this.startCooldown - delta)/1000), "white");
		}

		this.startCooldown -= delta;
	}

	var goToLevel1 = false;
	
	if (global.wsServer.clients.length > 0) {
		if (!allPlayersDead) {
			if (this.startCooldown == null) {
				this.startCooldown = 10000; // idle period before starting
			}
			else if (this.startCooldown <= 0) {
				this.tickLevel(now.getTime(), delta);
			}
		}
		else {
			goToLevel1 = true;

			if (global.maxWaveNumber < global.waveNumber)  {
				var chars = "";

				for (var i = 0; i < global.wsServer.clients.length; i++) {
					if (global.wsServer.clients[i].sprite != null && global.wsServer.clients[i].sprite.data != null) {
						chars += global.wsServer.clients[i].sprite.data.name + ", ";
					}
				}

				if (chars.length > 0) {
					chars = chars.substr(0, chars.length - 2);
					fs.appendFile("./client/log.txt", "<div>(" + (new Date()) + ") " + global.waveNumber + " waves completed by : " + chars + "</div>"); 
				}
			}
		}
	}
	else {
		if (this.name != "Level1" || this.startCooldown != null) {
			goToLevel1 = true;
		}
	}

	if (goToLevel1) {
		console.log("- Starting back to Level1");
		global.level = new Level1();
		global.level.init();
		global.waveNumber = 1;
	}
	
	if (global.debugMode && this.debugMessageCooldown > 5000) {
		console.log("- Debug : Cycle finished");
		this.debugMessageCooldown = 0;
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
	for (var i = 0; i < this.aStarQueue.length; i++) {
		if (this.aStarQueue[i].spriteId == sprite.data.id) {
			this.aStarQueue.splice(i, 1);
			i--;
		}
	}

	var moveData = {
		spriteId : sprite.data.id,
		logic : function () {
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
	}
	
	if (sprite.data.isPlayer === true) {
		this.aStarQueue.unshift(moveData);
	}
	else {
		this.aStarQueue.push(moveData);	
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