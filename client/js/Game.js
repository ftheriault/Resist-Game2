function Game() {
	this.ctx = document.getElementById("canvas").getContext("2d");
	this.gameWidth = 700;
	this.gameHeight = 700;
	this.ws = null;
	this.container = null;
	this.serverLocation = 'localhost:8081';	

	this.playerId = null;
	this.playerSprite = null;
	this.spriteList = [];
	this.mouseX = 0;
	this.mouseY = 0;

	document.getElementById("canvas").onclick = function (e) { 
		game.click(e.pageX - document.getElementById("canvas").offsetLeft, 
				   e.pageY - document.getElementById("canvas").offsetTop) ;
	}

	document.getElementById("canvas").onmousemove = function (e) { 
		game.mouseX = e.pageX - document.getElementById("canvas").offsetLeft;
		game.mouseY = e.pageY - document.getElementById("canvas").offsetTop;
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

			game.gameActionBar = new GameActionBar();
			game.gameDataBar = new GameDataBar();
			
			$(".gui").animate({
				opacity:1
			}, 1000);
		}
		else if (serverMessage.type == "GAME_STATE_UPDATE") {
			game.level = new (window[serverMessage.level.name])();
			game.level.initLandscape();
			game.level.spriteList = [];

			for (var i = 0; i < serverMessage.level.spriteList.length; i++) {
				var sprite = new (window[serverMessage.level.spriteList[i].type])();
				sprite.copy(serverMessage.level.spriteList[i]);
				sprite.loadUI();
				game.level.spriteList.push(sprite);

				if (sprite.data.id == game.playerId) {
					game.playerSprite = sprite;
				}
			}
		}
		else if (serverMessage.type == "SPRITE_STATE_UPDATE") {
			var found = false;

			for (var i = 0; i < game.level.spriteList.length; i++) {
				if (game.level.spriteList[i].data.id == serverMessage.sprite.data.id) {
					var spriteUI = game.level.spriteList[i].spriteUI;
					game.level.spriteList[i].copy(serverMessage.sprite);
					game.level.spriteList[i].loadUI();
					game.level.spriteList[i].spriteUI = spriteUI;
					found = true;
					break;
				}
			}

			if (!found) {
				var sprite = new (window[serverMessage.sprite.type])();
				sprite.copy(serverMessage.sprite);
				sprite.loadUI();
				game.level.spriteList.push(sprite);
			}
		}
		else if (serverMessage.type == "HIT") {
			for (var i = 0; i < game.level.spriteList.length; i++) {
				if (game.level.spriteList[i].data.id == serverMessage.fromSpriteId) {
					game.level.spriteList[i].data.life = serverMessage.data;
					
					if (serverMessage.data <= 0) {
						game.level.spriteList.splice(i, 1);
					}

					break;
				}
			}
		}
	}

	this.ws.onclose = function(){
		game.errorMessage = "SERVER WILL NOT ACCEPT NEW CONNECTIONS, SORRY!";
	}

	this.ws.onerror = function(error){
		game.errorMessage = 'Error detected: ' + error;
	}
}

Game.prototype.send = function(data) {
	if (this.level == null || this.playerSprite.isAlive()) {
		this.ws.send(JSON.stringify(data));
	}
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

		if (key != null && this.playerSprite != null && this.playerSprite.data.actions.length >= key) {
			
			if (this.playerSprite.data.actions[key - 1].isReady()) {				
				this.send({
					type : "ACTION_CLICK",
					key : key,
					mouseX : game.mouseX,
					mouseY : game.mouseY,
					toSpriteId : this.target == null ? null : this.target.data.id
				});
			}
		}
	}
}

Game.prototype.click = function(x, y) {	
	if (this.playerId != null) {

		for (var i = 0; i < this.level.spriteList.length; i++) {
			var distance = Math.sqrt(Math.pow(x - this.level.spriteList[i].data.x, 2) + Math.pow(y - this.level.spriteList[i].data.y, 2));

			if (distance < this.level.spriteList[i].data.minDistance) {
				this.target = this.level.spriteList[i];
				break;
			}
		};

		this.send({
			type : "MOVE_TO",
			destX : x,
			destY : y
		});
	}
}

Game.prototype.tick = function(delta) {
	if (this.level != null) {
		this.level.draw(this.ctx);
	}
	else {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
	}

	if (this.level != null) {
		for (var i = 0; i < this.level.spriteList.length; i++) {
			this.level.spriteList[i].tick(delta);

			this.level.spriteList[i].draw(this.ctx);
		}
	}

	if (this.gameActionBar != null) {
		this.gameActionBar.tick(delta);
	}

	if (this.gameDataBar != null) {
		this.gameDataBar.tick(delta);
	}

	if (game.errorMessage != null) {
		this.ctx.fillStyle = "white";
		this.ctx.fillText(game.errorMessage, 210, 300);
	}
}