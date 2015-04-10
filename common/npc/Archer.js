var Sprite = require('../Sprite');

module.exports = Archer = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Archer", "Archer", 20 + level/2, 20 + level/2, 20, 20, 0.04 + level/500.0, [ new Shoot(null, level) ], level * 10);		
		this.data.level = level;
	}
}

Archer.prototype = new Sprite();
Archer.prototype.constructor = Archer;

Archer.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["mail-head", "leather-pants"], "bow");
}

Archer.prototype.getDeathSound = function() {
	return  "monster/dead-" + Math.floor(Math.random() * 9 + 1) + ".mp3";
};

Archer.prototype.digestMessage = function () {

}

Archer.prototype.update = function () {

}
