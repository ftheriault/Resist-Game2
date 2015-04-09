var Action = require('./Action');

module.exports = MagicBolt = function (data, level) {
	if (data == null) {
		Action.call(this, level, "magic-bolt", 3000, 700);

		this.data.angle = 0;
		this.data.speed = 0.7;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "magic-bolt", data.cooldown, 700);
		this.data = data;
	}
}

MagicBolt.prototype = new Action();
MagicBolt.prototype.constructor = MagicBolt;

MagicBolt.prototype.getName = function () {
	return "Magic Bolt";
}

MagicBolt.prototype.update = function (fromSprite, delta) {
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
			game.ctx.beginPath();
		    game.ctx.arc(this.data.x, this.data.y, 8, 0, 2 * Math.PI, false);
			game.ctx.fillStyle = "rgba(255, 250, 250, 0.3)";
		    game.ctx.fill();
		    game.ctx.closePath();
		}

		if (this.data.triggeredTime + 500 < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

MagicBolt.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
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
