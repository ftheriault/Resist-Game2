var Action = require('./Action');

module.exports = Slash = function (data, level) {
	if (data == null) {
		Action.call(this, "slash", 1000, 10);
	}
	else {
		Action.call(this, "slash", data.cooldown, 10);
		this.data = data;
	}

	if (level != null) {
		this.data.level = level;
	}
}

Slash.prototype = new Action();
Slash.prototype.constructor = Slash;

Slash.prototype.update = function () {

}

Slash.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	// trigger action and send animation
}