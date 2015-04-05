var Sprite = require('../Sprite');
var Shoot = require('../action/Shoot');

module.exports = Hunter = function() {

}

Hunter.prototype = new Sprite();

Hunter.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Hunter", 90, 90, 50, 50, 0.07, [ new Shoot(null, 1) ]);
}

Hunter.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["hair-head", "leather-feet", "leather-torso", "leather-pants"], "bow");
}

Hunter.prototype.digestMessage = function () {

}

Hunter.prototype.update = function () {

}
