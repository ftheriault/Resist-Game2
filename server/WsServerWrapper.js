var WebSocketServer = require('ws').Server;
var WsClient = require("./WsClient");

module.exports = WsServerWrapper = function (wsPort) {
	this.wss = new WebSocketServer({ port: wsPort });
	this.clients = [];
	var wsServer = this;

	this.wss.on('connection', function connection(ws) {
		var wsClient = new WsClient(ws);

		ws.on('message', function incoming(message) {
			wsClient.messageRecieved(message);
		});

		ws.on('close', function() {
			wsServer.clients.splice(wsServer.clients.indexOf(wsClient), 1);
			wsClient.connectionClosed();
		});		

		wsServer.clients.push(wsClient);
	});

}

WsServerWrapper.prototype.broadcastState = function () {
	
	for (var i = 0; i < this.clients.length; i++) {
		this.clients[i].send({
			type : "GAME_STATE_UPDATE",
			level : global.level
		});
	};
}