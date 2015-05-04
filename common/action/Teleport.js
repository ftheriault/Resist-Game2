var Action = require('./Action');

module.exports = Teleport = function (data, level) {
	if (data == null) {
		Action.call(this, level, "teleport", 10000, 0);
	}
	else {
		Action.call(this, data.level, "teleport", data.cooldown);
		this.data = data;
	}

	if (level != null) {
		this.data.level = level;
	}

	this.needTarget = false;
}

Teleport.prototype = new Action();
Teleport.prototype.constructor = Teleport;

Teleport.prototype.getName = function () {
	return "Teleport";
}

Teleport.prototype.getTooltip = function() {
	return "Teleports mage to wanted location";
}

Teleport.prototype.update = function (fromSprite, delta) {
	this.data.cooldown = 10000 - this.data.level * 500;
	this.data.manaCost = 25 - this.data.level * 2;

	if (this.data.cooldown < 5000) {
		this.data.cooldown = 5000;		
	}

	if (this.data.manaCost < 5) {
		this.data.manaCost = 5;
	}
}

Teleport.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (global.level.getWalkableCost(mouseX, mouseY, [], true) == 0) {
		success = true;
		fromSprite.setLocation(mouseX, mouseY);
		fromSprite.broadcastState();
	}
	
	return success;
}