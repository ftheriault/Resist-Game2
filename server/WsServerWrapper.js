var WebSocketServer = require('ws').Server;
var WsClient = require("./WsClient");

module.exports = WsServerWrapper = function (wsPort) {
	this.wss = new WebSocketServer({ port: wsPort });
	this.clients = [];
	var wsServer = this;

	this.wss.on('connection', function connection(ws) {
		var wsClient = new WsClient(ws);

		if (wsServer.clients.length < 10) {
			ws.on('message', function incoming(message) {
				wsClient.messageRecieved(message);
			});

			ws.on('close', function() {
				wsServer.clients.splice(wsServer.clients.indexOf(wsClient), 1);
				wsClient.connectionClosed();
			});		

			wsServer.clients.push(wsClient);
		}
		else {
			ws.close();
		}
	});

}

WsServerWrapper.prototype.sendStateTo = function (to) {
	to.send({
		type : "GAME_STATE_UPDATE",
		level : global.level,
		waveNumber : global.waveNumber
	});
}

WsServerWrapper.prototype.broadcastStateToOwner = function (sprite) {
	for (var i = 0; i < this.clients.length; i++) {
		if (this.clients[i].sprite == sprite) {
			this.clients[i].send({
				type : "SPRITE_STATE_UPDATE",
				sprite : sprite
			});
			
			break;
		}
	}
}

WsServerWrapper.prototype.broadcastMessage = function (message, color) {
	for (var i = 0; i < this.clients.length; i++) {
		this.clients[i].send({
			type : "SERVER_INCOMING_MSG",
			message : message,
			color : color
		});
	};
}

WsServerWrapper.prototype.broadcastEvent = function (eventType, fromSpriteId, data) {
	for (var i = 0; i < this.clients.length; i++) {
		this.clients[i].send({
			type : eventType,
			fromSpriteId : fromSpriteId,
			data : data
		});
	};
}

WsServerWrapper.prototype.broadcastState = function (sprite) {
	
	if (sprite == null) {
		for (var i = 0; i < this.clients.length; i++) {
			this.clients[i].send({
				type : "GAME_STATE_UPDATE",
				level : global.level,
				waveNumber : global.waveNumber
			});
		};
	}
	else {
		for (var i = 0; i < this.clients.length; i++) {
			this.clients[i].send({
				type : "SPRITE_STATE_UPDATE",
				sprite : sprite
			});
		};	
	}
}