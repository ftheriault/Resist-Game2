var Action = require('./Action');

module.exports = Leech = function (data, level) {
	if (data == null) {
		Action.call(this, level, "leech", 6000, 10);
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "leech", data.cooldown, 10);
		this.data = data;
	}

	this.needTarget = false;
	this.animationTime = 300;
}

Leech.prototype = new Action();
Leech.prototype.constructor = Leech;

Leech.prototype.getName = function () {
	return "Leech";
}

Leech.prototype.getTooltip = function() {
	return "Leech life from surrounding enemies. The more the better. (AoE)";
}

Leech.prototype.getActiveTooltipData = function() {
	return this.getHeal() + " heal per enemy<br>" + this.getHit() + " damage per enemy<br/>";
}

Leech.prototype.getHit = function() {
	return 4 + this.data.level;
};

Leech.prototype.getHeal = function() {
	return 4 + this.data.level;
};

Leech.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 2 + 3 * this.data.level;
	this.data.distance = 60 + 2 * this.data.level;

	if (this.data.triggered && delta != null) {
		var now = (new Date()).getTime();

		if (global != null && global.level != null) {

		}
		else {		
			var percent = (now - this.data.triggeredTime * 1.0)/this.animationTime;

			percent = 1.0 - percent;

			if (percent + 0.2 > 1) {
				percent = 0.8;
			}

			if (percent < 0) {
				percent = 0.1;
			}

			degrade = game.ctx.createRadialGradient(this.data.x,
								   this.data.y,
								   (percent + 0.2) * this.data.distance,
								   this.data.x,
								   this.data.y,
								   percent * this.data.distance);  
			degrade.addColorStop(percent, 'rgba(200,0,0,0)');  
			degrade.addColorStop(percent + 0.05, 'rgba(50,0,00,' + (0.8 - percent)  +')');
			degrade.addColorStop(percent + 0.2, 'rgba(50,0,0,0)');  

			game.ctx.fillStyle = degrade;  
			game.ctx.fillRect(this.data.x - this.data.distance, this.data.y - this.data.distance, this.data.distance * 2, this.data.distance * 2);
		}

		if (this.data.triggeredTime + this.animationTime < now) {
			this.data.triggered = false;
		}
	}
}

Leech.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.x = fromSprite.data.x;
	this.data.y = fromSprite.data.y;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (fromSprite.distanceWith(global.level.spriteList[i]) < this.data.distance) {
				global.level.spriteList[i].hit(this.getHit(), fromSprite, false);
				fromSprite.heal(this.getHeal(), fromSprite);
			}
		}
	}

	this.data.triggered = true;

	return true;
}