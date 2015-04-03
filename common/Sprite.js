module.exports = Sprite = function() {
	this.messageList = [];
}

Sprite.prototype.build = function(type, x, y, life, mana, speed){
	this.type = type;
	this.x = x;
	this.y = y;
	this.life = life;
	this.mana = mana;
	this.speed = speed;
}

Sprite.prototype.digest = function(){
	if (messageList.length > 0) {
		exports.digestMessage(messageList.shift());
	}
}

Sprite.prototype.tick = function(){
	// move sprite
	exports.update();
};
