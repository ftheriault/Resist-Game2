var Sprite = require.main.require('./../common/Sprite');

module.exports = Warrior = function() {

}

Warrior.prototype = new Sprite();

Warrior.prototype.initPlayer = function () {
	this.build("WARRIOR", 30, 30, 70, 50, 0.4);
}