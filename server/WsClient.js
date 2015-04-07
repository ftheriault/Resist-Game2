var Hunter = require('./../common/character/Hunter');
var Warrior = require('./../common/character/Warrior');
var Mage = require('./../common/character/Mage');
var Priest = require('./../common/character/Priest');

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
				else if (message.playerType == "Mage") {
					this.sprite = new Mage(); 
				}
				else if (message.playerType == "Warrior") {
					this.sprite = new Warrior(); 
				}
				else {
					this.sprite = new Priest(); 
				}

				this.sprite.initPlayer(this.id, message.username);
				var spawnPoint = global.level.getSpawnPoint(true);
				this.sprite.setLocation(spawnPoint.x, spawnPoint.y);
				global.level.spriteList.push(this.sprite);

				this.send({
					type 	: "SET_PLAYER_ID",
					id 		: this.id,
				});

				global.wsServer.sendStateTo(this);
				global.wsServer.broadcastState(this.sprite);
			}
		}
		else {
			if (message.type == "MOVE_TO") {
				global.level.moveTo(this.sprite, message.destX, message.destY);
			}
			else if (message.type == "ACTION_CLICK") {
				if (message.key != null && !isNaN(message.key) && message.key - 1 < this.sprite.data.actions.length) {
					this.sprite.triggerActionAtIndex(message.key - 1, message.mouseX, message.mouseY);
				}
			}
			else if (message.type == "TARGET_ID") {
				// message.spriteId
			}
		}
	}

	this.connectionClosed = function () {
		global.level.spriteList.splice(global.level.spriteList.indexOf(this.sprite), 1);
		global.wsServer.broadcastState();
	}

	this.send = function (message) {
		this.ws.send(JSON.stringify(message));
	}
}