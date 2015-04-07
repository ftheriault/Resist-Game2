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

HealingPotion.prototype.update = function () {

}

HealingPotion.prototype.triggerEvent = function (fromSprite, mouseX, mouseY) {
	fromSprite.heal(30 + this.data.level * 4, fromSprite);
}