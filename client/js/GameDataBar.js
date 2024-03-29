function GameDataBar() {
	this.ctx = document.getElementById("data-canvas").getContext("2d");

	this.mouseX = null;
	this.mouseY = null;

	var tmp = this;
	this.btnImage = new Image();
	
	this.btnImage.onload = function() {
		tmp.pattern = tmp.ctx.createPattern(this, 'repeat');
	}

	this.btnImage.src = "images/btn-normal.png";

	document.getElementById("data-canvas").onclick = function (e) {
		tmp.clickedAt(e.pageX - document.getElementById("data-canvas").offsetLeft, e.pageY - document.getElementById("data-canvas").offsetTop);
	}
}

GameDataBar.prototype.clickedAt = function(x, y) {
	if (game.playerSprite != null) {
		this.mouseX = x;
		this.mouseY = y;	
	}
};

GameDataBar.prototype.addStatBox = function (num, statType, caption) {
	var sizeX = 110;
	var sizeY = 40;
	var x = (150 - sizeX) /2;
	var y = 168 + (150 - sizeY) /2;
	var yOffset = 16;	

	y += yOffset * num + sizeX/2 * num;
		
	this.ctx.save();	
	this.ctx.fillStyle = this.pattern;
	this.ctx.fillRect(x, y, sizeX, sizeY);
	this.ctx.restore();	

	if (game.playerSprite.data.freeStatPoints > 0) {
		this.ctx.strokeStyle = "green";
		this.ctx.lineWidth = 2;
	}
	else {
		this.ctx.strokeStyle = "white";
	}

	this.ctx.strokeRect(x, y, sizeX, sizeY);
	this.ctx.lineWidth = 1;
	this.ctx.fillText(caption, x + 6, y + sizeY - 13);

	if (this.mouseX != null && this.mouseX > x && this.mouseX < x + sizeX &&
		this.mouseY > y && this.mouseY < y + sizeY) {
		game.statIconClick(statType);
	}
}

GameDataBar.prototype.tick = function (delta) {
	if (game.level != null && game.playerSprite != null) {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, 150, 700);

		this.ctx.fillStyle = "white";
		this.ctx.font = "14px Arial";

		var bonusArmor = 0;
		var bonusSpeed = 0;

		for (var i = 0; i < game.playerSprite.data.modifiers.length; i++) {
			if (game.playerSprite.data.modifiers[i].type == "ARMOR") {
				bonusArmor += game.playerSprite.data.modifiers[i].mod;
			}
			else if (game.playerSprite.data.modifiers[i].type == "SPEED") {
				bonusSpeed += game.playerSprite.data.modifiers[i].mod;
			}
		};

		this.ctx.fillText("Life : " + game.playerSprite.data.life + " / " + game.playerSprite.data.maxLife, 10, 30);
		this.ctx.fillText("Mana : " + game.playerSprite.data.mana + " / " + game.playerSprite.data.maxMana, 10, 50);
		this.ctx.fillText("Armor : " + parseInt(game.playerSprite.data.armor) + (bonusArmor > 0 ? " +" + bonusArmor : ""), 10, 70);
		this.ctx.fillText("Run speed : " + parseInt(game.playerSprite.data.speed * 1000) + (bonusSpeed > 0 ? " +" + parseInt(bonusSpeed * 1000) : ""), 10, 90);
		this.ctx.fillText("Level : " + game.playerSprite.data.level, 10, 110);
		this.ctx.fillText("Exp : " + game.playerSprite.data.experience + " / " + game.playerSprite.data.maxExperience, 10, 130);

		this.ctx.fillText("Magic Bonus : " + parseInt((game.playerSprite.getMagicBonus() - 1.0) * 100) + "%", 10, 170);
		this.ctx.fillText("Physical Bonus : " + parseInt((game.playerSprite.getHitBonus() - 1.0) * 100) + "%", 10, 190);

		this.addStatBox(1, "STRENGTH", "Strength : " + game.playerSprite.data.strength);
		this.addStatBox(2, "VITALITY", "Vitality : " + game.playerSprite.data.vitality);
		this.addStatBox(3, "DEXTERITY", "Dexterity : " + game.playerSprite.data.dexterity);
		this.addStatBox(4, "INTELLIGENCE", "Intelligence : " +  game.playerSprite.data.intelligence);

		if (game.playerSprite.data.freeActionPoints > 0) {
			this.ctx.fillStyle = "rgb(0, 200, 0)";
		}

		this.ctx.fillText("Action points : " + game.playerSprite.data.freeActionPoints, 20, 625);
		this.ctx.fillStyle = "white";

		if (game.playerSprite.data.freeStatPoints > 0) {
			this.ctx.fillStyle = "rgb(0, 200, 0)";
		}

		this.ctx.fillText("Stat points : " + game.playerSprite.data.freeStatPoints, 20, 650);
		this.ctx.fillStyle = "white";

		this.mouseX = null;
		this.mouseY = null;
	}
}
