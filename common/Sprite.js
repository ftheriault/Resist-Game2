(function(exports){

	exports.messageList = [];

	exports.build = function(x, y, life, mana, speed){
		this.x = x;
		this.y = y;
		this.life = life;
		this.mana = mana;
		this.speed = speed;
	}

	exports.digest = function(){
		if (messageList.length > 0) {
			exports.digestMessage(messageList.shift());
		}
	}

	exports.tick = function(){
		// move sprite
		exports.update();
	};

})(typeof exports === 'undefined'? this.Sprite = {}: exports);