var Sprite = require('../Sprite');
var SwiftAura = require('../action/SwiftAura');
var Slash = require('../action/Slash');

module.exports = Giant = function(level) {
	this.scale = 1.5;

	if (level != null && global != null) {
		this.build(false, global.spriteId++, "Giant", "Giant", 10 + parseInt(level * 2.5), 10 + parseInt(level * 2.5), 20, 20, 0.04 + level/500.0, [ new Slash(null, parseInt(level/2)), new SwiftAura(null, parseInt(level/2)) ], level * 10);		
		this.data.level = level;
		this.data.minDistance = 40 * this.scale;
	}
}

Giant.prototype = new Sprite();
Giant.prototype.constructor = Giant;

Giant.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["leather-pants"], "attack", this.scale);
}

Giant.prototype.getDeathSound = function() {
	return  "monster/dead-" + Math.floor(Math.random() * 9 + 1) + ".mp3";
};

Giant.prototype.digestMessage = function () {

}

Giant.prototype.update = function () {

}
