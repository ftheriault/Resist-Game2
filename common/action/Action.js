module.exports = Action = function(type, cooldown) {
	this.type = type;
	this.data = {};

	this.data.cooldown = cooldown;
	this.data.currentCooldown = 0;
}

Action.prototype.tick = function (delta) {
	if (this.data.currentCooldown > 0) {
		this.data.currentCooldown -= delta;
	}

	this.update(delta);
}

Action.prototype.draw = function (ctx, x, y, size) {
	if (this.image == null) {
		this.image = new Image();
		this.image.src = "images/actions/" + this.type + ".png";
	}

	if (this.image.complete) {
		ctx.drawImage(this.image, x, y, size, size);
	}

	if (this.data.currentCooldown > 0) {
		var percent = (this.data.cooldown * 1.0 - this.data.currentCooldown)/this.data.cooldown;
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(x, y + size * percent, size, size * (100 - percent));		
	}

	ctx.strokeStyle = "white";
	ctx.strokeRect(x, y, size, size);

}

Action.prototype.trigger = function (fromSprite, mouseX, mouseY) {
	if (this.data.currentCooldown <= 0) {
		this.data.currentCooldown = this.data.cooldown;
		this.triggerEvent(fromSprite, mouseX, mouseY);

		// send information to client (the action, which contains cooldown, animation ,etc.)
	}
}

