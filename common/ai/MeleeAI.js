var Level = require('./../Sprite');

module.exports = MeleeAI = function() {
	this.lastActionTime = 0;
	this.defaultCooldown = 3000;
	this.cooldown = this.defaultCooldown;
	this.specialCooldown = -1;
	this.lastSpecialTime = -1;
	this.target = null;
}

MeleeAI.prototype.tick = function (sprite) {
	var now = (new Date()).getTime();

	if (this.specialCooldown === -1) {
		this.specialCooldown = sprite.getSpecialAIAbilityCooldown();
		this.lastSpecialTime = now;
	}

	if (this.lastActionTime + this.cooldown < now) {
		this.lastActionTime = now;
		
		if (!sprite.data.incoming) {
			this.cooldown = this.defaultCooldown;
			var triggeredSpecial = false;

			if (this.specialCooldown != null &&
				this.lastSpecialTime + this.specialCooldown < now) {
				this.lastSpecialTime = now;
				triggeredSpecial = true;
			}

			if (triggeredSpecial) {
				sprite.triggerSpecialAIAbility();
			}
			else if (this.target != null && this.target.isAlive()) {
				var success = sprite.data.actions[0].trigger(sprite, this.target.data.x, this.target.data.y, this.target);
				
				if (!success && sprite.data.actions[0].maxDistance > sprite.distanceWith(sprite, this.target)) {
					if (sprite.isStuck && sprite.data.path == null) {
						this.findTarget(sprite, this.target.data.id);

						if (this.target != null) {
							global.level.moveTo(sprite, this.target.data.x, this.target.data.y, true, [this.target.data.id]);
						}
					}
					else {
						global.level.moveTo(sprite, this.target.data.x, this.target.data.y, false);
					}
				}
				else if (sprite.data.path != null) {
					sprite.stop();
				}
			} 
			else {
				this.findTarget(sprite, null);

				if (this.target != null) {
					global.level.moveTo(sprite, this.target.data.x, this.target.data.y, false);
				}
			}
		}
		else if (sprite.data.path == null) {
			global.level.moveTo(sprite, sprite.data.destX, sprite.data.destY, false);
		}
	}

}

MeleeAI.prototype.findTarget = function(sprite, exceptTargetId) {
	var minPlayerDistance = 100000;

	if (this.target != null && !this.target.isAlive()) {
		this.target = null;
	}

	var players = global.level.getPlayers();
	for (var i = 0; i < players.length; i++) {
		if (players[i].sprite != null) {
			if (exceptTargetId == null || players[i].sprite.data.id != exceptTargetId) {
				if (players[i].sprite.isAlive()) {
					var distance = sprite.distanceWith(sprite, players[i].sprite);

					if (distance <= minPlayerDistance) {
						this.target = players[i].sprite;
						minPlayerDistance = distance;
					}
				}
			}
		}
	}
};