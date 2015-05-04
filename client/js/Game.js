var fireImage = new Image();

var lavaImage = new Image();
var lavaPattern = null;

var sandImage = new Image();
var sandPattern = null;

var debug = false;

function Game() {
	this.ctx = document.getElementById("canvas").getContext("2d");
	this.gameWidth = 700;
	this.gameHeight = 700;
	this.ws = null;
	this.container = null;
	this.serverLocation = window.location.hostname + ':8081';	
	this.music = null;

	this.playerId = null;
	this.playerLevel = 1;
	this.playerSprite = null;
	this.spriteList = [];
	this.mouseX = 0;
	this.mouseY = 0;

	initParticleSystem(document.getElementById("canvas"));

	if (debug) {
		this.debugMessageLength = 0;
		this.debugMessageInitTime = 0;
	}

	var tmpGame = this;

	this.music = this.playMusic("theme-menu.mp3");

	fireImage.src = "images/map-assets/fire.png";
	lavaImage.onload = function() {
		lavaPattern = tmpGame.ctx.createPattern(this, 'repeat');
	}
	lavaImage.src = "images/map-assets/lava.png";
	sandImage.onload = function() {
		sandImage = tmpGame.ctx.createPattern(this, 'repeat');
	}
	sandImage.src = "images/map-assets/sand.png";

	document.getElementById("canvas").onclick = function (e) { 
		game.click(e.pageX - document.getElementById("canvas").offsetLeft, 
				   e.pageY - document.getElementById("canvas").offsetTop) ;
	}

	document.getElementById("canvas").onmousemove = function (e) { 
		game.mouseX = e.pageX - document.getElementById("canvas").offsetLeft;
		game.mouseY = e.pageY - document.getElementById("canvas").offsetTop;
	}

	document.oncontextmenu = function (e) {
		e.preventDefault();
	}

	document.getElementById("canvas").oncontextmenu = function (e) {
		e.preventDefault();

		if (game.ws != null) {
			game.rightClick(e.pageX - document.getElementById("canvas").offsetLeft, 
				   		  	e.pageY - document.getElementById("canvas").offsetTop);
		}
	}

	document.onkeyup = function (e) {
		if (game.ws != null) {
			game.actionKey(e.which);
		}
	}
}

Game.prototype.playSound = function(path) {
	this.soundId++;

	var audio = document.createElement("audio");
	audio.setAttribute("autoplay","autoplay");
	audio.src ='sound/' + path;
	document.body.appendChild(audio);

	audio.addEventListener('ended', function () {
		document.body.removeChild(audio);		
	});

	return audio;
};

Game.prototype.playMusic = function(path) {
	this.soundId++;

	var audio = document.createElement("audio");
	audio.setAttribute("autoplay","autoplay");
	audio.src ='music/' + path;
	audio.volume = 1;
	document.body.appendChild(audio);

	audio.addEventListener('ended', function () {
		document.body.removeChild(audio);		
	});

	return audio;
};

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
		if (debug) {
			game.debugMessageLength += e.data.length;
		}

		var serverMessage = JSON.parse(e.data);
		
		if (serverMessage.type == "SET_PLAYER_ID") {
			game.playerId = serverMessage.id;

			game.gameActionBar = new GameActionBar();
			game.gameDataBar = new GameDataBar();
			
			$(".gui").animate({
				opacity:1
			}, 1000);
			
			createExplosion(game.gameWidth/2, 120, 30, "#000000", '#000000');
		}
		else if (serverMessage.type == "GAME_STATE_UPDATE") {
			if (game.music != null) {
				game.music.pause();
				document.body.removeChild(game.music);
				game.music = null;
			}
			game.level = new (window[serverMessage.level.name])();
			game.level.commonInit();
			game.level.initLandscape();
			game.maxWaveNumber = serverMessage.maxWaveNumber;
			game.showMessage("Wave " + serverMessage.waveNumber, "white");

			for (var i = 0; i < serverMessage.level.spriteList.length; i++) {
				var sprite = new (window[serverMessage.level.spriteList[i].type])();
				sprite.copy(serverMessage.level.spriteList[i]);
				sprite.loadUI();
				game.level.spriteList.push(sprite);

				if (sprite.data.id == game.playerId) {
					game.playerSprite = sprite;
				}
			}

			if (game.level.getMusic() != null) {
				game.music = game.playMusic(game.level.getMusic());
			}
		}
		else if (serverMessage.type == "UPDATE_SPRITE_PATH") {
			for (var i = 0; i < game.level.spriteList.length; i++) {
				if (game.level.spriteList[i].data.id == serverMessage.fromSpriteId) {
					var firstPoint = serverMessage.path.shift();

					game.level.spriteList[i].data.path = serverMessage.path;
					game.level.spriteList[i].data.destX = firstPoint.x;
					game.level.spriteList[i].data.destY = firstPoint.y;
					break;
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

			if (game.playerSprite.data.level > game.playerLevel) {
				game.playerLevel = game.playerSprite.data.level;
				game.showMessage("! LEVEL UP !", "green");
				createExplosion(game.gameWidth/2, 120, 20, "#00ff00", '#aaaaaa');
			}
			else if (game.playerSprite.data.life == 0 && game.playerAlive) {
				game.showMessage("! YOU DIED !", "red");
				createExplosion(game.gameWidth/2, 120, 20, "#ff0000", '#aaaaaa');
			}

			game.playerAlive = game.playerSprite.data.life > 0;
		}
		else if (serverMessage.type == "HIT") {
			for (var i = 0; i < game.level.spriteList.length; i++) {
				if (game.level.spriteList[i].data.id == serverMessage.fromSpriteId) {
					var previousLife = game.level.spriteList[i].data.life;
					game.level.spriteList[i].data.life = serverMessage.data;

					if (game.level.spriteList[i].data.isPlayer) {
						createBloodSpill(game.level.spriteList[i].data.x, game.level.spriteList[i].data.y);
					}
					
					if (serverMessage.data <= 0) {
						if (game.level.spriteList[i].getDeathSound() != null) {
							game.playSound(game.level.spriteList[i].getDeathSound());
						}
						
						game.level.spriteList.splice(i, 1);
					}
					else if (previousLife < serverMessage.data) {
						if (game.level.spriteList[i].getHitSound() != null) {
							game.playSound(game.level.spriteList[i].getHitSound());
						}	
					}

					break;
				}
			}
		}
		else if (serverMessage.type == "HEAL") {
			for (var i = 0; i < game.level.spriteList.length; i++) {
				if (game.level.spriteList[i].data.id == serverMessage.fromSpriteId) {
					game.level.spriteList[i].data.life = serverMessage.data;
					
					break;
				}
			}
		}
		else if (serverMessage.type == "SERVER_INCOMING_MSG") {
			game.showSubMessage(serverMessage.message, serverMessage.color);			
		}
	}

	this.ws.onclose = function(){
		game.errorMessage = "SERVER WILL NOT ACCEPT NEW CONNECTIONS, SORRY!";
	}

	this.ws.onerror = function(error){
		game.errorMessage = 'Error detected: ' + error;
	}
}

Game.prototype.showMessage = function(message, color) {
	game.messageToShow = message;
	game.messageColor = color;
	game.messageInitTime = (new Date()).getTime();
};

Game.prototype.showSubMessage = function(message, color) {
	game.subMessageToShow = message;
	game.subMessageColor = color;
	game.subMessageInitTime = (new Date()).getTime();
};

Game.prototype.send = function(data) {
	if (this.level == null || this.playerSprite.isAlive()) {
		this.ws.send(JSON.stringify(data));
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

Game.prototype.actionIconClick = function(idx) {	
	this.send({
		type : "ACTION_ICON_CLICKED",
		idx : idx
	});
}

Game.prototype.statIconClick = function(statType) {	
	this.send({
		type : "STAT_ICON_CLICKED",
		statType : statType
	});
}

Game.prototype.rightClick = function(x, y) {	
	if (this.playerId != null && this.playerSprite != null) {

		for (var i = 0; i < this.level.spriteList.length; i++) {
			var distance = Math.sqrt(Math.pow(x - this.level.spriteList[i].data.x, 2) + Math.pow(y - this.level.spriteList[i].data.y, 2));

			if (distance < this.level.spriteList[i].data.minDistance/1.5) {
				this.target = this.level.spriteList[i];
				break;
			}
		};

		this.send({
			type : "MOVE_TO",
			currX : this.playerSprite.data.x,
			currY : this.playerSprite.data.y,
			destX : x,
			destY : y
		});
	}
}

Game.prototype.tick = function(delta) {
	if (delta == null || delta < 0) {
		delta = 1;
	}

	if (debug && this.level != null) {
		this.debugMessageInitTime += delta;

		if (this.debugMessageInitTime >= 5000) {
			console.log("Messages Length recieved from socket : " + this.debugMessageLength);
			this.debugMessageInitTime = 0;
			this.debugMessageLength = 0;
		}
	}

	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

	if (this.level != null) {
		this.level.draw(this.ctx);
	}

	if (this.level != null) {
		for (var i = 0; i < this.level.spriteList.length; i++) {
			this.level.spriteList[i].tick(delta);

			this.level.spriteList[i].draw(this.ctx);
		}

		if (this.messageInitTime != null) {
			var sinceTime = (new Date()).getTime() - this.messageInitTime;

			if (sinceTime < 5000) {
				var percent = 1.0 - sinceTime/5000.0;
				this.ctx.save();
				this.ctx.fillStyle = this.messageColor;
				this.ctx.globalAlpha = percent;
	      		this.ctx.textAlign = 'center';
				this.ctx.font = "60px Arial";
				this.ctx.fillText(game.messageToShow, 350, 100);	
				this.ctx.textAlign = 'left';
				this.ctx.restore();
			}
		}

		if (this.subMessageInitTime != null) {
			var sinceTime = (new Date()).getTime() - this.subMessageInitTime;

			if (sinceTime < 3000) {
				var percent = 1.0 - sinceTime/3000.0;
				this.ctx.save();
				this.ctx.fillStyle = this.subMessageColor;
				this.ctx.globalAlpha = percent;
		  		this.ctx.textAlign = 'center';
				this.ctx.font = "30px Arial";
				this.ctx.fillText(game.subMessageToShow, 350, 350);	
				this.ctx.textAlign = 'left';
				this.ctx.restore();
			}
		}
	}

	if (this.gameActionBar != null) {
		this.gameActionBar.tick(delta);
	}

	if (this.gameDataBar != null) {
		this.gameDataBar.tick(delta);
	}

	proton.update();

	if (game.errorMessage != null) {
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = "white";
		this.ctx.font = "12px Arial";
		this.ctx.fillText(game.errorMessage, 350, 300);
		this.ctx.textAlign = 'left';
	}

	if (game.maxWaveNumber != null) {
		this.ctx.fillStyle = "white";
		this.ctx.fillText("Maximum waves survived : " + game.maxWaveNumber, 10, 680);
	}
}