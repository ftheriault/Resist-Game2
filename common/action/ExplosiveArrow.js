var Action = require('./Action');

module.exports = ExplosiveArrow = function (data, level) {
	if (data == null) {
		Action.call(this, level, "explosive-arrow", 4000, 700);

		this.data.angle = 0;
		this.data.speed = 0.8;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "explosive-arrow", data.cooldown, 700);
		this.data = data;
	}
}

ExplosiveArrow.prototype = new Action();
ExplosiveArrow.prototype.constructor = ExplosiveArrow;

ExplosiveArrow.prototype.getName = function () {
	return "Explosive Arrow";
}

ExplosiveArrow.prototype.getTooltip = function() {
	return "Arrow that explodes upon impact (AoE)";
}

ExplosiveArrow.prototype.getActiveTooltipData = function() {
	return this.getArrowHit() + " arrow damage<br/>" + this.getExplosionHit() + " exploding damage<br/>";
}

ExplosiveArrow.prototype.getArrowHit = function() {
	return 3 + this.data.level * 2;
}

ExplosiveArrow.prototype.getExplosionHit = function() {
	return 5 + this.data.level * 2;
}

ExplosiveArrow.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 4 + this.data.level * 4;

	if (this.data.triggered && delta != null) {

		if (global != null && global.level != null) {
			if (this.data.triggeredState == 1) {
				this.moveProjectile(delta);

				for (var i = 0; i < global.level.spriteList.length; i++) {
					if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
						var distance = Math.sqrt(Math.pow(this.data.x - global.level.spriteList[i].data.x, 2) + Math.pow(this.data.y - global.level.spriteList[i].data.y, 2));

						if (distance < global.level.spriteList[i].data.minDistance) {
							global.level.spriteList[i].hit(this.getArrowHit(), fromSprite, false);
							this.data.triggeredState = 2;
							fromSprite.broadcastState();
						}
					}
				}
			}
			else if (this.data.triggeredState == 2) {
				this.data.triggeredState = 3;

				for (var i = 0; i < global.level.spriteList.length; i++) {
					if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
						if (this.getDistance(this.data.x, this.data.y, global.level.spriteList[i].data.x, global.level.spriteList[i].data.y) < this.data.distance) {
							global.level.spriteList[i].hit(this.getExplosionHit(), fromSprite, false);
						}
					}
				}
			}
		}
		else {
			if (this.data.triggeredState == 1) {
				this.moveProjectile(delta);
				
				game.ctx.beginPath();
		    	game.ctx.arc(this.data.x, this.data.y, 4, 0, 2 * Math.PI, false);
				game.ctx.fillStyle = "brown";
		    	game.ctx.fill();
		    	game.ctx.closePath();
		    }
		    else {
				game.ctx.save();	
				game.ctx.beginPath();
				game.ctx.arc(this.data.x, this.data.y, this.data.distance * 0.8, 0, 2 * Math.PI, false);
				game.ctx.globalAlpha = 0.2; 
				game.ctx.fillStyle = lavaPattern;
				game.ctx.fill();
				game.ctx.closePath();
				game.ctx.restore();
		    }
		}

		if (this.data.triggeredTime + 500 < (new Date()).getTime() && this.data.triggeredState == 1) {
			this.data.triggered = false;
		}
		else if (this.data.triggeredTime + 1000 < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

ExplosiveArrow.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (fromSprite.data.isPlayer != toSprite.data.isPlayer) {
		success = true;

		this.data.distance = 50 + 3 * this.data.level;
		this.data.triggered = true;
		this.data.triggeredState = 1;

		this.data.angle = (Math.PI/180) * this.getAngle(fromSprite.data.x, fromSprite.data.y, toSprite.data.x, toSprite.data.y);
		this.data.x = fromSprite.data.x;
		this.data.y = fromSprite.data.y;
	}

	return success;
}
