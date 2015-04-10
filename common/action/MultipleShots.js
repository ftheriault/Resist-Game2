var Action = require('./Action');

module.exports = MultipleShots = function (data, level) {
	if (data == null) {
		Action.call(this, level, "multiple-shots", 2000, 700);

		this.data.angle = 0;
		this.data.speed = 0.8;
		this.data.triggered = false;
	}
	else {
		Action.call(this, data.level, "multiple-shots", data.cooldown, 700);
		this.data = data;
	}

	this.needTarget = false;

}

MultipleShots.prototype = new Action();
MultipleShots.prototype.constructor = MultipleShots;

MultipleShots.prototype.getName = function () {
	return "Multiple Shots";
}

MultipleShots.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 5 + this.data.level * 5;

	if (this.data.triggered && delta != null) {
		var angle = this.data.angle;
		var x = this.data.x;
		var y = this.data.y;

		for (var j = 0; j < this.data.tmp.length; j++) {
			var deg = (Math.PI/180) * 12;
			this.data.angle = angle - (this.data.tmp.length/2 * deg) + j * deg;
			this.data.x = this.data.tmp[j].x;
			this.data.y = this.data.tmp[j].y;

			this.moveProjectile(delta);

			if (global != null && global.level != null) {
				for (var i = 0; i < global.level.spriteList.length; i++) {
					if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
						var distance = Math.sqrt(Math.pow(this.data.x - global.level.spriteList[i].data.x, 2) + Math.pow(this.data.y - global.level.spriteList[i].data.y, 2));

						if (distance < global.level.spriteList[i].data.minDistance &&
							this.data.tmpAlreadyHit.indexOf(global.level.spriteList[i].data.id) == -1) {
							global.level.spriteList[i].hit(4 + this.data.level, fromSprite, false);
							this.data.tmpAlreadyHit.push(global.level.spriteList[i].data.id);
						}
					}
				}
			}
			else {
				game.ctx.beginPath();
			    game.ctx.arc(this.data.x, this.data.y, 4, 0, 2 * Math.PI, false);
				game.ctx.fillStyle = "brown";
			    game.ctx.fill();
			    game.ctx.closePath();
			}

			this.data.tmp[j].x = this.data.x;
			this.data.tmp[j].y = this.data.y;
		}

		this.data.angle = angle;
		this.data.x = x;
		this.data.y = y;

		if (this.data.triggeredTime + 500 < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

MultipleShots.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	var success = true;

	this.data.triggered = true;

	this.data.angle = (Math.PI/180) * this.getAngle(fromSprite.data.x, fromSprite.data.y, mouseX, mouseY);
	this.data.x = fromSprite.data.x;
	this.data.y = fromSprite.data.y;

	this.data.tmp = [];
	this.data.tmpAlreadyHit = [];

	for (var i = 0; i < 1 + fromSprite.data.level * 1; i++) {
		this.data.tmp.push({x : this.data.x, y : this.data.y});
	}

	return success;
}
