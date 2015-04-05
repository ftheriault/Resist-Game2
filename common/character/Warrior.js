var Sprite = require('../Sprite');
var Slash = require('../action/Slash');

module.exports = Warrior = function() {

}

Warrior.prototype = new Sprite();

Warrior.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Warrior", 110, 110, 10, 10, 0.06, [ new Slash(null, 1) ]);
}

Warrior.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["mail-head", "mail-feet", "mail-glove", "mail-torso", "mail-arm", "mail-pants"], "attack");
}


Warrior.prototype.digestMessage = function () {

}

Warrior.prototype.update = function () {

}
