var Sprite = require('../Sprite');

module.exports = Sorcerer = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Sorcerer", "Sorcerer", 30 + level/2, 30 + level/2, 90, 90, 0.05 + level/500.0, [ new FireBolt(null, 1 + level) ], level * 10);		
		this.data.level = level;
	}
}

Sorcerer.prototype = new Sprite();
Sorcerer.prototype.constructor = Sorcerer;

Sorcerer.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["cloth-head", "leather-torso"], "staff");
}

Sorcerer.prototype.getDeathSound = function() {
	return null;
};

Sorcerer.prototype.digestMessage = function () {

}

Sorcerer.prototype.update = function () {

}
