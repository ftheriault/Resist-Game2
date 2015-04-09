var Obstacle = require('./Obstacle');

module.exports = Invisible = function(x, y, radius) {
	Obstacle.call(this, "Invisible", x, y, radius);
}

Invisible.prototype = new Obstacle();
Invisible.prototype.constructor = Invisible;

Invisible.prototype.draw = function(ctx) {
	if (false) { // debut
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.minDistance, 0, 2 * Math.PI, false);
		ctx.fillStyle = "rgba(250, 250, 0, 0.3)";
		ctx.fill();
		ctx.closePath();
	}
};