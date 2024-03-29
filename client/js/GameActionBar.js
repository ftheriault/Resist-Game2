function GameActionBar() {
	this.ctx = document.getElementById("action-canvas").getContext("2d");
	var tmp = this;

	this.overX = -10;
	this.overY = -10;
	this.offsetX = -10;
	this.offsetY = -10;

	document.getElementById("action-canvas").onclick = function (e) {
		tmp.clickedAt(e.pageX - document.getElementById("action-canvas").offsetLeft, e.pageY - document.getElementById("action-canvas").offsetTop);
	}

	document.getElementById("action-canvas").onmousemove = function (e) {
		tmp.offsetX = document.getElementById("action-canvas").offsetLeft;
		tmp.offsetY = document.getElementById("action-canvas").offsetTop;
		tmp.overX = e.pageX - tmp.offsetX;
		tmp.overY = e.pageY - tmp.offsetY;
	}
}

GameActionBar.prototype.clickedAt = function(x, y) {
	if (game.playerSprite != null && game.playerSprite.data.actions != null) {
		this.mouseX = x;
		this.mouseY = y;	
	}
};

GameActionBar.prototype.tick = function (delta) {
	var size = 85;
	var x = (150 - size) /2;
	var y = (150 - size) /2;
	var yOffset = 5;

	if (game.playerSprite != null && game.playerSprite.data.actions != null) {
		for (var i = 0; i < game.playerSprite.data.actions.length; i++) {

			var over = false;
			if (this.overX > x && this.overX < x + size &&
				this.overY > y + size * i + yOffset * i && 
				this.overY < y + size * (i + 1) + yOffset * i) {
				over = true;
			}

			game.playerSprite.data.actions[i].draw(this.ctx, x, y + size * i + yOffset * i, size, over);

			if (over) {
				if ($("#" + game.playerSprite.data.actions[i].type).length <= 0) {
					var activeTooltipData = game.playerSprite.data.actions[i].getActiveTooltipData();
					$("#action-gui-div").append("<div class='action-tooltip' style='min-height:" + size + "px;left:" + (x + this.offsetX + size + 10) + "px;top:" + (y + this.offsetY + size * i + yOffset * i) + "px;' id='" + game.playerSprite.data.actions[i].type + "'>" + game.playerSprite.data.actions[i].getTooltip() + "<div style='font-size:0.9em;color:rgb(0, 200, 0);margin-top:1px solid white'>" + activeTooltipData + "</div></div>");
				}
			}
			else {
				$("#" + game.playerSprite.data.actions[i].type).remove();
			}

			if (this.mouseX != null && this.mouseX > x && this.mouseX < x + size &&
				this.mouseY > y + size * i + yOffset * i && this.mouseY < y + size * (i + 1) + yOffset * i) {
				game.actionIconClick(i);
			}

		};
	}

	this.mouseX = null;
	this.mouseY = null;
}