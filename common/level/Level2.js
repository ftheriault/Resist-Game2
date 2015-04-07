var Level = require('./Level');
var Tree = require('./obstacle/Tree');

module.exports = Level2 = function() {
	Level.call(this, "Level2", "Level 2", 600, 600, 100, 100);
}

Level2.prototype = new Level();
Level2.prototype.constructor = Level2;

// Server only
Level2.prototype.initLandscape = function () {
	
	this.obstacles.push(new Tree(340, 50));
	this.obstacles.push(new Tree(380, 80));
	this.obstacles.push(new Tree(340, 150));
}

// Server only
Level2.prototype.tickLevel = function (now, delta) {
	
}

// Client only
Level2.prototype.drawLevel = function (ctx) {
}