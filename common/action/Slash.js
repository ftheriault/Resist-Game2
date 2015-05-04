var Action = require('./Action');

module.exports = Slash = function (data, level) {
	if (data == null) {
		Action.call(this, level, "slash", 1000, 20);
	}
	else {
		Action.call(this, data.level, "slash", data.cooldown, 20);
		this.data = data;
	}
}

Slash.prototype = new Action();
Slash.prototype.constructor = Slash;

Slash.prototype.getName = function () {
	return "Slash";
}

Slash.prototype.getTooltip = function() {
	return "Slashes sword";
}

Slash.prototype.update = function (fromSprite, delta) {

}

Slash.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (toSprite != null && fromSprite.data.isPlayer != toSprite.data.isPlayer) {
		toSprite.hit(3 + this.data.level, fromSprite, false);
		success = true;
	}

	return success;
}