var Action = require('./Action');

module.exports = MagicBolt = function (data) {
	if (data == null) {
		Action.call(this, "magic-bolt", 1000);
	}
	else {
		Action.call(this, "magic-bolt", data.cooldown);
		this.data = data;
	}
}

MagicBolt.prototype = new Action();
MagicBolt.prototype.constructor = MagicBolt;

MagicBolt.prototype.update = function () {

}

MagicBolt.prototype.triggerEvent = function (fromSprite) {
	// trigger action and send animation
}