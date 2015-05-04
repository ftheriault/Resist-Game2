var Action = require('./Action');

module.exports = SwiftAura = function (data, level) {
	if (data == null) {
		Action.call(this, level, "aura-swift", 10000, 0);

		this.data.lastTime = 5000;
	}
	else {
		Action.call(this, data.level, "aura-swift", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
	this.data.passive = true;
}

SwiftAura.prototype = new Action();
SwiftAura.prototype.constructor = SwiftAura;

SwiftAura.prototype.getName = function () {
	return "Swift Aura";
}

SwiftAura.prototype.getTooltip = function() {
	return "Increase running speed";
}

SwiftAura.prototype.update = function (fromSprite, delta) {
	if (global != null && global.level != null) {
		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggeredTime = (new Date()).getTime();
			this.propagate(fromSprite);
		}
	}
}

SwiftAura.prototype.propagate = function(fromSprite) {
	var incPercent = 0.0025 * this.data.level;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer == global.level.spriteList[i].data.isPlayer) {
			global.level.spriteList[i].addModifier("SPEED", incPercent, this.type, this.data.lastTime + 1000);
		}
	}
	
	this.data.triggered = true;
};

SwiftAura.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	return true;
}