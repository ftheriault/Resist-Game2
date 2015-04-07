var Action = require('./Action');

module.exports = FireBolt = function (data, level) {
	if (data == null) {
		Action.call(this, "fire-bolt", 3000, 700);

		this.data.angle = 0;
		this.data.speed = 1;
		this.data.triggered = false;
	}
	else {
		Action.call(this, "fire-bolt", data.cooldown, 700);
		this.data = data;
	}

	if (level != null) {
		this.data.level = level;
	}
}

FireBolt.prototype = new Action();
FireBolt.prototype.constructor = FireBolt;

FireBolt.prototype.getName = function () {
	return "Fire Bolt";
}

FireBolt.prototype.update = function (fromSprite, delta) {
	if (this.data.triggered && delta != null) {

		this.moveProjectile(delta);

		if (global != null && global.level != null) {
			for (var i = 0; i < global.level.spriteList.length; i++) {
				if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
					var distance = Math.sqrt(Math.pow(this.data.x - global.level.spriteList[i].data.x, 2) + Math.pow(this.data.y - global.level.spriteList[i].data.y, 2));

					if (distance < global.level.spriteList[i].data.minDistance) {
						global.level.spriteList[i].hit(4 + this.data.level * 1, fromSprite);
						
						this.data.triggered = false;
						fromSprite.broadcastState();
					}
				}
			}
		}
		else {
			game.ctx.fillStyle = "red";
			game.ctx.fillRect(this.data.x, this.data.y, 15, 15)
		}

		if (this.data.triggeredTime + 500 < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

FireBolt.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
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
