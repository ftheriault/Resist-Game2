var Sprite = require('../Sprite');

module.exports = Hunter = function() {

}

Hunter.prototype = new Sprite();

Hunter.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Hunter", 30, 30, 90, 50, 0.4);
}

Hunter.prototype.digestMessage = function () {

}

Hunter.prototype.update = function () {

}

Hunter.prototype.draw = function () {
	game.ctx.fillStyle = "red";
	game.ctx.fillRect(this.data.x, this.data.y, 20, 20);
}