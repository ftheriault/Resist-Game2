var Shoot = require('./action/Shoot');
var Slash = require('./action/Slash');
var MagicBolt = require('./action/MagicBolt');
var FireBolt = require('./action/FireBolt');
var HealingPotion = require('./action/HealingPotion');

module.exports = Sprite = function() {
	this.data = {
		x : 20,
		y : 25
	};
}

Sprite.prototype.build = function(isPlayer, id, name, type, life, maxLife, mana, maxMana, speed, actions){
	this.type = type;

	this.data = {};
	this.data.isPlayer = isPlayer;
	this.data.name = name;
	this.data.id = id;
	this.data.life = life;
	this.data.mana = mana;
	this.data.maxLife = maxLife;
	this.data.maxMana = maxMana;
	this.data.speed = speed;
	this.data.minDistance = 45; 
	this.data.actions = actions; 

	this.buildActions();
}

Sprite.prototype.buildActions = function() {
	var actions = this.data.actions;
	this.data.actions = [];

	for (var i = 0; i < actions.length; i++) {
		if (actions[i].type == "shoot") {
			this.data.actions.push(new Shoot(actions[i].data));
		}
		else if (actions[i].type == "slash") {
			this.data.actions.push(new Slash(actions[i].data));
		}
		else if (actions[i].type == "magic-bolt") {
			this.data.actions.push(new MagicBolt(actions[i].data));
		}
		else if (actions[i].type == "fire-bolt") {
			this.data.actions.push(new FireBolt(actions[i].data));
		}
	}	
};

Sprite.prototype.setLocation = function (x, y) {
	this.data.x = x;
	this.data.y = y;
	this.data.destX = x;
	this.data.destY = y;
}

Sprite.prototype.copy = function (sprite) {
	this.tileSpriteList = [];
	this.type = sprite.type;
	this.data = sprite.data;

	this.buildActions();
}

Sprite.prototype.broadcastState = function() {
	global.wsServer.broadcastState(this);
}

Sprite.prototype.digest = function(msg){
	this.digestMessage(msg);
}

Sprite.prototype.triggerActionAtIndex = function(idx, mouseX, mouseY){
	this.data.actions[idx].trigger(this, mouseX, mouseY);
}

Sprite.prototype.tick = function(delta){
	if (this.data.justAttacked != null && this.data.justAttacked == true) {
		this.data.justAttacked = false;

		if (this.spriteUI != null) {
			this.spriteUI.pendingAnimation = "attack";
		}
	}

	var deltaStep = delta > 50 ? 20 : delta;
	for (var i = deltaStep; i <= delta; i += deltaStep) {
		// deal with path (one at a time, using x, y)
		if (this.data.destX != null && this.data.destY != null &&
			Math.abs(this.data.x - this.data.destX) <= 1.5 &&
			Math.abs(this.data.y - this.data.destY) <= 1.5) {
			
			this.data.x = this.data.destX;
			this.data.y = this.data.destY;

			if (this.data.path != null && this.data.path.length > 0) {
				var point = this.data.path.shift();
				this.data.destX = point.x;
				this.data.destY = point.y;
				this.isStuck = false;
			}
		}

		var newX = this.data.x;
		var newY = this.data.y;

		if (Math.abs(this.data.x - this.data.destX) >= 1.5) {
			if (this.data.x < this.data.destX) {
				newX += this.data.speed * deltaStep;
			}
			else if (this.data.x > this.data.destX) {
				newX -= this.data.speed * deltaStep;
			}
		}
		else {
			newX = this.data.destX;
		}
		
		if (Math.abs(this.data.y - this.data.destY) >= 1.5) {
			if (this.data.y < this.data.destY) {
				newY += this.data.speed * deltaStep;
			}
			else if (this.data.y > this.data.destY) {
				newY -= this.data.speed * deltaStep;
			}
		}
		else {
			newY = this.data.destY;
		}

		
		if (this.data.x != newX || this.data.y != newY) {
			// server
			if (global != undefined && global.level != undefined) {
				if (global.level.getWalkableCost(newX, newY, [this.data.id]) == 0 &&
					!global.level.checkSpriteCollision(newX, newY, [this.data.id])) {
					this.data.x = newX;
					this.data.y = newY;
				}
				else {					
					this.isStuck = true;	
					this.data.path = null;
					this.data.destX = this.data.x;
					this.data.destY = this.data.y;
					this.broadcastState();
					break;
				}
			}
			else if (game != undefined && game.level != undefined) {
				if (game.level.getWalkableCost(newX, newY, [this.data.id]) == 0 &&
					!game.level.checkSpriteCollision(newX, newY, [this.data.id])) {
					this.data.x = newX;
					this.data.y = newY;
				}
				else {
					this.data.path = null;
					this.data.destX = this.data.x;
					this.data.destY = this.data.y;
					break;
				}
			}
		}

		if (i + deltaStep > delta) {
			deltaStep = delta - deltaStep;

			if (deltaStep < 1) {
				break;
			}
		}
	}

	if (global != undefined && global.level != undefined) {
		if (this.ai != null) {
			this.ai.tick(this);
		}
	}

	for (var i = 0; i < this.data.actions.length; i++) {
		this.data.actions[i].tick(delta);
	}
	
	this.update();
}

Sprite.prototype.draw = function (ctx) {
	this.spriteUI.draw(ctx, this.data.x, this.data.y, this.data.destX, this.data.destY);

	if (this.data.life > 0) {
		ctx.fillStyle = "red";
		ctx.fillRect(this.data.x - (20 + this.data.maxLife/20)/2, this.data.y - 25, (20 + this.data.maxLife/20) * (1.0 * this.data.life/this.data.maxLife), 5);
	}

	if (this.data.isPlayer) {
		ctx.fillStyle = "white";
		ctx.font = "10px Arial";
		ctx.fillText(this.data.name, this.data.x - 20, this.data.y + 50);
	}
}