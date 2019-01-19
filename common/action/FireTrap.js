var Action = require('./Action');

module.exports = FireTrap = function (data, level) {
	if (data == null) {
		Action.call(this, level, "fire-trap", 10000, 100);

		this.data.speed = 1;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "fire-trap", data.cooldown, 100);
		this.data = data;
	}

	this.needTarget = false;
	this.data.animationTime = 10000;
}

FireTrap.prototype = new Action();
FireTrap.prototype.constructor = FireTrap;

FireTrap.prototype.getName = function () {
	return "Fire Trap";
}

FireTrap.prototype.getTooltip = function() {
	return "Lay a trap on the ground, exploding upon impact (AoE)";
}

FireTrap.prototype.getActiveTooltipData = function() {
	return this.getHit() + " damage<br/>";
}

FireTrap.prototype.getHit = function() {
	return 6 + this.data.level * 3;
};

FireTrap.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 15 + 3 * this.data.level;

	if (this.data.triggered && delta != null) {
		if (global != null && global.level != null) {
			if (this.data.triggeredState == 1) {
				for (var i = 0; i < global.level.spriteList.length; i++) {
					if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
						if (this.getDistance(this.data.x, this.data.y, global.level.spriteList[i].data.x, global.level.spriteList[i].data.y) < 40) {
							this.data.triggeredState = 2;
							this.data.triggeredTime = (new Date()).getTime();
							this.data.animationTime = 2000;
							fromSprite.broadcastState();
							break;
						}
					}
				}
			}
			else {
				for (var i = 0; i < global.level.spriteList.length; i++) {
					if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
						var distance = Math.sqrt(Math.pow(this.data.x - global.level.spriteList[i].data.x, 2) + Math.pow(this.data.y - global.level.spriteList[i].data.y, 2));

						if (distance < this.data.distance &&
							this.data.tmpAlreadyHit.indexOf(global.level.spriteList[i].data.id) == -1) {
							global.level.spriteList[i].hit(this.getHit(), fromSprite, false);
							this.data.tmpAlreadyHit.push(global.level.spriteList[i].data.id);
						}
					}
				}
			}
		}
		else {
			if (this.data.triggeredState == 1) {
				game.ctx.save();	
				game.ctx.beginPath();
				game.ctx.arc(this.data.x, this.data.y, 10, 0, 2 * Math.PI, false);
				game.ctx.globalAlpha = 0.5; 
				game.ctx.fillStyle = "black";
				game.ctx.fill();
				game.ctx.closePath();
				game.ctx.restore();
			}
			else {
				if (this.data.animationTime > 2000) {
					this.data.triggeredTime = (new Date()).getTime();
					this.data.animationTime = 2000;
				}
	
				game.ctx.save();	
				game.ctx.beginPath();
				game.ctx.arc(this.data.x, this.data.y, this.data.distance, 0, 2 * Math.PI, false);
				game.ctx.globalAlpha = 0.5; 
				game.ctx.fillStyle = lavaPattern;
				game.ctx.fill();
				game.ctx.closePath();
				game.ctx.restore();
			}
		}

		if (this.data.triggeredTime + this.data.animationTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

FireTrap.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.distance = 40 + 10 * this.data.level;
	this.data.x = mouseX;
	this.data.y = mouseY;
	this.data.triggered = true;
	this.data.triggeredState = 1;
	this.data.tmpAlreadyHit = [];
	this.data.animationTime = 10000 + 1000 * this.data.level;

	return true;
}