var Action = require('./Action');

module.exports = HealingPotion = function (data) {
	if (data == null) {
		Action.call(this, "healing-potion", 10000);
	}
	else {
		Action.call(this, "healing-potion", data.cooldown);
		this.data = data;
	}
}

HealingPotion.prototype = new Action();
HealingPotion.prototype.constructor = HealingPotion;

HealingPotion.prototype.update = function () {

}

HealingPotion.prototype.triggerEvent = function (fromSprite, mouseX, mouseY) {
	// trigger action and send animation
}