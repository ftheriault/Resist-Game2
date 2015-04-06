var Obstacle = require('./Obstacle');

module.exports = Tree = function(x, y) {
	this.size = 60;
	Obstacle.call(this, "tree", x, y, this.size * 0.7);
}

Tree.prototype = new Obstacle();
Tree.prototype.constructor = Tree;

Tree.prototype.draw = function(ctx) {
	if (this.img == null) {
		this.img = new Image();
		this.img.src = "images/map-assets/tree.png";
	}

	if (this.img.complete) {
		ctx.drawImage(this.img, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
	}
};