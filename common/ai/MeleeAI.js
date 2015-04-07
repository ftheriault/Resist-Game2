var Level = require('./../Sprite');

module.exports = MeleeAI = function() {
	this.lastActionTime = 0;
	this.defaultCooldown = 3000;
	this.idleCooldown = 5000;
	this.cooldown = this.defaultCooldown;
	this.target = null;
}

MeleeAI.prototype.tick = function (sprite) {
	var now = (new Date()).getTime();

	if (this.lastActionTime + this.cooldown < now) {
		this.lastActionTime = now;
		this.cooldown = this.defaultCooldown;

		if (this.target != null) {
			var distanceToTarget = global.level.distanceBetween(sprite, this.target);
			var attackRange = this.target.data.minDistance + sprite.data.actions[0].maxDistance;

			if (distanceToTarget < attackRange) {
				sprite.data.actions[0].trigger(sprite, this.target.data.x, this.target.data.y, this.target);
			}
			else if (sprite.isStuck && sprite.data.path == null) {
				this.findTarget(sprite, this.target.data.id);
				var success = global.level.moveTo(sprite, this.target.data.x, this.target.data.y, true, [this.target.data.id]);

				if (!success) {
					this.cooldown = this.idleCooldown;
				}
			}
			else {
				global.level.moveTo(sprite, this.target.data.x, this.target.data.y, false);
			}
		} 
		else {
			this.findTarget(sprite, null);
			global.level.moveTo(sprite, this.target.data.x, this.target.data.y, false);
		}
	}

}

MeleeAI.prototype.findTarget = function(sprite, exceptTargetId) {
	var minPlayerDistance = 100000;

	var players = global.level.getPlayers();
	for (var i = 0; i < players.length; i++) {
		if (exceptTargetId == null || players[i].sprite.data.id != exceptTargetId) {
			var distance = global.level.distanceBetween(sprite, players[i].sprite);

			if (distance <= minPlayerDistance) {
				this.target = players[i].sprite;
				minPlayerDistance = distance;
			}
		}
	}
};