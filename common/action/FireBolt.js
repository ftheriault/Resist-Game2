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

FireBolt.prototype.getName = function () {
	return "Fire Bolt";
}

FireBolt.prototype.update = function (delta) {

}

FireBolt.prototype.triggerEvent = function (fromSprite, mouseX, mouseY) {
	// trigger action and send animation
}