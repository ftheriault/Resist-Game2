module.exports = Action = function(type, cooldown) {
	this.type = type;
	this.data = {};

	this.data.cooldown = cooldown;
	this.data.triggeredTime = 0;
}

Action.prototype.isReady = function() {
	return this.data.triggeredTime + this.data.cooldown < (new Date()).getTime();
}

Action.prototype.tick = function (delta) {
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

	if (!this.isReady()) {
		var percent = ((new Date()).getTime() - this.data.triggeredTime * 1.0)/this.data.cooldown;
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(x, y + size * percent, size, size * (100 - percent));		
	}

	ctx.strokeStyle = "white";
	ctx.strokeRect(x, y, size, size);

}

Action.prototype.trigger = function (fromSprite, mouseX, mouseY) {
	if (this.isReady()) {
		this.data.triggeredTime = (new Date()).getTime();
		this.triggerEvent(fromSprite, mouseX, mouseY);
		
		fromSprite.data.justAttacked = true;
		fromSprite.broadcastState();
	}
}


