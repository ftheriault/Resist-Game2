var Action = require('./Action');

module.exports = Shoot = function (data, level) {
	if (data == null) {
		Action.call(this, level, "shoot", 2000, 700);

		this.data.angle = 0;
		this.data.speed = 0.8;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "shoot", data.cooldown, 700);
		this.data = data;
	}
}

Shoot.prototype = new Action();
Shoot.prototype.constructor = Shoot;

Shoot.prototype.getName = function () {
	return "Shoot";
}

Shoot.prototype.getTooltip = function() {
	return "Shoots an arrow";
}

Shoot.prototype.getActiveTooltipData = function() {
	return this.getHit() + " damage<br/>";
}

Shoot.prototype.getHit = function() {
	return 4 + this.data.level * 3;
}

Shoot.prototype.update = function (fromSprite, delta) {
	if (!fromSprite.data.isPlayer) {
		this.maxDistance = 300;
	}
	
	if (this.data.triggered && delta != null) {

		this.moveProjectile(delta);

		if (global != null && global.level != null) {
			for (var i = 0; i < global.level.spriteList.length; i++) {
				if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
					var distance = Math.sqrt(Math.pow(this.data.x - global.level.spriteList[i].data.x, 2) + Math.pow(this.data.y - global.level.spriteList[i].data.y, 2));

					if (distance < global.level.spriteList[i].data.minDistance) {
						global.level.spriteList[i].hit(this.getHit(), fromSprite, false);
						
						this.data.triggered = false;
						fromSprite.broadcastState();
						break;
					}
				}
			}
		}
		else {
			game.ctx.beginPath();
		    game.ctx.arc(this.data.x, this.data.y, 4, 0, 2 * Math.PI, false);
			game.ctx.fillStyle = "brown";
		    game.ctx.fill();
		    game.ctx.closePath();
		}

		if (this.data.triggeredTime + 500 < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

Shoot.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = false;

	if (fromSprite.data.isPlayer != toSprite.data.isPlayer) {
		success = true;
		this.data.triggered = true;

		this.data.angle = (Math.PI/180) * this.getAngle(fromSprite.data.x, fromSprite.data.y, toSprite.data.x, toSprite.data.y);
		this.data.x = fromSprite.data.x;
		this.data.y = fromSprite.data.y;
	}

	return success;
}
