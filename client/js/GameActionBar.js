function GameActionBar() {
	this.ctx = document.getElementById("action-canvas").getContext("2d");
	var tmp = this;

	document.getElementById("action-canvas").onclick = function (e) {
		tmp.clickedAt(e.pageX - document.getElementById("action-canvas").offsetLeft, e.pageY - document.getElementById("action-canvas").offsetTop);
	}
}

GameActionBar.prototype.clickedAt = function(x, y) {
	if (game.playerSprite != null && game.playerSprite.data.actions != null) {
		this.mouseX = x;
		this.mouseY = y;	
	}
};

GameActionBar.prototype.tick = function (delta) {
	var size = 100;
	var x = (150 - size) /2;
	var y = (150 - size) /2;
	var yOffset = 10;

	if (game.playerSprite != null && game.playerSprite.data.actions != null) {
		for (var i = 0; i < game.playerSprite.data.actions.length; i++) {
			game.playerSprite.data.actions[i].draw(this.ctx, x, y + size * i + yOffset * i, size);

			if (this.mouseX != null && this.mouseX > x && this.mouseX < x + size &&
				this.mouseY > y + size * i + yOffset * i && this.mouseY < y + size * (i + 1) + yOffset * i) {
				game.actionIconClick(i);
			}

		};
	}

	this.mouseX = null;
	this.mouseY = null;
}