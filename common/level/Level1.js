var Level = require('./Level');
var Level2 = require('./Level2');
var Tree = require('./obstacle/Tree');
var Skeleton = require('./../npc/Skeleton');
var MeleeAI = require('./../ai/MeleeAI');

module.exports = Level1 = function() {
	Level.call(this, "Level1", 350, 350, 350, 710, "the-looming-battle.mp3");
}

Level1.prototype = new Level();
Level1.prototype.constructor = Level1;

Level1.prototype.initLandscape = function () {
	this.lastEnemySpawnTime = 0;
	this.enemyLeft = 5 + global.waveNumber;
	
	this.obstacles.push(new Tree(20, 150));
	this.obstacles.push(new Tree(140, 130));
	this.obstacles.push(new Tree(160, 100));
	this.obstacles.push(new Tree(190, 90));
	this.obstacles.push(new Tree(10, 10));
	this.obstacles.push(new Tree(240, 00));
	this.obstacles.push(new Tree(450, 470));
	this.obstacles.push(new Tree(450, 600));
	this.obstacles.push(new Tree(200, 600));
	this.obstacles.push(new Tree(220, 570));
	this.obstacles.push(new Tree(520, 50));
	this.obstacles.push(new Tree(600, 90));
}

// Server only
Level1.prototype.tickLevel = function (now, delta) {
	if (this.enemyLeft > 0) {
		if (this.lastEnemySpawnTime + 2500 < now) {
			this.enemyLeft--;
			this.lastEnemySpawnTime = now;

			var npc = new Skeleton(global.waveNumber);
			npc.ai = new MeleeAI();

			var destX = 50;
			var destY = 50;

			if (this.enemyLeft % 4 == 0) {
				npc.setLocation(this.enemySpawnX, this.enemySpawnY);
				destX = 350 + parseInt(Math.random() * 20);
				destY = 550 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 4 == 1) {
				npc.setLocation(350, -50);
				destX = 350;
				destY = 50 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 4 == 2) {
				npc.setLocation(-50, 350);
				destX = 50;
				destY = 350 + parseInt(Math.random() * 50);
			}
			else if (this.enemyLeft % 4 == 3) {
				npc.setLocation(750, 350);
				destX = 550;
				destY = 350 + parseInt(Math.random() * 50);
			}

			while (this.checkSpriteCollision(npc.data.x, npc.data.y, []) != 0) {
				npc.setLocation(npc.data.x + Math.random() * 300, npc.data.y + Math.random() * 300);
			}

			npc.data.destX = destX;
			npc.data.destY = destY;

			this.spriteList.push(npc);	
			npc.broadcastState();
		}
	}
	else {
		this.checkIfCompleted();
	}
}

// Client only
Level1.prototype.drawLevel = function (ctx) {
}

Level1.prototype.gotoNextLevel = function() {
	global.level = new Level2();
	global.level.init();
};