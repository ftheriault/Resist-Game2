function GameActionBar() {
	this.ctx = document.getElementById("action-canvas").getContext("2d");
}

GameActionBar.prototype.tick = function (delta) {
	var size = 100;
	var x = (150 - size) /2;
	var y = (150 - size) /2;

	if (game.playerSprite != null && game.playerSprite.data.actions != null) {
		for (var i = 0; i < game.playerSprite.data.actions.length; i++) {
			game.playerSprite.data.actions[i].tick(delta);
			game.playerSprite.data.actions[i].draw(this.ctx, x + size * i, y + size * i, size);
		};

	}
}