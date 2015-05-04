var Action = require('./Action');

module.exports = Heal = function (data, level) {
	if (data == null) {
		Action.call(this, level, "heal", 5000, 700);
	}
	else {
		Action.call(this, data.level, "heal", data.cooldown, 700);
		this.data = data;
	}
}

Heal.prototype = new Action();
Heal.prototype.constructor = Heal;

Heal.prototype.getName = function () {
	return "Heal";
}

Heal.prototype.getTooltip = function() {
	return "Heal a friendly player";
}

Heal.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 15 + 2 * this.data.level;
}

Heal.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;
	
	if (fromSprite.data.isPlayer == toSprite.data.isPlayer) {
		toSprite.heal(40 + this.data.level * 5, fromSprite);
		success = true;
	}
	
	return success;
}