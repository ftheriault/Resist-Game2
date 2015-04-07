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

Slash.prototype.getName = function () {
	return "Slash";
}

Slash.prototype.update = function (fromSprite, delta) {

}

Slash.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (toSprite != null && fromSprite.data.isPlayer != toSprite.data.isPlayer) {
		toSprite.hit(3 + this.data.level * 2, fromSprite);
		success = true;
	}

	return success;
}