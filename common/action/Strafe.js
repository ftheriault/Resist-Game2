var Action = require('./Action');

module.exports = Strafe = function (data, level) {
	if (data == null) {
		Action.call(this, level, "strafe", 3000, 700);
		
		this.data.count = 0;
		this.data.angle = 0;
		this.data.speed = 0.8;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "strafe", data.cooldown, 700);
		this.data = data;
	}
}

Strafe.prototype = new Action();
Strafe.prototype.constructor = Strafe;

Strafe.prototype.getName = function () {
	return "Strafe";
}

Strafe.prototype.getTooltip = function() {
	return "Machine gun style";
}

Strafe.prototype.getActiveTooltipData = function() {
	return this.getHit() + " damage per arrow<br/>";
}

Strafe.prototype.getHit = function() {
	return 3 + parseInt(this.data.level);
}

Strafe.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 5 + this.data.level * 5;

	if (this.data.triggered && delta != null) {
		var angle = this.data.angle;
		var x = this.data.x;
		var y = this.data.y;
		var updated = false;

		if (this.data.count < this.data.level) {
			if ((this.data.tmp.length > 0 && this.data.tmp[this.data.tmp.length - 1].t + 250 < (new Date()).getTime()) ||
				(this.data.tmp.length == 0 && this.data.triggeredTime +  250 < (new Date()).getTime())) {			
				this.data.count++;
				this.data.tmp.push({x : this.data.x, y : this.data.y, t : (new Date()).getTime()});
				updated = true;
			}
		}

		for (var j = 0; j < this.data.tmp.length; j++) {
			this.data.x = this.data.tmp[j].x;
			this.data.y = this.data.tmp[j].y;
			var spliced = false;

			this.moveProjectile(delta);

			if (global != null && global.level != null) {
				for (var i = 0; i < global.level.spriteList.length; i++) {
					if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
						var distance = Math.sqrt(Math.pow(this.data.x - global.level.spriteList[i].data.x, 2) + Math.pow(this.data.y - global.level.spriteList[i].data.y, 2));

						if (distance < global.level.spriteList[i].data.minDistance) {
							global.level.spriteList[i].hit(this.getHit(), fromSprite, false);
							
							this.data.tmp.splice(j, 1);
							j--;
							spliced = true;
							updated = true;
						}
					}
				}
			}
			else {
				game.ctx.beginPath();
			    game.ctx.arc(this.data.x, this.data.y, 4, 0, 2 * Math.PI, false);
				game.ctx.fillStyle = "black";
			    game.ctx.fill();
			    game.ctx.closePath();
			}

			if (!spliced) {
				this.data.tmp[j].x = this.data.x;
				this.data.tmp[j].y = this.data.y;

				if (this.data.tmp[j].t + 500 < (new Date()).getTime()) {
					this.data.tmp.splice(j, 1);
					j--;
					continue;
					updated = true;
				}
			}
		}

		this.data.angle = angle;
		this.data.x = x;
		this.data.y = y;

		if (this.data.triggeredTime + 1000 < (new Date()).getTime() && 
			this.data.tmp.length == 0) {
			this.data.triggered = false;
		}

		if (global != null && global.level != null && updated) { 
			fromSprite.broadcastState();
		}
	}
}

Strafe.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {

	var success = true;

	if (this.data.triggered) {
		success = false;
	}
	else {
		this.data.triggered = true;
		this.data.count = 0;

		this.data.x = fromSprite.data.x;
		this.data.y = fromSprite.data.y;

		this.data.tmp = [];

		this.data.angle = (Math.PI/180) * this.getAngle(fromSprite.data.x, fromSprite.data.y, toSprite.data.x, toSprite.data.y);
		this.data.tmp.push({x : this.data.x, y : this.data.y, t : (new Date()).getTime()});
	}
	return success;
}
