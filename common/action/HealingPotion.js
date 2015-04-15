var Action = require('./Action');

module.exports = HealingPotion = function (data, level) {
	if (data == null) {
		Action.call(this, level, "healing-potion", 15000, 0);
	}
	else {
		Action.call(this, data.level, "healing-potion", data.cooldown);
		this.data = data;
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
	fromSprite.heal(40 + this.data.level * 5, fromSprite);
	
	return true;
}