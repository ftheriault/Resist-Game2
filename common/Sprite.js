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

Sprite.prototype.tick = function(){
	// move sprite
	this.update();
}

