var Level = require('./Level');

module.exports = Level1 = function() {
	Level.call(this, "Level1", "Level 1", 350, 350);
}

Level1.prototype = new Level();
Level1.prototype.constructor = Level1;

// Server only
Level1.prototype.initLevel = function () {
	// add obstacles
	// add monsters
}

// Server only
Level1.prototype.tickLevel = function (delta) {
	
}

// Client only
Level1.prototype.drawLevel = function () {
	
}