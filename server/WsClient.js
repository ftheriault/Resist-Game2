var Hunter = require('./../common/character/Hunter');
var Warrior = require('./../common/character/Warrior');

module.exports = WsClient = function(ws) {
	this.ws = ws;
	this.id = global.spriteId++;
	this.sprite = null;

	console.log("- New client connected");

	this.messageRecieved = function (message) {
		message = JSON.parse(message);

		if (this.sprite == null) {
			if (message.type == "INIT") {
				if (message.playerType == "Hunter") {
					this.sprite = new Hunter();
				}
				else {
					this.sprite = new Warrior(); 
				}

				this.sprite.initPlayer();

				this.send({
					type 	: "SET_PLAYER",
					id 		: this.id,
					playerType : this.sprite.type,
					x		: this.sprite.x,
					y		: this.sprite.y
				});

				// send all sprites data

			}
		}
		else {
			// must be an action
		}
	}

	this.connectionClosed = function () {
		// broadcast to all that client is gone
	}

	this.send = function (message) {
		this.ws.send(JSON.stringify(message));
	}
}