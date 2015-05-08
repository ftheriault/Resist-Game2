var Action = require('./Action');

module.exports = FrostNova = function (data, level) {
	if (data == null) {
		Action.call(this, level, "frost-nova", 10000, 100);

		this.data.speed = 1;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "frost-nova", data.cooldown, 100);
		this.data = data;
	}

	this.needTarget = false;
	this.animationTime = 500;
}

FrostNova.prototype = new Action();
FrostNova.prototype.constructor = FrostNova;

FrostNova.prototype.getName = function () {
	return "Frost Nova";
}

FrostNova.prototype.getTooltip = function() {
	return "Hits and freeze enemy movements (AoE)";
}

FrostNova.prototype.getActiveTooltipData = function() {
	return this.getSpellDistance() + " distance <br>" + this.getHit() + " damage<br/>";
}

FrostNova.prototype.getHit = function() {
	return 4 + this.data.level * 2;
};

FrostNova.prototype.getSpellDistance = function() {
	return 100 + 10 * this.data.level;
};

FrostNova.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 10 + 3 * this.data.level;

	if (this.data.triggered && delta != null) {
		if (global != null && global.level != null) {

		}
		else {
		
			var percentDone = ((new Date()).getTime() - this.data.triggeredTime)/this.animationTime;

			if (percentDone > 0 && percentDone <= 0.8) {
				degrade = game.ctx.createRadialGradient( this.data.x,
													this.data.y,
													percentDone * this.data.distance,
													this.data.x,
													this.data.y,
													(percentDone + 0.2) * this.data.distance);  

					degrade.addColorStop(percentDone, 'rgba(0,0,200,0)');  
					degrade.addColorStop(percentDone + 0.05, 'rgba(0,0,250,' + (0.8 - percentDone)  +')');
					degrade.addColorStop(percentDone + 0.2, 'rgba(0,0,50,0)');  

					game.ctx.fillStyle = degrade;  
					game.ctx.fillRect(this.data.x - this.data.distance, 
								 this.data.y - this.data.distance, 
								 this.data.distance * 2, this.data.distance * 2);
			}
		}

		if (this.data.triggeredTime + this.animationTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

FrostNova.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.distance = this.getSpellDistance();
	this.data.x = fromSprite.data.x;
	this.data.y = fromSprite.data.y;
	this.data.triggered = true;
	this.data.effectTime = 3500 + 500 * this.data.level;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (fromSprite.distanceWith(global.level.spriteList[i]) < this.data.distance) {
				global.level.spriteList[i].addModifier("SPEED", -global.level.spriteList[i].getSpeed(), this.type, this.data.effectTime);
				global.level.spriteList[i].hit(this.getHit(), fromSprite, true);
			}
		}
	}

	return true;
}