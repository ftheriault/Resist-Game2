var Sprite = require('../Sprite');
var Slash = require('../action/Slash');

module.exports = Thief = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Thief", "Thief", 30 + level/2, 30 + level/2, 20, 20, 0.05 + level/100.0, [ new Slash(null, 1 + level) ], level * 10);		
		this.data.level = level;
	}
}

Thief.prototype = new Sprite();
Thief.prototype.constructor = Thief;

Thief.prototype.loadUI = function() {	
	if (this.data.level == 1) {
		this.spriteUI = new SpriteUI("human", ["leather-pants"], "attack");
	}
	else if (this.data.level == 2) {
		this.spriteUI = new SpriteUI("human", ["leather-pants"], "attack");
	}
}

Thief.prototype.getDeathSound = function() {
	return null;
};

Thief.prototype.digestMessage = function () {

}

Thief.prototype.update = function () {

}
