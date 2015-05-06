var Sprite = require('../Sprite');
var Slash = require('../action/Slash');
var Skeleton = require('./Skeleton');

module.exports = Summoner = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Summoner", "Summoner", 20 + parseInt(level * 4), 20 + parseInt(level * 4), 20, 20, 0.04 + level/500.0, [ new Slash(null, level) ], level * 12);		
		this.data.level = level;
	}
}

Summoner.prototype = new Sprite();
Summoner.prototype.constructor = Summoner;

Summoner.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("skeleton", ["cloth-torso", "cloth-legs"], "spell");
}

Summoner.prototype.getDeathSound = function() {
	return  "monster/dead-" + Math.floor(Math.random() * 9 + 1) + ".mp3";
};

Summoner.prototype.digestMessage = function () {

}

Summoner.prototype.update = function () {

}

Summoner.prototype.triggerSpecialAIAbility = function() {
	for (var i = 0; i < 4; i++) {
		var npc = new Skeleton(global.waveNumber);
		var radius = 60;

		var tries = 0;
		var x = this.data.x;
		var y = this.data.y;
		var newX = this.data.x;
		var newY = this.data.y;
		
		while (global.level.checkSpriteCollision(newX, newY, []) != 0) {
			
			if (tries == 0) {
				newX = x - radius; 
				newY = y - radius;
			}
			else if (tries == 1) {
				newX = x; 
				newY = y - radius;
			}
			else if (tries == 2) {
				newX = x + radius; 
				newY = y - radius;
			}
			else if (tries == 3) {
				newX = x - radius; 
				newY = y;
			}
			else if (tries == 4) {
				newX = x + radius; 
				newY = y;
			}
			else if (tries == 5) {
				newX = x - radius; 
				newY = y + radius;
			}
			else if (tries == 6) {
				newX = x; 
				newY = y - radius;
			}
			else if (tries == 7) {
				newX = x + radius; 
				newY = y + radius;
			}
			
			tries++;

			if (tries == 9) {
				break;
			}
		}

		npc.setLocation(newX, newY);

		if (tries < 9) {
			npc.ai = new MeleeAI();
			global.level.spriteList.push(npc);	
			npc.broadcastState();
		}
	}
};

Summoner.prototype.getSpecialAIAbilityCooldown = function() {
	return 10000;
};
