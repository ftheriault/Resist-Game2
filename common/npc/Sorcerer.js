var Sprite = require('../Sprite');

module.exports = Sorcerer = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Sorcerer", "Sorcerer", 10 + parseInt(level * 2.5), 10 + parseInt(level * 2.5), 90, 90, 0.05 + level/500.0, [ new FireBolt(null, 1 + parseInt(level/3)) ], level * 16);		
		this.data.level = level;
	}
}

Sorcerer.prototype = new Sprite();
Sorcerer.prototype.constructor = Sorcerer;

Sorcerer.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["cloth-head", "leather-torso"], "staff");
}

Sorcerer.prototype.getDeathSound = function() {
	return  "goblin/goblin-" + Math.floor(Math.random() * 9 + 1) + ".mp3";
};

Sorcerer.prototype.digestMessage = function () {

}

Sorcerer.prototype.update = function () {

}
