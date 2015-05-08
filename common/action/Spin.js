var Action = require('./Action');

module.exports = Spin = function (data, level) {
	if (data == null) {
		Action.call(this, level, "spin", 3000, 10);
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "spin", data.cooldown, 10);
		this.data = data;
	}

	this.needTarget = false;
	this.animationTime = 300;
}

Spin.prototype = new Action();
Spin.prototype.constructor = Spin;

Spin.prototype.getName = function () {
	return "Spin";
}

Spin.prototype.getTooltip = function() {
	return "Damaging all enemies in range (AoE)";
}

Spin.prototype.getActiveTooltipData = function() {
	return this.getSpellDistance() + " distance<br/>" + this.getHit() + " damage<br/>";
}

Spin.prototype.getHit = function() {
	return 4 + this.data.level * 3;
}

Spin.prototype.getSpellDistance = function() {
	return 60 + 2 * this.data.level;
}

Spin.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 2 + 3 * this.data.level;
	this.data.distance = this.getSpellDistance();

	if (this.data.triggered && delta != null) {
		var now = (new Date()).getTime();

		if (global != null && global.level != null) {

		}
		else {		
			var percent = (now - this.data.triggeredTime * 1.0)/this.animationTime;

			if (percent + 0.2 > 1) {
				percent = 0.8;
			}

			degrade = game.ctx.createRadialGradient(this.data.x,
								   this.data.y,
								   percent * this.data.distance,
								   this.data.x,
								   this.data.y,
								   (percent + 0.2) * this.data.distance);  
			degrade.addColorStop(percent, 'rgba(0,200,0,0)');  
			degrade.addColorStop(percent + 0.05, 'rgba(0,250,00,' + (0.8 - percent)  +')');
			degrade.addColorStop(percent + 0.2, 'rgba(0,50,0,0)');  

			game.ctx.fillStyle = degrade;  
			game.ctx.fillRect(this.data.x - this.data.distance, this.data.y - this.data.distance, this.data.distance * 2, this.data.distance * 2);
		}

		if (this.data.triggeredTime + this.animationTime < now) {
			this.data.triggered = false;
		}
	}
}

Spin.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.x = fromSprite.data.x;
	this.data.y = fromSprite.data.y;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (fromSprite.distanceWith(global.level.spriteList[i]) < this.data.getDistance) {
				global.level.spriteList[i].hit(this.getHit(), fromSprite, false);
			}
		}
	}

	this.data.triggered = true;

	return true;
}