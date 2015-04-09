var Action = require('./Action');

module.exports = Spin = function (data, level) {
	if (data == null) {
		Action.call(this, level, "spin", 3000, 10);
	}
	else {
		Action.call(this, data.level, "spin", data.cooldown, 10);
		this.data = data;
	}

	this.needTarget = false;
}

Spin.prototype = new Action();
Spin.prototype.constructor = Spin;

Spin.prototype.getName = function () {
	return "Spin";
}

Spin.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 2 + 1 * this.data.level;
}

Spin.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var distance = 60 + 2 * this.data.level;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (fromSprite.distanceWith(global.level.spriteList[i]) < distance) {
				global.level.spriteList[i].hit(4 + this.data.level * 1, fromSprite, false);
			}
		}
	}

	return true;
}