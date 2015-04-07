var Level = require('./../Sprite');

module.exports = MeleeAI = function() {
	this.lastActionTime = 0;
	this.cooldown = 3000;
	this.target = null;
	this.attackDistance = 50;
}

MeleeAI.prototype.tick = function (sprite) {
	var now = (new Date()).getTime();

	if (this.lastActionTime + this.cooldown < now) {
		this.lastActionTime = now;

		var minPlayerDistance = 100000;

		var players = global.level.getPlayers();
		for (var i = 0; i < players.length; i++) {
			var distance = global.level.distanceBetween(sprite, players[i].sprite);

			if (distance <= minPlayerDistance) {
				this.target = players[i].sprite;
				minPlayerDistance = distance;
			}
		}

		if (sprite.isStuck) {
			if (this.target != null && sprite.data.path == null &&
				global.level.distanceBetween(sprite, this.target) > this.attackDistance) {
				global.level.moveTo(sprite, this.target.data.x, this.target.data.y, true, [this.target.data.id]);
			}
		}
		else if (this.target != null) {
			global.level.moveTo(sprite, this.target.data.x, this.target.data.y, false);
		}
	}

}