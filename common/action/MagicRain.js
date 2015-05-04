var Action = require('./Action');

module.exports = MagicRain = function (data, level) {
	if (data == null) {
		Action.call(this, level, "magic-rain", 15000, 0);
	}
	else {
		Action.call(this, data.level, "magic-rain", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
	this.data.lastTime = 20;
}

MagicRain.prototype = new Action();
MagicRain.prototype.constructor = MagicRain;

MagicRain.prototype.getName = function () {
	return "Magic Rain";
}

MagicRain.prototype.getTooltip = function() {
	return "Healing heroes and damaging enemies (AoE)";
}

MagicRain.prototype.update = function (fromSprite, delta) {
	this.data.cooldown = 15000 - this.data.level * 500;
	this.data.manaCost = 30 + this.data.level * 5;

	if (this.data.cooldown < 6000) {
		this.data.cooldown = 6000;		
	}

	if (this.data.triggered && delta != null) {
		if (global != null && global.level != null) {
		}
		else {
			createFlies();
		}

		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

MagicRain.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.x = mouseX;
	this.data.y = mouseY;
	this.data.triggered = true;
	var amount = 4 + parseInt(this.data.level);

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			global.level.spriteList[i].hit(amount, fromSprite, true);
		}
		else {
			global.level.spriteList[i].heal(amount * 2, fromSprite);
		}
	}

	return true;
}