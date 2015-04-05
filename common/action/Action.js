module.exports = Action = function(type, cooldown) {
	this.type = type;
	this.data = {};

	this.data.cooldown = cooldown;
	this.data.currentCooldown = 0;
}

Action.prototype.tick = function (delta) {
	this.update(delta);

	if (this.data.currentCooldown > 0) {
		this.data.currentCooldown -= delta;
	}
}

Action.prototype.trigger = function (fromSprite, mouseX, mouseY) {
	if (this.data.currentCooldown <= 0) {
		this.data.currentCooldown = this.data.cooldown;
		this.triggerEvent(fromSprite, mouseX, mouseY);
	}
}

