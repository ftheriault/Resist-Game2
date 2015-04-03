var game = null;
var previousNow = null;
var animation

window.onload = function () {

	currentClassSelection = "warrior-class";
	$("#warrior-class").addClass("selected");

	$(".player-class").click(function (event) {
		$("#" + currentClassSelection).removeClass("selected");
		currentClassSelection = this.id;
		$("#" + currentClassSelection).addClass("selected");
	});

	game = new Game();
	tick();
}

function start(button) {
	button.onclick = function(){};

	playerName = $("#player-name").val();
	playerClass = currentClassSelection.replace("-class", "");
	playerClass = playerClass.charAt(0).toUpperCase() + playerClass.slice(1);
	$(".login-section").fadeOut(1000);

	game.connect(playerName, playerClass);
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
