var Sprite = require('../Sprite');

module.exports = Mage = function() {

}

Mage.prototype = new Sprite();

Mage.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Mage", 30, 30, 90, 50, 0.04);
}

Mage.prototype.digestMessage = function () {

}

Mage.prototype.update = function () {

}
