var Level = require('./Level');
var Tree = require('./obstacle/Tree');
var Invisible = require('./obstacle/Invisible');
var Skeleton = require('./../npc/Skeleton');
var Thief = require('./../npc/Thief');
var Sorcerer = require('./../npc/Sorcerer');
var Archer = require('./../npc/Archer');
var Giant = require('./../npc/Giant');
var Summoner = require('./../npc/Summoner');
var MeleeAI = require('./../ai/MeleeAI');

module.exports = Level6 = function() {
	Level.call(this, "Level6", 350, 150, 350, 750, "steeps-of-destiny.mp3");
}

Level6.prototype = new Level();
Level6.prototype.constructor = Level6;

Level6.prototype.initLandscape = function () {
	this.lastEnemySpawnTime = 0;
	this.enemyLeft = 6 + global.waveNumber;
	
	this.obstacles.push(new Invisible(350, 350, 80));
}

// Server only
Level6.prototype.tickLevel = function (now, delta) {
	if (this.enemyLeft > 0) {
		if (this.lastEnemySpawnTime + 1500 < now) {
			this.enemyLeft--;
			this.lastEnemySpawnTime = now;

			var npc = null;

			if (this.enemyLeft == 1) {
				npc = new Giant(global.waveNumber);
				npc.setLocation(this.enemySpawnX, this.enemySpawnY);
				npc.data.destX = 350 + parseInt(Math.random() * 20);
				npc.data.destY = 550 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft == 2 || this.enemyLeft == 5) {
				npc = new Summoner(global.waveNumber);
				npc.setLocation(750, 350);
				npc.data.destX = 550;
				npc.data.destY = 350 + parseInt(Math.random() * 50);
			}
			else {
				npc = new Thief(global.waveNumber);
				var y = 150 + parseInt(Math.random() * 450);
				npc.setLocation(-50, y);
				npc.data.destX = 50;
				npc.data.destY = y;
			}

			if (npc != null) {
				while (this.checkSpriteCollision(npc.data.x, npc.data.y, []) != 0) {
					npc.setLocation(npc.data.x + Math.random() * 100, npc.data.y + Math.random() * 100);
				}
				
				npc.ai = new MeleeAI();
				this.spriteList.push(npc);	
				npc.broadcastState();
			}
		}
	}
	else {
		this.checkIfCompleted();
	}
}

// Client only
Level6.prototype.drawLevel = function (ctx) {
}

Level6.prototype.gotoNextLevel = function() {
	global.level = new Level1();
	global.level.init();
};