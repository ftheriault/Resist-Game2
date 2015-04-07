module.exports = Action = function(type, cooldown, maxDistance, manaCost) {
	this.type = type;
	this.maxDistance = maxDistance;

	this.data = {};
	this.data.cooldown = cooldown;
	this.data.triggeredTime = 0;
	this.needTarget = true;

	if (manaCost == null) {
		manaCost = 0;
	}

	this.data.manaCost = manaCost;
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

		ctx.fillStyle = "white";
		ctx.font = "12px Arial";

		ctx.fillText("Level : " + this.data.level, x + 5, y + 10);

		if (this.data.manaCost > 0) {
			ctx.fillText("Mana cost : " + this.data.manaCost, x + 5, y + size - 5);			
		}
	}

	if (!this.isReady()) {
		var percent = ((new Date()).getTime() - this.data.triggeredTime * 1.0)/this.data.cooldown;
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(x, y + size * percent, size, size * (100 - percent));		
	}

	if (game.playerSprite.data.freeActionPoints > 0) {
		ctx.strokeStyle = "green";
	}
	else {
		ctx.strokeStyle = "white";
	}

	ctx.strokeRect(x, y, size, size);

}

Action.prototype.trigger = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (this.isReady()) {
		var distanceToTarget = 0;
		var attackRange = 0;

		if (toSprite != null) {
			distanceToTarget = fromSprite.distanceWith(toSprite);
			attackRange = toSprite.data.minDistance + this.maxDistance;
		}

		if (!this.needTarget || distanceToTarget < attackRange) {
			if (this.data.manaCost == 0 || fromSprite.data.mana - this.data.manaCost >= 0) {
				success = true;

				this.data.triggeredTime = (new Date()).getTime();
				this.triggerEvent(fromSprite, mouseX, mouseY, toSprite);
				fromSprite.data.mana -= this.data.manaCost;
				fromSprite.data.justAttacked = true;

				fromSprite.broadcastState();
			}
		}
	}

	return success;
}


