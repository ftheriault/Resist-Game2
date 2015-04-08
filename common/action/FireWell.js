var Action = require('./Action');

module.exports = FireWell = function (data, level) {
	if (data == null) {
		Action.call(this, "fire-well", 8000, 100);

		this.data.speed = 1;
		this.data.triggered = false;
	}
	else {
		Action.call(this, "fire-well", data.cooldown, 100);
		this.data = data;
	}

	if (level != null) {
		this.data.level = level;
	}

	this.needTarget = false;
	this.animationTime = 1000;
}

FireWell.prototype = new Action();
FireWell.prototype.constructor = FireWell;

FireWell.prototype.getName = function () {
	return "Fire Well";
}

FireWell.prototype.update = function (fromSprite, delta) {
	this.data.manaCost = 15 + 3 * this.data.level;

	if (this.data.triggered && delta != null) {
		if (global != null && global.level != null) {

		}
		else {
			if (this.texImage == null) {
				this.texImage = new Image();
				var tmp = this;
				this.texImage.onload = function () {
					tmp.pattern = game.ctx.createPattern(this, 'repeat');
				}
				this.texImage.src = "images/map-assets/lava.png";
			}

			if (this.texImage.complete) {			
				game.ctx.save();	
				game.ctx.beginPath();
				game.ctx.arc(this.data.x, this.data.y, this.data.distance, 0, 2 * Math.PI, false);
				game.ctx.globalAlpha = 0.5; 
				game.ctx.fillStyle = this.pattern;
				game.ctx.fill();
				game.ctx.closePath();
				game.ctx.restore();
			}
		}

		if (this.data.triggeredTime + this.animationTime < (new Date()).getTime()) {
			this.data.triggered = false;
		}
	}
}

FireWell.prototype.triggerEvent = function (fromSprite, mouseX, mouseY, toSprite) {
	this.data.distance = 40 + 15 * this.data.level;
	this.data.x = mouseX;
	this.data.y = mouseY;
	this.data.triggered = true;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		if (fromSprite.data.isPlayer != global.level.spriteList[i].data.isPlayer) {
			if (this.getDistance(this.data.x, this.data.y, global.level.spriteList[i].data.x, global.level.spriteList[i].data.y) < this.data.distance) {
				global.level.spriteList[i].hit(10 + this.data.level * 3, fromSprite);
			}
		}
	}

	return true;
}