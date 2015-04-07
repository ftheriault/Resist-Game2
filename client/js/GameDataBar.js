function GameDataBar() {
	this.ctx = document.getElementById("data-canvas").getContext("2d");
}

GameDataBar.prototype.tick = function (delta) {
	if (game.level != null && game.playerSprite != null) {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, 150, 700);

		this.ctx.fillStyle = "white";
		this.ctx.font = "15px Arial";

		this.ctx.fillText("Life : " + game.playerSprite.data.life + " / " + game.playerSprite.data.maxLife, 10, 30);
		this.ctx.fillText("Mana : " + game.playerSprite.data.mana + " / " + game.playerSprite.data.maxMana, 10, 50);
		this.ctx.fillText("Level : " + game.playerSprite.data.level, 10, 70);
		this.ctx.fillText("Exp : " + game.playerSprite.data.experience + " / " + game.playerSprite.data.maxExperience, 10, 90);
	}
}