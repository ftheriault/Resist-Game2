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

global.spriteId = 0;

var AStar = require('./../common/AStar');
global.aStar = new AStar();

var Level1 = require('./../common/level/Level1');
global.level = new Level1();
global.level.init();

function tick() {
	var delta = global.level.tick();
	delta -= 20;
	var next = 20 - delta;

	if (delta > 200) {
		console.log("- Long cycle to process : " + delta + "msec");
	}

	if (next <= 0) {
		next = 10;
	}

	setTimeout(tick, next);
}

tick();