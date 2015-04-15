function SpriteUI(race, itemList, attackType, scale) {
	this.items = [];

	if (scale == null) {
		this.scale = 1;
	}
	else {
		this.scale =scale;
	}

	var imageSpriteUI = new TiledImage("images/items/" + race + "-walk.png", "walk", 9, 4);
	imageSpriteUI.changeColumnInterval(0, 7);
	this.items.push(imageSpriteUI);
	var weaponType = attackType;

	// melee
	if (attackType == "attack") {
		imageSpriteUI = new TiledImage("images/items/" + race + "-" + attackType + ".png", "attack", 6, 4);
		imageSpriteUI.changeColumnInterval(0, 5);
		this.items.push(imageSpriteUI);
	}
	else if (attackType == "spell") {
		imageSpriteUI = new TiledImage("images/items/" + race + "-" + attackType + ".png", "attack", 7, 4);
		imageSpriteUI.changeColumnInterval(0, 6);
		this.items.push(imageSpriteUI);
	}
	else if (attackType == "bow") {
		imageSpriteUI = new TiledImage("images/items/" + race + "-" + attackType + ".png", "attack", 13, 4);
		imageSpriteUI.changeColumnInterval(0, 13);
		this.items.push(imageSpriteUI);
	}
	else if (attackType == "spear") {
		attackType = "thrust";
		imageSpriteUI = new TiledImage("images/items/" + race + "-thrust.png", "attack", 8, 4);
		imageSpriteUI.changeColumnInterval(0, 6);
		this.items.push(imageSpriteUI);
		// add spear
	}
	else if (attackType == "staff") {
		attackType = "thrust";
		imageSpriteUI = new TiledImage("images/items/" + race + "-thrust.png", "attack", 8, 4);
		imageSpriteUI.changeColumnInterval(0, 6);
		this.items.push(imageSpriteUI);
		// add spear
	}

	for (var i = 0; i < itemList.length; i++) {
		var item = itemList[i];

		imageSpriteUI = new TiledImage("images/items/" + item + "-walk.png", "walk", 9, 4);
		imageSpriteUI.changeColumnInterval(0, 7);
		this.items.push(imageSpriteUI);

		if (attackType == "attack") {
			imageSpriteUI = new TiledImage("images/items/" + item + "-attack.png", "attack", 6, 4);
			imageSpriteUI.changeColumnInterval(0, 5);
			this.items.push(imageSpriteUI);	
		}
		else if (attackType == "spell") {
			imageSpriteUI = new TiledImage("images/items/" + item + "-spell.png", "attack", 7, 4);
			imageSpriteUI.changeColumnInterval(0, 6);
			this.items.push(imageSpriteUI);
		}
		else if (attackType == "bow") {
			imageSpriteUI = new TiledImage("images/items/" + item + "-bow.png", "attack", 13, 4);
			imageSpriteUI.changeColumnInterval(0, 13);
			this.items.push(imageSpriteUI);
		}
		else if (attackType == "thrust") {
			imageSpriteUI = new TiledImage("images/items/" + item + "-thrust.png", "attack", 8, 4);
			imageSpriteUI.changeColumnInterval(0, 6);
			this.items.push(imageSpriteUI);
		}
	}

	// melee
	if (weaponType == "attack") {
		imageSpriteUI = new TiledImage("images/items/weapon-dagger.png", "attack", 6, 4);
		imageSpriteUI.changeColumnInterval(0, 5);
		this.items.push(imageSpriteUI);
		
		imageSpriteUI = new TiledImage("images/items/weapon-shield-walk.png", "walk", 9, 4);
		imageSpriteUI.changeColumnInterval(0, 7);
		this.items.push(imageSpriteUI);
	}
	else if (weaponType == "spell") {
	}
	else if (weaponType == "bow") {
		imageSpriteUI = new TiledImage("images/items/weapon-bow.png", "attack", 13, 4);
		imageSpriteUI.changeColumnInterval(0, 13);
		this.items.push(imageSpriteUI);
	}
	else if (weaponType == "spear") {
		imageSpriteUI = new TiledImage("images/items/weapon-spear.png", "attack", 8, 4);
		imageSpriteUI.changeColumnInterval(0, 6);
		this.items.push(imageSpriteUI);
		// add spear
	}
	else if (weaponType == "staff") {
		imageSpriteUI = new TiledImage("images/items/weapon-staff.png", "attack", 8, 4);
		imageSpriteUI.changeColumnInterval(0, 6);
		this.items.push(imageSpriteUI);
		// add spear
	}
	
	this.currentAnimationRow = 2;
}

SpriteUI.prototype.draw = function (ctx, x, y, destX, destY) {
	var animationDone = false;

	if (y > destY) {
		this.currentAnimationRow = 0;
	}
	else if (y < destY) {
		this.currentAnimationRow = 2;	
	}

	if (x < destX) {
		this.currentAnimationRow = 3;
	}
	else if (x > destX) {
		this.currentAnimationRow = 1;
	}

	for (var i = 0; i < this.items.length; i++) {
		if (this.pendingAnimation == null && this.items[i].type == "walk") {
			var walking = false;

			if (y > destY) {
				this.items[i].changeColumnInterval(1, 8);
				walking = true;
			}
			else if (y < destY) {
				this.items[i].changeColumnInterval(1, 8);	
				walking = true;
			}

			if (x < destX) {
				this.items[i].changeColumnInterval(1, 8);
				walking = true;
			}
			else if (x > destX) {
				this.items[i].changeColumnInterval(1, 8);
				walking = true;
			}

			if (this.currentAnimationRow != this.items[i].imageCurrentRow) {
				this.items[i].changeRow(this.currentAnimationRow);	
			}

			if (!walking) {
				this.items[i].changeColumnInterval(0, 0);						
			}

			this.items[i].tick(ctx, x, y, this.scale);
		}
		else if (this.pendingAnimation == this.items[i].type) {
			this.items[i].tick(ctx, x, y, this.scale);
			this.items[i].changeRow(this.currentAnimationRow);	

			if (this.items[i].imageCurrentCol == this.items[i].imageAnimationColMin) {
				animationDone = true;
			}

			animationFound = true;
		}
	}

	if (this.pendingAnimation != null && animationDone) {
		this.pendingAnimation = null;
	}
}