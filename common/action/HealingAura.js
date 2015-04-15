var Action = require('./Action');

module.exports = HealingAura = function (data, level) {
	if (data == null) {
		Action.call(this, level, "aura-healing", 10000, 0);

		this.data.lastTime = 5000;
	}
	else {
		Action.call(this, data.level, "aura-healing", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
	this.data.passive = true;
}

HealingAura.prototype = new Action();
HealingAura.prototype.constructor = HealingAura;

HealingAura.prototype.getName = function () {
	return "Healing Aura";
}

HealingAura.prototype.update = function (fromSprite, delta) {
	if (global != null && global.level != null) {
		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggeredTime = (new Date()).getTime();
			this.propagate(fromSprite);
		}
	}
}

HealingAura.prototype.propagate = function(fromSprite) {
	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer == global.level.spriteList[i].data.isPlayer) {
			global.level.spriteList[i].heal(2 + this.data.level);
			global.level.spriteList[i].addModifier("MISC", 0, this.type, this.data.lastTime + 1000);
		}
	}
	
	this.data.triggered = true;
};

HealingAura.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	return true;
}