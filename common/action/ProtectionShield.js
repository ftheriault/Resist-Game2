var Action = require('./Action');

module.exports = ProtectionShield = function (data, level) {
	if (data == null) {
		Action.call(this, level, "protection-shield", 10000, 0);

		this.data.lastTime = 2000;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "protection-shield", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
}

ProtectionShield.prototype = new Action();
ProtectionShield.prototype.constructor = ProtectionShield;

ProtectionShield.prototype.getName = function () {
	return "Active Shield";
}

ProtectionShield.prototype.getTooltip = function() {
	return "Creates an impenetrable shield";
}

ProtectionShield.prototype.getActiveTooltipData = function() {
	return "last " + parseInt(this.getLastTime()/1000) + " seconds";
}

ProtectionShield.prototype.getLastTime = function () {
	return 3000 + this.data.level * 500;
}

ProtectionShield.prototype.update = function (fromSprite, delta) {
	this.data.cooldown = 15000 - this.data.level * 500;
	this.data.manaCost = 5 + this.data.level * 1;
	this.data.lastTime = this.getLastTime();

	if (this.data.triggered) {
		if (global != null && global.level != null) {

		}
		else {
			game.ctx.beginPath();
		    game.ctx.arc(fromSprite.data.x, fromSprite.data.y, fromSprite.data.minDistance * 1.2, 0, 2 * Math.PI, false);
			game.ctx.fillStyle = "rgba(0, 155, 0, 0.4)";
		    game.ctx.fill();
		    game.ctx.closePath();
		}

		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}

}

ProtectionShield.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	fromSprite.addModifier("INVULNERABLE", 0, this.type, this.data.lastTime);
	this.data.triggered = true;
	
	return true;
}