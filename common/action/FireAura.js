var Action = require('./Action');

module.exports = FireAura = function (data, level) {
	if (data == null) {
		Action.call(this, level, "aura-fire", 10000, 0);

		this.data.lastTime = 5000;
	}
	else {
		Action.call(this, data.level, "aura-fire", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
	this.data.passive = true;
}

FireAura.prototype = new Action();
FireAura.prototype.constructor = FireAura;

FireAura.prototype.getName = function () {
	return "Fire Aura";
}

FireAura.prototype.getTooltip = function() {
	return "Fire Aura<br/>+1 hit per level";
}

FireAura.prototype.update = function (fromSprite, delta) {
	if (global != null && global.level != null) {
		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggeredTime = (new Date()).getTime();
			this.propagate(fromSprite);
		}
	}
}

FireAura.prototype.propagate = function(fromSprite) {
	fromSprite.addModifier("MISC", 0, this.type, this.data.lastTime + 1000);
	var distance = 100 + 3 * this.data.level;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (fromSprite.distanceWith(global.level.spriteList[i]) < distance) {
				global.level.spriteList[i].hit(this.data.level, fromSprite, true);
			}
		}
	}
	
	this.data.triggered = true;
};

FireAura.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	return true;
}