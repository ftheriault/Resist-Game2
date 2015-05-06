var Action = require('./Action');

module.exports = FireWell = function (data, level) {
	if (data == null) {
		Action.call(this, level, "fire-well", 8000, 100);

		this.data.speed = 1;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "fire-well", data.cooldown, 100);
		this.data = data;
	}

	this.needTarget = false;
	this.animationTime = 1000;
}

FireWell.prototype = new Action();
FireWell.prototype.constructor = FireWell;

FireWell.prototype.getName = function () {
	return "Fire Well";
}

FireWell.prototype.getTooltip = function() {
	return "Creates a big lava pit (AoE)";
}

FireWell.prototype.getActiveTooltipData = function() {
	return this.getDistance() + " distance <br>" + this.getHit() + " damage<br/>";
}

FireWell.prototype.getHit = function() {
	return 10 + this.data.level * 3;
};

FireWell.prototype.getDistance = function() {
	return 40 + 3 * this.data.level;
};

FireWell.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 15 + 3 * this.data.level;

	if (this.data.triggered && delta != null) {
		if (global != null && global.level != null) {

		}
		else {		
				game.ctx.save();	
				game.ctx.beginPath();
				game.ctx.arc(this.data.x, this.data.y, this.data.distance, 0, 2 * Math.PI, false);
				game.ctx.globalAlpha = 0.5; 
				game.ctx.fillStyle = lavaPattern;
				game.ctx.fill();
				game.ctx.closePath();
				game.ctx.restore();
		}

		if (this.data.triggeredTime + this.animationTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

FireWell.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.distance = this.getDistance();
	this.data.x = mouseX;
	this.data.y = mouseY;
	this.data.triggered = true;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (this.getDistance(this.data.x, this.data.y, global.level.spriteList[i].data.x, global.level.spriteList[i].data.y) < this.data.distance) {
				global.level.spriteList[i].hit(this.getHit(), fromSprite, true);
			}
		}
	}

	return true;
}