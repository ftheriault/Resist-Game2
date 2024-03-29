var Level = require('./Level');
var Level5 = require('./Level5');
var Tree = require('./obstacle/Tree');
var Invisible = require('./obstacle/Invisible');
var Skeleton = require('./../npc/Skeleton');
var Thief = require('./../npc/Thief');
var Sorcerer = require('./../npc/Sorcerer');
var Archer = require('./../npc/Archer');
var MeleeAI = require('./../ai/MeleeAI');

module.exports = Level4 = function() {
	Level.call(this, "Level4", 350, 350, 350, 750, "the-looming-battle.mp3");
}

Level4.prototype = new Level();
Level4.prototype.constructor = Level4;

Level4.prototype.initLandscape = function () {
	this.lastEnemySpawnTime = 0;
	this.enemyLeft = 13 + 1 * global.waveNumber;
	
	this.obstacles.push(new Invisible(458, 213, 100));
	this.obstacles.push(new Invisible(151, 360, 100));
	this.obstacles.push(new Invisible(529, 600, 50));
}

// Server only
Level4.prototype.tickLevel = function (now, delta) {
	if (this.enemyLeft > 0) {
		if (this.lastEnemySpawnTime + 1500 < now) {
			this.enemyLeft--;
			this.lastEnemySpawnTime = now;

			var npc = null; 
			
			var destX = 50;
			var destY = 50;

			if (this.enemyLeft % 5 == 0) {
				npc = new Sorcerer(global.waveNumber);
				npc.setLocation(-50, 600 + parseInt(Math.random() * 50));
				destX = 100;
				destY = 550 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 5 == 1) {
				npc = new Skeleton(global.waveNumber);
				npc.setLocation(750, 350);
				destX = 650;
				destY = 325 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 5 == 2) {
				npc = new Thief(global.waveNumber);
				npc.setLocation(350, 0);
				destX = 310 + parseInt(Math.random() * 50);
				destY = 100;
			}
			else if (this.enemyLeft % 5 == 3) {
				npc = new Archer(global.waveNumber);
				npc.setLocation(350, 750);
				destX = 300 + parseInt(Math.random() * 40);
				destY = 650;
			}
			else if (this.enemyLeft % 5 == 4) {
				npc = new Skeleton(global.waveNumber);
				npc.setLocation(-50, 50);
				destX = 650;
				destY = 325 + parseInt(Math.random() * 50);
			}

			while (this.checkSpriteCollision(npc.data.x, npc.data.y, []) != 0) {
				npc.setLocation(npc.data.x + Math.random() * 300, npc.data.y + Math.random() * 300);
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
Level4.prototype.drawLevel = function (ctx) {
}

Level4.prototype.gotoNextLevel = function() {
	global.level = new Level5();
	global.level.init();
};