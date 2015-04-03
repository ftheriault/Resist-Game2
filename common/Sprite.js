module.exports = Sprite = function() {
	this.tileSpriteList = [];
	this.data = {
		x : 20,
		y : 25
	};
}

Sprite.prototype.build = function(isPlayer, id, name, type, life, maxLife, mana, maxMana, speed){
	this.type = type;
	this.tileSpriteList = [];

	this.data = {};
	this.data.isPlayer = isPlayer;
	this.data.name = name;
	this.data.id = id;
	this.data.life = life;
	this.data.mana = mana;
	this.data.maxLife = maxLife;
	this.data.maxMana = maxMana;
	this.data.speed = speed;
}

Sprite.prototype.spawnPoint = function (x, y) {
	this.data.x = x;
	this.data.y = y;
	this.data.destX = x;
	this.data.destY = y;
}

Sprite.prototype.copy = function (sprite) {
	this.tileSpriteList = [];
	this.type = sprite.type;
	this.data = sprite.data;
}

Sprite.prototype.digest = function(msg){
	this.digestMessage(msg);
}

Sprite.prototype.tick = function(delta){
	if (Math.abs(this.data.x - this.data.destX) > 2) {
		if (this.data.x < this.data.destX) {
			this.data.x += this.data.speed * delta;
		}
		else if (this.data.x > this.data.destX) {
			this.data.x -= this.data.speed * delta;
		}
	}
	else {
		this.data.x = this.data.destX;
	}
	
	if (Math.abs(this.data.y - this.data.destY) > 2) {
		if (this.data.y < this.data.destY) {
			this.data.y += this.data.speed * delta;
		}
		else if (this.data.y > this.data.destY) {
			this.data.y -= this.data.speed * delta;
		}
	}
	else {
		this.data.y = this.data.destY;
	}
	
	this.update();
}

Sprite.prototype.loadTextureImages = function() {	
	var imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/walk.png", "WALK", 9, 4);
	imageSprite.changeColumnInterval(0, 7);
	this.tileSpriteList.push(imageSprite);

	imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/attack.png", "ATTACK", 6, 4);
	imageSprite.changeColumnInterval(0, 5);
	this.tileSpriteList.push(imageSprite);

	if (this.type == "Mage" || this.type == "Warrior" || this.type == "Priest" || this.type == "Hunter") {
		imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/walk-head.png", "WALK", 9, 4);
		imageSprite.changeColumnInterval(0, 7);
		this.tileSpriteList.push(imageSprite);

		imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/walk-torso.png", "WALK", 9, 4);
		imageSprite.changeColumnInterval(0, 7);
		this.tileSpriteList.push(imageSprite);

		imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/walk-pants.png", "WALK", 9, 4);
		imageSprite.changeColumnInterval(0, 7);
		this.tileSpriteList.push(imageSprite);

		imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/attack-head.png", "ATTACK", 6, 4);
		imageSprite.changeColumnInterval(0, 5);
		this.tileSpriteList.push(imageSprite);

		imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/attack-torso.png", "ATTACK", 6, 4);
		imageSprite.changeColumnInterval(0, 5);
		this.tileSpriteList.push(imageSprite);

		imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/attack-pants.png", "ATTACK", 6, 4);
		imageSprite.changeColumnInterval(0, 5);
		this.tileSpriteList.push(imageSprite);

		if (this.type == "Warrior") {
			imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/attack-weapon.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(0, 5);
			this.tileSpriteList.push(imageSprite);
		}
		else if (this.type == "Priest") {
			imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/walk-legs.png", "WALK", 9, 4);
			imageSprite.changeColumnInterval(0, 7);
			this.tileSpriteList.push(imageSprite);

			imageSprite = new TiledImage("images/sprites/" + this.type.toLowerCase() + "/attack-legs.png", "ATTACK", 6, 4);
			imageSprite.changeColumnInterval(0, 5);
			this.tileSpriteList.push(imageSprite);
		}
	}

	this.currentAnimationRow = 2;
}

Sprite.prototype.draw = function (ctx) {
	for (var i = 0; i < this.tileSpriteList.length; i++) {
		if (this.pendingAnimation == null && this.tileSpriteList[i].type == "WALK") {
			var walking = false;

			if (this.data.y > this.data.destY) {
				this.currentAnimationRow = 0;
				this.tileSpriteList[i].changeColumnInterval(1, 8);
				walking = true;
			}
			else if (this.data.y < this.data.destY) {
				this.currentAnimationRow = 2;	
				this.tileSpriteList[i].changeColumnInterval(1, 8);	
				walking = true;
			}

			if (this.data.x < this.data.destX) {
				this.currentAnimationRow = 3;
				this.tileSpriteList[i].changeColumnInterval(1, 8);
				walking = true;
			}
			else if (this.data.x > this.data.destX) {
				this.currentAnimationRow = 1;
				this.tileSpriteList[i].changeColumnInterval(1, 8);
				walking = true;
			}

			if (this.currentAnimationRow != this.tileSpriteList[i].imageCurrentRow) {
				this.tileSpriteList[i].changeRow(this.currentAnimationRow);	
			}

			if (!walking) {
				this.tileSpriteList[i].changeColumnInterval(0, 0);						
			}

			this.tileSpriteList[i].tick(ctx, this.data.x, this.data.y);
		}
		else if (this.pendingAnimation == this.tileSpriteList[i].type) {
			this.tileSpriteList[i].tick(ctx, this.data.x, this.data.y);
			this.tileSpriteList[i].changeRow(this.currentAnimationRow);	

			if (this.tileSpriteList[i].imageCurrentCol == this.tileSpriteList[i].imageAnimationColMin) {
				animationDone = true;
			}

			animationFound = true;
		}
	}

	if (this.pendingAnimation != null && animationDone) {
		this.pendingAnimation = null;
	}

	if (this.data.life > 0) {
		ctx.fillStyle = "red";
		ctx.fillRect(this.data.x - (20 + this.data.maxLife/20)/2, this.data.y - 25, (20 + this.data.maxLife/20) * (1.0 * this.data.life/this.data.maxLife), 5);
	}

	if (this.data.isPlayer) {
		ctx.fillStyle = "white";
		ctx.font = "10px Arial";
		ctx.fillText(this.data.name, this.data.x - 20, this.data.y + 50);
	}
}