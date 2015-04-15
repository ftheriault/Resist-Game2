var Sprite = require('../Sprite');
var Slash = require('../action/Slash');

module.exports = Thief = function(level) {
	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Thief", "Thief", 10 + parseInt(level * 2.5), 10 + parseInt(level * 2.5), 20, 20, 0.05 + level/500.0, [ new Slash(null, 1 + level) ], level * 13);		
		this.data.level = level;
	}
}

Thief.prototype = new Sprite();
Thief.prototype.constructor = Thief;

Thief.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["leather-pants"], "attack");
}

Thief.prototype.getDeathSound = function() {
	return  "goblin/goblin-" + Math.floor(Math.random() * 9 + 1) + ".mp3";
};

Thief.prototype.digestMessage = function () {

}

Thief.prototype.update = function () {

}
