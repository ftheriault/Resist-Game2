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

	if (Math.abs(this.data.x - this.data.destX) > 2) {
		if (this.data.x < this.data.destX) {
			this.data.x += this.data.speed * delta;
		}
		else if (this.data.x > this.data.destX) {
			this.data.x -= this.data.speed * delta;
		}
	}
	else {
		this.data.x = this.data.destX;
	}
	
	if (Math.abs(this.data.y - this.data.destY) > 2) {
		if (this.data.y < this.data.destY) {
			this.data.y += this.data.speed * delta;
		}
		else if (this.data.y > this.data.destY) {
			this.data.y -= this.data.speed * delta;
		}
	}
	else {
		this.data.y = this.data.destY;
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