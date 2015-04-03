console.log("=================================");

// Creating HTTP server
var HttpServerWrapper = require('./HttpServerWrapper');
var webServer = new HttpServerWrapper(8080);
console.log("- Http Server ready");

// Creating WebSocket server
var WsServerWrapper = require('./WsServerWrapper');
var wsServer = new WsServerWrapper(8081);
console.log("- WebSocket Server ready");


console.log("---------------------------------");
console.log("        Server loaded");
console.log("---------------------------------");

var previousNow = new Date();
global.spriteId = 0;

function tick() {
	var now = new Date();
	var delta = now - previousNow;
	previousNow = now;

	//??

	setTimeout(tick, 30);
}

tick();