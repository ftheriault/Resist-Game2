var Sprite = require('../Sprite');

module.exports = Priest = function() {

}

Priest.prototype = new Sprite();

Priest.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Priest", 70, 70, 50, 50, 0.04);
}

Priest.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["cloth-head", "cloth-torso"]);
}

Priest.prototype.digestMessage = function () {

}

Priest.prototype.update = function () {

}
