var Level = require('./Level');
var Level2 = require('./Level2');
var Tree = require('./obstacle/Tree');
var Skeleton = require('./../npc/Skeleton');
var MeleeAI = require('./../ai/MeleeAI');

module.exports = Level1 = function() {
	Level.call(this, "Level1", "Level 1", 350, 350, 350, 650);

	this.lastEnemySpawnTime = 0;
	this.enemyLeft = 10;
}

Level1.prototype = new Level();
Level1.prototype.constructor = Level1;

Level1.prototype.initLandscape = function () {
	
	this.obstacles.push(new Tree(40, 50));
	this.obstacles.push(new Tree(80, 80));
	this.obstacles.push(new Tree(140, 150));
}

// Server only
Level1.prototype.tickLevel = function (now, delta) {
	if (this.enemyLeft > 0) {
		if (this.lastEnemySpawnTime + 2000 < now) {
			this.enemyLeft--;
			this.lastEnemySpawnTime = now;

			var npc = new Skeleton();
			npc.build(false, global.spriteId++, "Skeleton", "Skeleton", 20, 20, 20, 20, 0.04, [ new Slash(null, 1) ], 10);		
			npc.ai = new MeleeAI();
			this.addNPC(npc);
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