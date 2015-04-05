var Action = require('./Action');

module.exports = FireBolt = function (data) {
	if (data == null) {
		Action.call(this, "fire-bolt", 3000);
	}
	else {
		Action.call(this, "fire-bolt", data.cooldown);
		this.data = data;
	}
}

FireBolt.prototype = new Action();
FireBolt.prototype.constructor = FireBolt;

FireBolt.prototype.update = function () {

}

FireBolt.prototype.triggerEvent = function (fromSprite) {
	// trigger action and send animation
}