var Sprite = require('../Sprite');

module.exports = Hunter = function() {

}

Hunter.prototype = new Sprite();

Hunter.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Hunter", 90, 90, 50, 50, 0.07);
}

Hunter.prototype.digestMessage = function () {

}

Hunter.prototype.update = function () {

}
