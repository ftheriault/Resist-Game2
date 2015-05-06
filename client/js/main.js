var game = null;
var previousNow = null;
var animation = null;

var tmpList = [];

function showMenu() {
	menuShown = true;
	$("#loaderPercent").css("display", "none");
	$(".hidden").fadeIn();

	if (localStorage["playerName"] != null) {
		$("#player-name").val(localStorage["playerName"]);
	}

	tmpList.push(new Warrior());
	tmpList[tmpList.length - 1].type = "Warrior";
	tmpList[tmpList.length - 1].loadUI();
	tmpList.push(new Mage());
	tmpList[tmpList.length - 1].type = "Mage";
	tmpList[tmpList.length - 1].loadUI();
	tmpList.push(new Priest());
	tmpList[tmpList.length - 1].type = "Priest";
	tmpList[tmpList.length - 1].loadUI();
	tmpList.push(new Hunter());
	tmpList[tmpList.length - 1].type = "Hunter";
	tmpList[tmpList.length - 1].loadUI();

	currentClassSelection = "warrior-class";

	if (localStorage["playerClass"] != null) {
		currentClassSelection = localStorage["playerClass"];
	}

	$("#" + currentClassSelection).addClass("selected");

	$(".player-class").click(function (event) {
		$("#" + currentClassSelection).removeClass("selected");
		currentClassSelection = this.id;
		$("#" + currentClassSelection).addClass("selected");
	});

	intervalId = setInterval(function () {
		for (var i = 0; i < tmpList.length; i++) {
			var ctx = $("#" + tmpList[i].type.toLowerCase() + "-class canvas")[0].getContext('2d');
			var tmpPlayerClass = capitaliseFirstLetter(currentClassSelection.replace("-class", ""));
			ctx.clearRect(0, 0, 50, 50);
			tmpList[i].draw(ctx);

			if (tmpPlayerClass == tmpList[i].type) {
				tmpList[i].data.destY = tmpList[i].data.y + 10;
			}
			else {
				tmpList[i].data.destY = tmpList[i].data.y;
			}
    	}
	}, 30);

	game = new Game();
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function start(button) {
	playerName = $("#player-name").val();
	
	if (playerName.trim().length > 0) {
		clearInterval(intervalId);
		tick();

		button.onclick = function(){};

		playerClass = currentClassSelection.replace("-class", "");
		playerClass = playerClass.charAt(0).toUpperCase() + playerClass.slice(1);

		localStorage["playerName"] = playerName;
		localStorage["playerClass"] = currentClassSelection;

		$(".login-section").fadeOut(1000);

		game.connect(playerName, playerClass);
	}
	else {
		$("#player-name").css("background-color", "pink");
		$("#player-name").css("color", "red");
	}
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
