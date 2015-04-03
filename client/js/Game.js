function Game() {
	this.ctx = document.getElementById("canvas").getContext("2d");
	this.gameWidth = 700;
	this.gameHeight = 700;
	this.ws = null;
	this.container = null;
	this.serverLocation = 'localhost:8081';	

	this.playerId = null;
	this.spriteList = [];
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
		var serverMessage = e.data;
		console.log(serverMessage);
		// create character here.
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

Game.prototype.tick = function(delta) {
	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

	for (var i = 0; i < this.spriteList.length; i++) {
		this.spriteList.tick(delta);
	}
}