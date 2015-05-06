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

HealingPotion.prototype.getTooltip = function() {
	return "Healing potion";
}

HealingPotion.prototype.getActiveTooltipData = function() {
	return this.getHeal() + " healing points";
}

HealingPotion.prototype.getHeal = function() {
	return 40 + this.data.level * 5;
};

HealingPotion.prototype.update = function (fromSprite, delta) {

}

HealingPotion.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	fromSprite.heal(this.getHeal(), fromSprite);
	
	return true;
}