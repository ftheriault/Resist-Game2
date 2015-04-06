var Level = require('./Level');
var Tree = require('./obstacle/Tree');

module.exports = Level1 = function() {
	Level.call(this, "Level1", "Level 1", 350, 350);
}

Level1.prototype = new Level();
Level1.prototype.constructor = Level1;

// Server only
Level1.prototype.initLandscape = function () {
	
	// add monsters in spriteList

	this.obstacles.push(new Tree(40, 50));
	this.obstacles.push(new Tree(80, 80));
	this.obstacles.push(new Tree(140, 150));
}

// Server only
Level1.prototype.tickLevel = function (delta) {
	
}

// Client only
Level1.prototype.drawLevel = function (ctx) {
	for (var i = 0; i < this.obstacles.length; i++) {
		this.obstacles[i].draw(ctx);
	};	
}