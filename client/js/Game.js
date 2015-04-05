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

	document.onkeyup = function (e) {
		if (game.ws != null) {
			game.actionKey(e.which);
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
			
			game.level = new (window[serverMessage.level.name])();

			for (var i = 0; i < serverMessage.level.spriteList.length; i++) {
				var sprite = new (window[serverMessage.level.spriteList[i].type])();
				sprite.copy(serverMessage.level.spriteList[i]);
				sprite.loadUI();
				game.spriteList.push(sprite);
			}
		}
		else if (serverMessage.type == "SPRITE_STATE_UPDATE") {
			var found = false;

			for (var i = 0; i < game.spriteList.length; i++) {
				if (game.spriteList[i].data.id == serverMessage.sprite.data.id) {
					game.spriteList[i].copy(serverMessage.sprite);
					game.spriteList[i].loadUI();
					found = true;
					break;
				}
			}

			if (!found) {
				var sprite = new (window[serverMessage.sprite.type])();
				sprite.copy(serverMessage.sprite);
				sprite.loadUI();
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

Game.prototype.rightClick = function() {
	if (this.playerId != null) {
		this.send({
			type : "RIGHT_CLICK"
		});
	}
}

Game.prototype.actionKey = function(code) {
	if (this.playerId != null) {
		var key = null;
		if (code == 49) key = 1;
		else if (code == 50) key = 2;
		else if (code == 51) key = 3;
		else if (code == 52) key = 4;
		else if (code == 53) key = 5;
		else if (code == 54) key = 6;
		else if (code == 55) key = 7;
		else if (code == 56) key = 8;
		else if (code == 57) key = 9;

		// target if possible

		if (key != null) {
			this.send({
				type : "ACTION_CLICK",
				key : key
			});
		}
	}
}

Game.prototype.click = function(x, y) {	
	if (this.playerId != null) {
		this.send({
			type : "MOVE_TO",
			destX : x,
			destY : y
		});
	}
}

Game.prototype.tick = function(delta) {
	if (this.level != null) {
		this.level.draw();
	}
	else {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
	}

	for (var i = 0; i < this.spriteList.length; i++) {
		this.spriteList[i].tick(delta);

		this.spriteList[i].draw(this.ctx);
	}
}