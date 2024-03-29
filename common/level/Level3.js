var Level = require('./Level');
var Level4 = require('./Level4');
var Tree = require('./obstacle/Tree');
var Invisible = require('./obstacle/Invisible');
var Skeleton = require('./../npc/Skeleton');
var Thief = require('./../npc/Thief');
var Sorcerer = require('./../npc/Sorcerer');
var MeleeAI = require('./../ai/MeleeAI');

module.exports = Level3 = function() {
	Level.call(this, "Level3", 350, 350, 350, 750, "steeps-of-destiny.mp3");
}

Level3.prototype = new Level();
Level3.prototype.constructor = Level3;

Level3.prototype.initLandscape = function () {
	this.lastEnemySpawnTime = 0;
	this.enemyLeft = 10 + global.waveNumber;
	
	this.obstacles.push(new Tree(350, 527));
	this.obstacles.push(new Tree(380, 537));
	this.obstacles.push(new Tree(410, 555));
	this.obstacles.push(new Tree(450, 540));
	this.obstacles.push(new Tree(490, 550));
	this.obstacles.push(new Tree(540, 510));

	this.obstacles.push(new Invisible(490, 164, 100));
}

// Server only
Level3.prototype.tickLevel = function (now, delta) {
	if (this.enemyLeft > 0) {
		if (this.lastEnemySpawnTime + 1500 < now) {
			this.enemyLeft--;
			this.lastEnemySpawnTime = now;

			var npc = null; 
			
			var destX = 50;
			var destY = 50;

			if (this.enemyLeft % 3 == 0) {
				npc = new Sorcerer(global.waveNumber);
				npc.setLocation(-50, 350);
				destX = 30;
				destY = 325 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 3 == 1) {
				npc = new Skeleton(global.waveNumber);
				npc.setLocation(750, 350);
				destX = 650;
				destY = 325 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 3 == 2) {
				npc = new Thief(global.waveNumber);
				npc.setLocation(350, 750);
				destX = 30;
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
Level3.prototype.drawLevel = function (ctx) {
}

Level3.prototype.gotoNextLevel = function() {
	global.level = new Level4();
	global.level.init();
};