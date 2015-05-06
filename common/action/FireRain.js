var Action = require('./Action');

module.exports = FireRain = function (data, level) {
	if (data == null) {
		Action.call(this, level, "fire-rain", 15000, 0);
	}
	else {
		Action.call(this, data.level, "fire-rain", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
	this.data.lastTime = 20;
}

FireRain.prototype = new Action();
FireRain.prototype.constructor = FireRain;

FireRain.prototype.getName = function () {
	return "Fire Rain";
}

FireRain.prototype.getTooltip = function() {
	return "Deadly rain, burning enemies (AoE)";
}

FireRain.prototype.getActiveTooltipData = function() {
	return this.getHit() + " damage<br/>";
}

FireRain.prototype.getHit = function() {
	return 6 + parseInt(this.data.level * 1.5);
};

FireRain.prototype.update = function (fromSprite, delta) {
	this.data.cooldown = 15000 - this.data.level * 250;
	this.data.manaCost = 30 + this.data.level * 20;

	if (this.data.cooldown < 6000) {
		this.data.cooldown = 6000;		
	}

	if (this.data.triggered && delta != null) {
		if (global != null && global.level != null) {
		}
		else {
			createRedFlies();
		}

		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

FireRain.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.x = mouseX;
	this.data.y = mouseY;
	this.data.triggered = true;
	var amount = this.getHit();

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			global.level.spriteList[i].hit(amount, fromSprite, true);
		}
	}

	return true;
}