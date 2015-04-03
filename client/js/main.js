var game = null;
var previousNow = null;

window.onload = function () {
	game = new Game();
	tick();
}

function connect(username, playerType) {
	game.connect(username, playerType);
}

function tick(now) {
	if (previousNow == null) {
		previousNow = new Date();
	}

	var delta = now - previousNow;
	previousNow = now;
	
	game.tick(delta);

	window.requestAnimationFrame(tick);
}
