var Shoot = require('./action/Shoot');
var Slash = require('./action/Slash');
var MagicBolt = require('./action/MagicBolt');
var FireBolt = require('./action/FireBolt');
var HealingPotion = require('./action/HealingPotion');
var Spin = require('./action/Spin');
var Sacrifice = require('./action/Sacrifice');
var Teleport = require('./action/Teleport');
var FrostNova = require('./action/FrostNova');
var FireWell = require('./action/FireWell');
var Heal = require('./action/Heal');
var MagicPit = require('./action/MagicPit');
var MultipleShots = require('./action/MultipleShots');
var ExplosiveArrow = require('./action/ExplosiveArrow');
var FireTrap = require('./action/FireTrap');
var ProtectionShield = require('./action/ProtectionShield');
var SwiftAura = require('./action/SwiftAura');


module.exports = Sprite = function() {
	this.data = {
		x : 20,
		y : 25
	};
}

Sprite.prototype.build = function(isPlayer, id, name, type, life, maxLife, mana, maxMana, speed, actions, experienceToGive){
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
	this.data.minDistance = 30; 
	this.data.modifiers = [];
	this.data.actions = actions; 

	this.data.freeActionPoints = 1;
	this.data.freeStatPoints = 0;

	if (isPlayer) {
		this.data.level = 1; 
		this.data.experience = 0; 
		this.data.maxExperience = 50; 
		this.data.dexterity = 1;
		this.data.vitality = 1;
		this.data.intelligence = 1;
		this.data.strength = 1;
		this.data.armor = 1;
	}
	else {
		this.data.experienceToGive = experienceToGive;
		this.data.dexterity = 0;
		this.data.vitality = 0;
		this.data.intelligence = 0;
		this.data.strength = 0;
	}

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
		else if (actions[i].type == "healing-potion") {
			this.data.actions.push(new HealingPotion(actions[i].data));
		}
		else if (actions[i].type == "spin") {
			this.data.actions.push(new Spin(actions[i].data));
		}
		else if (actions[i].type == "sacrifice") {
			this.data.actions.push(new Sacrifice(actions[i].data));
		}
		else if (actions[i].type == "teleport") {
			this.data.actions.push(new Teleport(actions[i].data));
		}
		else if (actions[i].type == "frost-nova") {
			this.data.actions.push(new FrostNova(actions[i].data));
		}
		else if (actions[i].type == "fire-well") {
			this.data.actions.push(new FireWell(actions[i].data));
		}
		else if (actions[i].type == "heal") {
			this.data.actions.push(new Heal(actions[i].data));
		}
		else if (actions[i].type == "magic-pit") {
			this.data.actions.push(new MagicPit(actions[i].data));
		}
		else if (actions[i].type == "magic-rain") {
			this.data.actions.push(new MagicRain(actions[i].data));
		}
		else if (actions[i].type == "multiple-shots") {
			this.data.actions.push(new MultipleShots(actions[i].data));
		}
		else if (actions[i].type == "explosive-arrow") {
			this.data.actions.push(new ExplosiveArrow(actions[i].data));
		}
		else if (actions[i].type == "fire-trap") {
			this.data.actions.push(new FireTrap(actions[i].data));
		}
		else if (actions[i].type == "protection-shield") {
			this.data.actions.push(new ProtectionShield(actions[i].data));
		}
		else if (actions[i].type == "aura-swift") {
			this.data.actions.push(new SwiftAura(actions[i].data));
		}
		else if (actions[i].type == "aura-fire") {
			this.data.actions.push(new FireAura(actions[i].data));
		}
		else if (actions[i].type == "aura-healing") {
			this.data.actions.push(new HealingAura(actions[i].data));
		}
	}	
};

Sprite.prototype.addModifier = function(type, mod, fromAction, time) {
	var modifier = {type : type, mod : mod, fromAction : fromAction, time : time};
	var found = false;

	for (var i = 0; i < this.data.modifiers.length; i++) {
		if (this.data.modifiers[i].fromAction == modifier.fromAction &&
			this.data.modifiers[i].mod <= modifier.mod) {
			this.data.modifiers[i] = modifier;
			found = true;
			break;
		}
	};

	if (!found) {
		this.data.modifiers.push(modifier);
	}

	this.broadcastState();
}

Sprite.prototype.addStatsPoint = function(type) {
	this.data.freeStatPoints--;

	if (type == "DEXTERITY") {
		this.data.dexterity++;
		this.data.speed += 0.0005;

		for (var i = 0; i < this.data.actions.length; i++) {
			if (this.data.actions[i].data.cooldown > 0) {
				this.data.actions[i].data.cooldown - 20;
			}
		};
	}
	else if (type == "VITALITY") {
		this.data.vitality++;
		this.data.life += 5;
		this.data.maxLife += 5;
	}
	else if (type == "INTELLIGENCE") {
		this.data.intelligence++;
		this.data.mana += 5;
		this.data.maxMana += 5;
	}
	else if (type == "STRENGTH") {
		this.data.strength++;
		this.data.armor += 0.5;
	}
}

Sprite.prototype.getSpeed = function() {
	var speed = this.data.speed;

	for (var i = 0; i < this.data.modifiers.length; i++) {
		if (this.data.modifiers[i].type == "SPEED") {
			speed += this.data.modifiers[i].mod;
		}
	};

	if (speed < 0) {
		speed = 0;
	}

	return speed;
}

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

Sprite.prototype.restore = function() {
	this.data.life = this.data.maxLife;
	this.data.mana = this.data.maxMana;
};

Sprite.prototype.isAlive = function () {
	return this.data.life > 0;
}

Sprite.prototype.giveExperience = function(amount) {
	this.data.experience += amount;

	if (this.data.experience >= this.data.maxExperience) {
		this.data.maxExperience = parseInt(this.data.maxExperience * 2.5);
		this.data.level += 1;
		this.data.freeActionPoints += 1;
		this.data.freeStatPoints += 5;
		this.data.maxLife = parseInt(this.data.maxLife + 5);
		this.data.maxMana = parseInt(this.data.maxMana + 5);
		this.data.life = this.data.maxLife;
		this.data.mana = this.data.maxMana;
		
		this.broadcastState();
	}
	else {
		global.wsServer.broadcastStateToOwner(this);
	}
};

Sprite.prototype.heal = function (amount, fromSprite) {
	if (this.isAlive()) {
		if (this.data.intelligence > 1) {
			amount *= this.data.intelligence * 0.005 + 1.0;		
			amount = parseInt(amount);
		}
		this.data.life += amount;

		if (this.data.life > this.data.maxLife) {
			this.data.life = this.data.maxLife;
		}

		this.broadcastState();
	}
}

Sprite.prototype.hit = function (amount, fromSprite) {
	var vulnerable = true;

	for (var i = 0; i < this.data.modifiers.length; i++) {
		if (this.data.modifiers[i].type == "INVULNERABLE") {
			vulnerable = false;
			break;
		}
	};

	if (vulnerable) {
		var finalAmount = amount;

		if (amount - this.armor < amount * 0.25) {
			finalAmount = amount * 0.25;
		}

		if (finalAmount < 1) {
			finalAmount = 1;
		}

		this.data.life -= parseInt(amount);		
	}

	if (this.data.life <= 0) {
		this.data.life = 0;

		if (fromSprite != null && fromSprite.data.isPlayer) {
			for (var i = 0; i < global.wsServer.clients.length; i++) {
				if (global.wsServer.clients[i].sprite.isAlive()) {
					global.wsServer.clients[i].sprite.giveExperience(this.data.experienceToGive);
				}

				fromSprite.giveExperience(this.data.experienceToGive * 0.2);
			}
		}
	}

	if (vulnerable) {
		global.wsServer.broadcastEvent("HIT", this.data.id, this.data.life);
	}
}

Sprite.prototype.broadcastState = function() {
	global.wsServer.broadcastState(this);
}

Sprite.prototype.digest = function(msg){
	this.digestMessage(msg);
}

Sprite.prototype.stop = function() {
	this.data.destX = this.data.x;
	this.data.destY = this.data.y;
	this.data.path = null;
	this.broadcastState();
};

Sprite.prototype.distanceWith = function(sprite) {
	return Math.sqrt(Math.pow(this.data.x - sprite.data.x, 2) + Math.pow(this.data.y - sprite.data.y, 2));
};

Sprite.prototype.triggerActionAtIndex = function(idx, mouseX, mouseY, toSprite){
	return this.data.actions[idx].trigger(this, mouseX, mouseY, toSprite);
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
		var speed = this.getSpeed();
		var wantedX = this.data.destX;
		var wantedY = this.data.destY;

		if (speed == 0) {
			wantedX = this.data.x;
			wantedY = this.data.y;
		}

		if (Math.abs(this.data.x - this.data.destX) >= 1.5) {
			if (this.data.x < this.data.destX) {
				newX += speed * deltaStep;
			}
			else if (this.data.x > this.data.destX) {
				newX -= speed * deltaStep;
			}
		}
		else {
			newX = this.data.destX;
		}

		if (Math.abs(this.data.y - this.data.destY) >= 1.5) {
			if (this.data.y < this.data.destY) {
				newY += speed * deltaStep;
			}
			else if (this.data.y > this.data.destY) {
				newY -= speed * deltaStep;
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

	for (var i = 0; i < this.data.modifiers.length; i++) {
		this.data.modifiers[i].time -= delta;

		if (this.data.modifiers[i].time <= 0) {
			this.data.modifiers.splice(i, 1);
			i--;
		}
	}

	if (global != undefined && global.level != undefined) {
		if (this.ai != null) {
			this.ai.tick(this);
		}
	}

	if (delta > 0) {
		for (var i = 0; i < this.data.actions.length; i++) {
			this.data.actions[i].tick(this, delta);
		}
	}
	
	this.update();
}

Sprite.prototype.draw = function (ctx) {
	if (this.data.modifiers != null) {
		for (var i = 0; i < this.data.modifiers.length; i++) {
			if (this.data.modifiers[i].fromAction == "frost-nova") {
				ctx.fillStyle = "rgba(0, 0, 250, 0.7)";
				ctx.fillRect(this.data.x - this.data.minDistance/2, this.data.y + this.data.minDistance - 10, this.data.minDistance, 10);
			}
			else if (this.data.modifiers[i].fromAction == "aura-swift") {
				ctx.beginPath();
			    ctx.arc(this.data.x, this.data.y + this.data.minDistance/2 + 10, this.data.minDistance/2, 0, 2 * Math.PI, false);
				ctx.fillStyle = "rgba(250, 250, 0, 0.3)";
			    ctx.fill();
			    ctx.closePath();
			}
			else if (this.data.modifiers[i].fromAction == "aura-fire") {
				ctx.beginPath();
			    ctx.arc(this.data.x, this.data.y + this.data.minDistance/2 + 10, this.data.minDistance/2.5, 0, 2 * Math.PI, false);
				ctx.fillStyle = "rgba(250, 0, 0, 0.3)";
			    ctx.fill();
			    ctx.closePath();
			}
			else if (this.data.modifiers[i].fromAction == "aura-healing") {
				ctx.beginPath();
			    ctx.arc(this.data.x, this.data.y + this.data.minDistance/2 + 10, this.data.minDistance/2.25, 0, 2 * Math.PI, false);
				ctx.fillStyle = "rgba(250, 250, 250, 0.3)";
			    ctx.fill();
			    ctx.closePath();
			}
		}
	}

	if (game.target != null && game.target == this) {
		ctx.beginPath();
	    ctx.arc(this.data.x, this.data.y + this.data.minDistance/2, this.data.minDistance/1.5, 0, 2 * Math.PI, false);
		ctx.fillStyle = "rgba(100, 250, 250, 0.3)";
	    ctx.fill();
	    ctx.closePath();
	}

	this.spriteUI.draw(ctx, this.data.x, this.data.y, this.data.destX, this.data.destY);

	if (this.data.life > 0) {
		ctx.fillStyle = "red";
		ctx.fillRect(this.data.x - (20 + this.data.maxLife/20)/2, this.data.y - 25, (20 + this.data.maxLife/20) * (1.0 * this.data.life/this.data.maxLife), 5);
	}

	if (this.data.isPlayer) {
		ctx.fillStyle = "white";
		ctx.font = "10px Arial";
		ctx.textAlign = 'center';
		ctx.fillText(this.data.name, this.data.x, this.data.y + 50);
		ctx.textAlign = 'left';
	}
}