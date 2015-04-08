var Action = require('./Action');

module.exports = HealingPotion = function (data, level) {
	if (data == null) {
		Action.call(this, "healing-potion", 10000, 0);
	}
	else {
		Action.call(this, "healing-potion", data.cooldown);
		this.data = data;
	}

	if (level != null) {
		this.data.level = level;
	}

	this.needTarget = false;
}

HealingPotion.prototype = new Action();
HealingPotion.prototype.constructor = HealingPotion;

HealingPotion.prototype.getName = function () {
	return "Healing Potion";
}

HealingPotion.prototype.update = function (fromSprite, delta) {

}

HealingPotion.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	fromSprite.heal(25 + this.data.level * 4, fromSprite);
	
	return true;
}