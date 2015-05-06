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

Slash.prototype.getActiveTooltipData = function() {
	return this.getHit() + " damage<br/>";
}

Slash.prototype.getHit = function() {
	return 4 + this.data.level * 2;
}

Slash.prototype.update = function (fromSprite, delta) {

}

Slash.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (toSprite != null && fromSprite.data.isPlayer != toSprite.data.isPlayer) {
		toSprite.hit(this.getHit(), fromSprite, false);
		success = true;
	}

	return success;
}