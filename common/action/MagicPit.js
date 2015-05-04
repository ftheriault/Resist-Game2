var Action = require('./Action');

module.exports = MagicPit = function (data, level) {
	if (data == null) {
		Action.call(this, level, "magic-pit", 10000, 0);
	}
	else {
		Action.call(this, data.level, "magic-pit", data.cooldown);
		this.data = data;
	}

	this.needTarget = false;
	this.data.lastTime = 0;
}

MagicPit.prototype = new Action();
MagicPit.prototype.constructor = MagicPit;

MagicPit.prototype.getName = function () {
	return "Magic Pit";
}

MagicPit.prototype.getTooltip = function() {
	return "Creates a magic pit, slowing and damaging enemies (AoE)";
}

MagicPit.prototype.update = function (fromSprite, delta) {
	this.data.cooldown = 10000 - this.data.level * 500;
	this.data.manaCost = 20 + this.data.level * 3;
	this.data.lastTime = 2000 + this.data.level * 500;

	if (this.data.cooldown < 3000) {
		this.data.cooldown = 3000;		
	}

	if (this.data.triggered && delta != null) {
		if (global != null && global.level != null) {

		}
		else {		
			game.ctx.save();	
			game.ctx.beginPath();
			game.ctx.arc(this.data.x, this.data.y, this.data.distance, 0, 2 * Math.PI, false);
			game.ctx.globalAlpha = 0.5; 
			game.ctx.fillStyle = sandPattern;
			game.ctx.fill();
			game.ctx.closePath();
			game.ctx.restore();
		}

		if (this.data.triggeredTime + this.data.lastTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

MagicPit.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.distance = 60 + 15 * this.data.level;
	this.data.x = mouseX;
	this.data.y = mouseY;
	this.data.triggered = true;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (this.getDistance(this.data.x, this.data.y, global.level.spriteList[i].data.x, global.level.spriteList[i].data.y) < this.data.distance) {
				global.level.spriteList[i].addModifier("SPEED", -global.level.spriteList[i].getSpeed() * 0.8, this.type, this.data.lastTime);
				global.level.spriteList[i].hit(4 + this.data.level * 2, fromSprite, true);
			}
		}
	}

	return true;
}