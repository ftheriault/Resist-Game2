var Action = require('./Action');

module.exports = DefenseAura = function (data, level) {
	if (data == null) {
		Action.call(this, level, "aura-defense", 10000, 0);

		this.data.lastTime = 5000;
	}
	else {
		Action.call(this, data.level, "aura-defense", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
	this.data.passive = true;
}

DefenseAura.prototype = new Action();
DefenseAura.prototype.constructor = DefenseAura;

DefenseAura.prototype.getTooltip = function() {
	return "Protection Aura<br/>+1 armor per level";
}

DefenseAura.prototype.getActiveTooltipData = function() {
	return "+" + this.getDefBonus() + " armor";
}

DefenseAura.prototype.getDefBonus = function () {
	return this.data.level;
}

DefenseAura.prototype.getName = function () {
	return "Defense Aura";
}

DefenseAura.prototype.update = function (fromSprite, delta) {
	if (global != null && global.level != null) {
		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggeredTime = (new Date()).getTime();
			this.propagate(fromSprite);
		}
	}
}

DefenseAura.prototype.propagate = function(fromSprite) {
	var inc = this.getDefBonus();

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer == global.level.spriteList[i].data.isPlayer) {
			global.level.spriteList[i].addModifier("ARMOR", inc, this.type, this.data.lastTime + 1000);
		}
	}
	
	this.data.triggered = true;
};

DefenseAura.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	return true;
}