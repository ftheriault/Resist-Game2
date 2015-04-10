var Sprite = require('../Sprite');
var Slash = require('../action/Slash');

module.exports = Skeleton = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Skeleton", "Skeleton", 10 + level/2, 10 + level/2, 20, 20, 0.04 + level/500.0, [ new Slash(null, level) ], level * 10);		
		this.data.level = level;
	}
}

Skeleton.prototype = new Sprite();
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.loadUI = function() {	
	if (this.data.level % 2 == 1) {
		this.spriteUI = new SpriteUI("skeleton", [], "attack");
	}
	else {
		this.spriteUI = new SpriteUI("skeleton", ["leather-pants"], "attack");
	}
}

Skeleton.prototype.getDeathSound = function() {
	return  "monster/dead-" + Math.floor(Math.random() * 9 + 1) + ".mp3";
};

Skeleton.prototype.digestMessage = function () {

}

Skeleton.prototype.update = function () {

}
