console.log("=================================");

// Creating HTTP server
var HttpServerWrapper = require('./HttpServerWrapper');
var webServer = new HttpServerWrapper(80);
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
global.waveNumber = 1;
global.maxWaveNumber = 0;
global.level = new Level1();
global.level.init();

global.debugMode = false;

var sleepTime = 20;

var fs = require('fs');
fs.readFile("./data.txt", 'utf8', function (err,data) {
  if (err) {
		global.maxWaveNumber = 0;
  }
  else {
		global.maxWaveNumber = data;
	}
});

function tick() {
	try {
		var delta = global.level.tick();
		delta -= sleepTime;
		var next = sleepTime - delta;

		if (delta > 200) {
			console.log("- Long cycle to process : " + delta + "msec");
		}

		if (next <= 0) {
			next = sleepTime/2;
		}
	}
	catch (e) {
		console.log("- Debug ERROR : ");
		console.log(e);
		var stats = fs.statSync("resist_error_log.txt")

		if (stats == null || stats["size"] < 1000 * 1000) { // smaller than 1M
			fs.appendFile("resist_error_log.txt", e); 
			fs.appendFile("resist_error_log.txt", "\n"); 
		}
	}

	setTimeout(tick, next);
}

tick();