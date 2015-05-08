var Action = require('./Action');

module.exports = Totem = function (data, level) {
	if (data == null) {
		Action.call(this, level, "totem", 8000, 100);

		this.data.speed = 1;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "totem", data.cooldown, 100);
		this.data = data;
	}

	this.needTarget = false;
	this.data.animationTime = 5000;
}

Totem.prototype = new Action();
Totem.prototype.constructor = Totem;

Totem.prototype.getName = function () {
	return "Totem";
}

Totem.prototype.getTooltip = function() {
	return "Creates a totem, damaging close by enemies";
}

Totem.prototype.getActiveTooltipData = function() {
	return this.getSpellDistance() + " distance<br/>" + this.getHit() + " damage per wave<br/>";
}

Totem.prototype.getHit = function() {
	return 3 + parseInt(this.data.level/2);
}

Totem.prototype.getSpellDistance = function() {
	return 40 + 15 * this.data.level;
}

Totem.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 15 + 3 * this.data.level;

	if (this.data.triggered && delta != null) {
		var now = (new Date()).getTime();
		var x = this.data.x;
		var y = this.data.y;
		var updated = false;

		if ((this.data.tmp.length > 0 && this.data.tmp[this.data.tmp.length - 1].t + 1000 < (new Date()).getTime()) ||
			(this.data.tmp.length == 0 && this.data.triggeredTime +  1000 < (new Date()).getTime())) {			
			this.data.count++;
			this.data.tmp.push({x : this.data.x, y : this.data.y, 
								t : (new Date()).getTime(), alreadyHit : new Array()});
			updated = true;
		}

		for (var j = 0; j < this.data.tmp.length; j++) {
			this.data.x = this.data.tmp[j].x;
			this.data.y = this.data.tmp[j].y;
			var spliced = false;

			if (global != null && global.level != null) {
				for (var i = 0; i < global.level.spriteList.length; i++) {
					if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
						var distance = Math.sqrt(Math.pow(this.data.x - global.level.spriteList[i].data.x, 2) + Math.pow(this.data.y - global.level.spriteList[i].data.y, 2));

						if (distance < this.data.distance &&
							this.data.tmp[j].alreadyHit.indexOf(global.level.spriteList[i].data.id) == -1) {
							global.level.spriteList[i].hit(this.getHit(), fromSprite, true);
							this.data.tmp[j].alreadyHit.push(global.level.spriteList[i].data.id);
						}
					}
				}
			}
			else {
				var percent = (now - this.data.tmp[j].t * 1.0)/1000;

				if (percent > 1) {					
					this.data.tmp.splice(j, 1);
					j--;
					spliced = true;
				}
				else {
					if (percent + 0.2 > 1) {
						percent = 0.8;
					}

					degrade = game.ctx.createRadialGradient(this.data.x,
										   this.data.y,
										   percent * this.data.distance,
										   this.data.x,
										   this.data.y,
										   (percent + 0.2) * this.data.distance);  
					degrade.addColorStop(percent, 'rgba(200,200,0,0)');  
					degrade.addColorStop(percent + 0.05, 'rgba(200,250,00,' + (0.8 - percent)  +')');
					degrade.addColorStop(percent + 0.2, 'rgba(200,50,0,0)');  

					game.ctx.fillStyle = degrade;  
					game.ctx.fillRect(this.data.x - this.data.distance, this.data.y - this.data.distance, this.data.distance * 2, this.data.distance * 2);


					game.ctx.save();	
					game.ctx.beginPath();
					game.ctx.arc(this.data.x, this.data.y, 10, 0, 2 * Math.PI, false);
					game.ctx.fillStyle = "orange";
					game.ctx.fill();
					game.ctx.closePath();
					game.ctx.restore();
				}
			}

			if (!spliced) {
				this.data.tmp[j].x = this.data.x;
				this.data.tmp[j].y = this.data.y;

				if (this.data.tmp[j].t + 1000 < (new Date()).getTime()) {
					this.data.tmp.splice(j, 1);
					j--;
					continue;
					updated = true;
				}
			}
		}

		this.data.x = x;
		this.data.y = y;

		if (this.data.triggeredTime + 5000 < (new Date()).getTime()) {
			this.data.triggered = false;
		}

		if (global != null && global.level != null && updated) { 
			fromSprite.broadcastState();
		}
	}
}

Totem.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.distance = this.getSpellDistance();
	this.data.x = mouseX;
	this.data.y = mouseY;
	this.data.triggered = true;
	this.data.triggeredState = 1;
	this.data.animationTime = 5000;
	this.data.tmp = [];
	this.data.count = 0;
	this.data.tmp.push({x : this.data.x, y : this.data.y, 
						t : (new Date()).getTime(), alreadyHit : new Array()});

	return true;
}