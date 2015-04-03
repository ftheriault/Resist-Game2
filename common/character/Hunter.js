var Sprite = require('../Sprite');

module.exports = Hunter = function() {

}

Hunter.prototype = new Sprite();

Hunter.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Hunter", 30, 30, 90, 50, 0.04);
}

Hunter.prototype.digestMessage = function () {

}

Hunter.prototype.update = function () {

}
