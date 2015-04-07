var Action = require('./Action');

module.exports = Sacrifice = function (data, level) {
	if (data == null) {
		Action.call(this, "sacrifice", 1000, 10);
	}
	else {
		Action.call(this, "sacrifice", data.cooldown, 10);
		this.data = data;
	}

	if (level != null) {
		this.data.level = level;
	}
}

Sacrifice.prototype = new Action();
Sacrifice.prototype.constructor = Sacrifice;

Sacrifice.prototype.getName = function () {
	return "Sacrifice";
}

Sacrifice.prototype.update = function (delta) {

}

Sacrifice.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	if (toSprite != null && fromSprite.data.isPlayer != toSprite.data.isPlayer) {
		toSprite.hit(6 + this.data.level * 4, fromSprite);
		fromSprite.hit(this.data.level + parseInt(fromSprite.data.life * 0.1));
	}
}