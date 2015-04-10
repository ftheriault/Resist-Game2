var Sprite = require('../Sprite');
var Slash = require('../action/Slash');

module.exports = Thief = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Thief", "Thief", 10 + level, 10 + level, 20, 20, 0.05 + level/500.0, [ new Slash(null, 1 + level) ], level * 10);		
		this.data.level = level;
	}
}

Thief.prototype = new Sprite();
Thief.prototype.constructor = Thief;

Thief.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["leather-pants"], "attack");
}

Thief.prototype.getDeathSound = function() {
	return null;
};

Thief.prototype.digestMessage = function () {

}

Thief.prototype.update = function () {

}
