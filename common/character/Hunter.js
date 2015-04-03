var Sprite = require.main.require('./../common/Sprite');

module.exports = Hunter = function() {

}

Hunter.prototype = new Sprite();

Hunter.prototype.initPlayer = function () {
	this.build("HUNTER", 30, 30, 90, 50, 0.4);
}