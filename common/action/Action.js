module.exports = Action = function(level, type, cooldown, maxDistance, manaCost) {
	this.type = type;
	this.maxDistance = maxDistance;

	this.data = {};
	this.data.cooldown = cooldown;
	this.data.triggeredTime = 0;
	this.needTarget = true;
	this.data.passive = false;

	if (manaCost == null) {
		manaCost = 0;
	}

	this.data.level = level;

	this.data.manaCost = manaCost;
}

Action.prototype.getTooltip = function() {
	return "";
}

Action.prototype.isReady = function() {
	return this.data.triggeredTime + this.data.cooldown < (new Date()).getTime();
}

Action.prototype.getDistance = function (x, y, x2, y2) {
	return  Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
}

Action.prototype.moveProjectile = function(delta) {
	if (this.data.angle < Math.PI/2) {
		this.data.x += Math.sin(this.data.angle) * (this.data.speed * delta);
		this.data.y -= Math.cos(this.data.angle) * (this.data.speed * delta);
	}
	else if (this.data.angle < Math.PI) {
		this.data.x += Math.sin(this.data.angle) * (this.data.speed * delta);
		this.data.y -= Math.cos(this.data.angle) * (this.data.speed * delta);
	}
	else if (this.data.angle < Math.PI + Math.PI/2) {
		this.data.x += Math.sin(this.data.angle) * (this.data.speed * delta);
		this.data.y -= Math.cos(this.data.angle) * (this.data.speed * delta);
	}
	else {
		this.data.x += Math.sin(this.data.angle) * (this.data.speed * delta);
		this.data.y -= Math.cos(this.data.angle) * (this.data.speed * delta);
	}
};

Action.prototype.getAngle = function(x1, y1, x2, y2) {
	var adj = x2 - x1;
	var opp = y2 - y1;
	
	var angle = Math.abs(Math.atan(opp/adj) * 180/Math.PI);
	
	if (adj > 0 && opp < 0 ) {
		angle = 90 - angle;
	}
	else if (adj >= 0 && opp >= 0) {
		angle += 90;
	}
	else if (adj < 0 && opp >= 0) {
		angle = 180 + (90 - angle);
	}
	else {
		angle += 270;
	}
	
	return angle;
}

Action.prototype.tick = function (fromSprite, delta) {
	if (this.data.level > 0) {
		if (this.data.justTriggered) {
			this.data.triggeredTime = (new Date()).getTime();
		}

		this.update(fromSprite, delta);
	}

	this.data.justTriggered = false;
}

Action.prototype.draw = function (ctx, x, y, size, over) {
	if (this.image == null) {
		this.image = new Image();
		this.image.src = "images/actions/" + this.type + ".png";
	}

	if (this.image.complete) {
		ctx.drawImage(this.image, x, y, size, size);

		ctx.fillStyle = "white";

		ctx.font = "11px Arial";
		ctx.fillText(this.getName(), x + 5, y + 15);

		ctx.font = "10px Arial";
		ctx.fillText("Level : " + this.data.level, x + 5, y + 30);

		if (this.data.passive) {
			ctx.fillText("Passive", x + 5, y + size - 5);			
		}
		else if (this.data.manaCost > 0) {
			ctx.fillText("Mana cost : " + this.data.manaCost, x + 5, y + size - 5);			
		}
	}

	if (game.playerSprite.data.mana < this.data.manaCost || this.data.level == 0) {
		var percent = 0;
		ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
		ctx.fillRect(x, y + size * percent, size, size * (100 - percent));		
	}
	else if (!this.isReady() && !this.data.passive) {
		var percent = ((new Date()).getTime() - this.data.triggeredTime * 1.0)/this.data.cooldown;
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(x, y + size * percent, size, size * (100 - percent));		
	}

	if (game.playerSprite.data.freeActionPoints > 0) {
		ctx.strokeStyle = "green";
		ctx.lineWidth = 4;
	}
	else {
		ctx.strokeStyle = "white";
	}

	ctx.strokeRect(x, y, size, size);
	ctx.lineWidth = 1;
}

Action.prototype.trigger = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (this.isReady() && this.data.level > 0 && !this.data.passive) {
		var distanceToTarget = 0;
		var attackRange = 0;

		if (toSprite != null) {
			distanceToTarget = fromSprite.distanceWith(toSprite);
			attackRange = toSprite.data.minDistance + this.maxDistance;
		}

		if (!this.needTarget || distanceToTarget < attackRange) {
			if (this.data.manaCost == 0 || fromSprite.data.mana - this.data.manaCost >= 0) {
				success = this.triggerEvent(fromSprite, mouseX, mouseY, toSprite);

				if (success) {
					this.data.justTriggered = true;
					fromSprite.data.mana -= this.data.manaCost;
					fromSprite.data.justAttacked = true;

					fromSprite.broadcastState();
				}
			}
		}
	}

	return success;
}


