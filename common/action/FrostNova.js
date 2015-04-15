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

					degrade.addColorStop(percentDone, 'rgba(200,200,0,0)');  
					degrade.addColorStop(percentDone + 0.05, 'rgba(200,250,00,' + (0.8 - percentDone)  +')');
					degrade.addColorStop(percentDone + 0.2, 'rgba(50,50,0,0)');  

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
	this.data.distance = 100 + 10 * this.data.level;
	this.data.x = fromSprite.data.x;
	this.data.y = fromSprite.data.y;
	this.data.triggered = true;
	this.data.effectTime = 3500 + 500 * this.data.level;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (fromSprite.distanceWith(global.level.spriteList[i]) < this.data.distance) {
				global.level.spriteList[i].addModifier("SPEED", -global.level.spriteList[i].getSpeed(), this.type, this.data.effectTime);
				global.level.spriteList[i].hit(2 + this.data.level * 1, fromSprite, true);
			}
		}
	}

	return true;
}