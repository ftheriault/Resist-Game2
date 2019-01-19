var Level = require('./Level');
var Level6 = require('./Level6');
var Tree = require('./obstacle/Tree');
var Invisible = require('./obstacle/Invisible');
var Skeleton = require('./../npc/Skeleton');
var Thief = require('./../npc/Thief');
var Sorcerer = require('./../npc/Sorcerer');
var Archer = require('./../npc/Archer');
var Giant = require('./../npc/Giant');
var MeleeAI = require('./../ai/MeleeAI');

module.exports = Level5 = function() {
	Level.call(this, "Level5", 350, 350, 350, 750, "heroic-minority.mp3");
}

Level5.prototype = new Level();
Level5.prototype.constructor = Level5;

Level5.prototype.initLandscape = function () {
	this.lastEnemySpawnTime = 0;
	this.enemyLeft = 12 + 2 * global.waveNumber;
	this.giantAdded = false;
	
	for (var i = 250; i > 20; i -= 20) {
		this.obstacles.push(new Invisible(437, i, 20));
	}

	for (var i = 350; i < 600; i += 20) {
		this.obstacles.push(new Invisible(437, i, 20));
	}

	for (var i = 430; i < 680; i += 20) {
		this.obstacles.push(new Invisible(i, 85, 20));
		this.obstacles.push(new Invisible(i, 560, 20));
	}

	this.obstacles.push(new Invisible(510, 550, 40));
	this.obstacles.push(new Invisible(590, 550, 40));
}

// Server only
Level5.prototype.tickLevel = function (now, delta) {
	if (this.enemyLeft > 0) {
		if (this.lastEnemySpawnTime + 2000 < now) {
			this.lastEnemySpawnTime = now;

			var npc = null; 
			
			var destX = 50;
			var destY = 50;

			if (this.giantAdded) {
				this.enemyLeft--;

				if (this.enemyLeft % 2 == 0) {
					var y = 100 + parseInt(Math.random() * 200);
					npc = new Thief(global.waveNumber);
					npc.setLocation(-50, y);
					destX = 90;
					destY = y;
				}
				else if (this.enemyLeft % 2 == 1) {
					var y = 400 + parseInt(Math.random() * 100);
					npc = new Skeleton(global.waveNumber);
					npc.setLocation(-50, y);
					destX = 90;
					destY = y;
				}
			}
			else {
				this.giantAdded = true;
				npc = new Giant(global.waveNumber);
				npc.setLocation(-60, 350);
				destX = 60;
				destY = 350;
			}

			while (this.checkSpriteCollision(npc.data.x, npc.data.y, []) != 0) {
				npc.setLocation(npc.data.x + Math.random() * 100, npc.data.y + Math.random() * 100);
			}
			
			npc.data.destX = destX;
			npc.data.destY = destY;
			
			npc.ai = new MeleeAI();
			this.spriteList.push(npc);	
			npc.broadcastState();
		}
	}
	else {
		this.checkIfCompleted();
	}
}

// Client only
Level5.prototype.drawLevel = function (ctx) {
}

Level5.prototype.gotoNextLevel = function() {
	global.level = new Level6();
	global.level.init();
};