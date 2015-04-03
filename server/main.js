console.log("=================================");

// Creating HTTP server
var HttpServerWrapper = require('./HttpServerWrapper');
var webServer = new HttpServerWrapper(8080);
console.log("- Http Server ready");

// Creating WebSocket server
var WsServerWrapper = require('./WsServerWrapper');
global.wsServer = new WsServerWrapper(8081);
console.log("- WebSocket Server ready");


console.log("---------------------------------");
console.log("        Server loaded");
console.log("---------------------------------");

var previousNow = new Date();

global.spriteId = 0;

var Level1 = require('./../common/level/Level1');
global.level = new Level1();
global.level.init();

function tick() {
	var now = new Date();
	var delta = now - previousNow;
	previousNow = now;

	for (var i = 0; i < global.level.spriteList.length; i++) {
		global.level.spriteList[i].tick(delta);
	}

	setTimeout(tick, 30);
}

tick();