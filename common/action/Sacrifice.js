var Action = require('./Action');

module.exports = Sacrifice = function (data, level) {
	if (data == null) {
		Action.call(this, level, "sacrifice", 1000, 10);
	}
	else {
		Action.call(this, data.level, "sacrifice", data.cooldown, 10);
		this.data = data;
	}

}

Sacrifice.prototype = new Action();
Sacrifice.prototype.constructor = Sacrifice;

Sacrifice.prototype.getName = function () {
	return "Sacrifice";
}

Sacrifice.prototype.getTooltip = function() {
	return "Sacrifices health for killing power";
}

Sacrifice.prototype.getActiveTooltipData = function() {
	return this.getLeech() + " self damage<br>" + this.getHit() + " damage<br/>";
}

Sacrifice.prototype.getHit = function() {
	return 6 + this.data.level * 5;
};

Sacrifice.prototype.getLeech = function() {
	return this.data.level * 5;
};

Sacrifice.prototype.update = function (fromSprite, delta) {

}

Sacrifice.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (toSprite != null && fromSprite.data.isPlayer != toSprite.data.isPlayer) {
		toSprite.hit(this.getHit(), fromSprite);
		fromSprite.hit(this.getLeech(), false);
		success = true;
	}

	return success;
}