var Level = require('./Level');
var Level3 = require('./Level3');
var Tree = require('./obstacle/Tree');
var Invisible = require('./obstacle/Invisible');
var Skeleton = require('./../npc/Skeleton');
var Thief = require('./../npc/Thief');
var MeleeAI = require('./../ai/MeleeAI');

module.exports = Level2 = function() {
	Level.call(this, "Level2", 350, 350, 350, 750);
}

Level2.prototype = new Level();
Level2.prototype.constructor = Level2;

Level2.prototype.initLandscape = function () {
	this.lastEnemySpawnTime = 0;
	this.enemyLeft = 10 + 3 * global.waveNumber;
	
	this.obstacles.push(new Tree(100, 135));
	this.obstacles.push(new Tree(130, 135));
	this.obstacles.push(new Tree(180, 90));
	this.obstacles.push(new Tree(210, 80));

	this.obstacles.push(new Invisible(222, 215, 62));
	this.obstacles.push(new Invisible(480, 215, 62));
	this.obstacles.push(new Invisible(222, 400, 62));
	this.obstacles.push(new Invisible(480, 400, 62));
}

// Server only
Level2.prototype.tickLevel = function (now, delta) {
	if (this.enemyLeft > 0) {
		if (this.lastEnemySpawnTime + 1500 < now) {
			this.enemyLeft--;
			this.lastEnemySpawnTime = now;

			var npc = null; 

			if (this.enemyLeft % 4 == 0) {
				npc = new Skeleton(global.waveNumber);
				npc.setLocation(this.enemySpawnX, this.enemySpawnY);
				npc.data.destX = 350 + parseInt(Math.random() * 20);
				npc.data.destY = 400 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 4 == 1) {
				npc = new Skeleton(global.waveNumber);
				npc.setLocation(350, -50);
				npc.data.destX = 350;
				npc.data.destY = 20 + parseInt(Math.random() * 50);	
			}
			else if (this.enemyLeft % 4 == 2) {
				npc = new Thief(global.waveNumber);
				npc.setLocation(-50, 350);
				npc.data.destX = 50;
				npc.data.destY = 350 + parseInt(Math.random() * 50);	
			}
			else if (this.enemyLeft % 4 == 3) {
				npc = new Thief(global.waveNumber);
				npc.setLocation(750, 350);
				npc.data.destX = 650;
				npc.data.destY = 350 + parseInt(Math.random() * 50);
			}

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
Level2.prototype.drawLevel = function (ctx) {
}

Level2.prototype.gotoNextLevel = function() {
	global.level = new Level3();
	global.level.init();
};