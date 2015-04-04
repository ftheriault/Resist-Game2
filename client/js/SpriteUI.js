function SpriteUI(race, itemList) {
	this.items = [];

	var imageSpriteUI = new TiledImage("images/items/" + race + "-walk.png", "WALK", 9, 4);
	imageSpriteUI.changeColumnInterval(0, 7);
	this.items.push(imageSpriteUI);

	imageSpriteUI = new TiledImage("images/items/" + race + "-attack.png", "ATTACK", 6, 4);
	imageSpriteUI.changeColumnInterval(0, 5);
	this.items.push(imageSpriteUI);

	for (var i = 0; i < itemList.length; i++) {
		var item = itemList[i];

		imageSpriteUI = new TiledImage("images/items/" + item + "-walk.png", "WALK", 9, 4);
		imageSpriteUI.changeColumnInterval(0, 7);
		this.items.push(imageSpriteUI);

		imageSpriteUI = new TiledImage("images/items/" + item + "-attack.png", "ATTACK", 6, 4);
		imageSpriteUI.changeColumnInterval(0, 5);
		this.items.push(imageSpriteUI);
	}
	
	this.currentAnimationRow = 2;
}

SpriteUI.prototype.draw = function (ctx, x, y, destX, destY) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.pendingAnimation == null && this.items[i].type == "WALK") {
			var walking = false;

			if (y > destY) {
				this.currentAnimationRow = 0;
				this.items[i].changeColumnInterval(1, 8);
				walking = true;
			}
			else if (y < destY) {
				this.currentAnimationRow = 2;	
				this.items[i].changeColumnInterval(1, 8);	
				walking = true;
			}

			if (x < destX) {
				this.currentAnimationRow = 3;
				this.items[i].changeColumnInterval(1, 8);
				walking = true;
			}
			else if (x > destX) {
				this.currentAnimationRow = 1;
				this.items[i].changeColumnInterval(1, 8);
				walking = true;
			}

			if (this.currentAnimationRow != this.items[i].imageCurrentRow) {
				this.items[i].changeRow(this.currentAnimationRow);	
			}

			if (!walking) {
				this.items[i].changeColumnInterval(0, 0);						
			}

			this.items[i].tick(ctx, x, y);
		}
		else if (this.pendingAnimation == this.items[i].type) {
			this.items[i].tick(ctx, x, y);
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