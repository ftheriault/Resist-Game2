function Game() {
	this.ctx = document.getElementById("canvas").getContext("2d");
	this.gameWidth = 700;
	this.gameHeight = 700;
	this.ws = null;
	this.container = null;
	this.serverLocation = 'localhost:8081';	

	this.playerId = null;
	this.spriteList = [];

	document.getElementById("canvas").onclick = function (e) { 
		game.click(e.pageX - document.getElementById("canvas-container").offsetLeft, 
				   e.pageY - document.getElementById("canvas-container").offsetTop) ;
	}

	document.getElementById("canvas").oncontextmenu = function (event) {
		event.preventDefault();

		if (game.ws != null) {
			game.rightClick();
		}
	}
}

Game.prototype.connect = function(username, playerType) {
	this.ws = new WebSocket('ws://' + this.serverLocation);
	this.playerId = null;

	this.ws.onopen = function(){
		game.send( {
			type 		: "INIT",
			username 	: username,
			playerType 	: playerType
		});
	}

	this.ws.onmessage = function(e){
		var serverMessage = JSON.parse(e.data);
		
		if (serverMessage.type == "SET_PLAYER_ID") {
			game.playerId = serverMessage.id;
		}
		else if (serverMessage.type == "GAME_STATE_UPDATE") {
			game.spriteList = [];

			for (var i = 0; i < serverMessage.level.spriteList.length; i++) {
				var sprite = new (window[serverMessage.level.spriteList[i].type])();
				sprite.copy(serverMessage.level.spriteList[i]);
				sprite.loadTextureImages();
				game.spriteList.push(sprite);
			}
		}
		else if (serverMessage.type == "SPRITE_STATE_UPDATE") {
			var found = false;

			for (var i = 0; i < game.spriteList.length; i++) {
				if (game.spriteList[i].data.id == serverMessage.sprite.data.id) {
					game.spriteList[i].copy(serverMessage.sprite);
					game.spriteList[i].loadTextureImages();
					found = true;
					break;
				}
			}

			if (!found) {
				var sprite = new (window[serverMessage.sprite.type])();
				sprite.copy(serverMessage.sprite);
				sprite.loadTextureImages();
				game.spriteList.push(sprite);
			}

		}
	}

	this.ws.onclose = function(){
		console.log("ws closed");
	}

	this.ws.onerror = function(error){
		console.log('Error detected: ' + error);
	}
}

Game.prototype.send = function(data) {
	this.ws.send(JSON.stringify(data));
}

Game.prototype.rightClick = function(x, y) {
	if (this.playerId != null) {
		this.send({
			type : "RIGHT_CLICK"
		});
	}
}

Game.prototype.click = function(x, y) {	
	if (this.playerId != null) {
		this.send({
			type : "ACTION_CLICK",
			destX : x,
			destY : y
		});
	}
}

Game.prototype.tick = function(delta) {
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

	for (var i = 0; i < this.spriteList.length; i++) {
		this.spriteList[i].tick(delta);

		this.spriteList[i].draw();
	}
}