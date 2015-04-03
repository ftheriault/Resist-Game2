var Sprite = require('../Sprite');

module.exports = Warrior = function() {

}

Warrior.prototype = new Sprite();

Warrior.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Warrior", 30, 30, 110, 110, 10, 10, 0.06);
}

Warrior.prototype.digestMessage = function () {

}

Warrior.prototype.update = function () {

}
