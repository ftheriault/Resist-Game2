var Sprite = require('../Sprite');
var Slash = require('../action/Slash');

module.exports = Skeleton = function() {

}

Skeleton.prototype = new Sprite();
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("skeleton", [], "attack");
}

Skeleton.prototype.digestMessage = function () {

}

Skeleton.prototype.update = function () {

}
