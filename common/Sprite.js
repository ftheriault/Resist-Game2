module.exports = Sprite = function() {
	
}

Sprite.prototype.build = function(isPlayer, id, name, type, x, y, life, mana, speed){
	this.type = type;

	this.data = {};
	this.data.isPlayer = isPlayer;
	this.data.name = name;
	this.data.id = id;
	this.data.x = x;
	this.data.y = y;
	this.data.destX = x;
	this.data.destY = y;
	this.data.life = life;
	this.data.mana = mana;
	this.data.speed = speed;
}

Sprite.prototype.copy = function (spriteData) {
	this.data = spriteData;
}

Sprite.prototype.digest = function(msg){
	this.digestMessage(msg);
}

Sprite.prototype.tick = function(delta){
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
	
	this.update();
}

