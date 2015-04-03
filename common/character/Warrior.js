var Sprite = require('../Sprite');

module.exports = Warrior = function() {

}

Warrior.prototype = new Sprite();

Warrior.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Warrior", 30, 30, 70, 50, 0.04);
}

Warrior.prototype.digestMessage = function () {

}

Warrior.prototype.update = function () {

}

Warrior.prototype.draw = function () {
	game.ctx.fillStyle = "blue";
	game.ctx.fillRect(this.data.x, this.data.y, 20, 20);
}