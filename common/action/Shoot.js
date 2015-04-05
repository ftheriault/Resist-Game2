var Action = require('./Action');

module.exports = Shoot = function (data) {
	if (data == null) {
		Action.call(this, "shoot", 1000);
	}
	else {
		Action.call(this, "shoot", data.cooldown);
		this.data = data;
	}
}

Shoot.prototype = new Action();
Shoot.prototype.constructor = Shoot;

Shoot.prototype.update = function () {

}

Shoot.prototype.triggerEvent = function (fromSprite, mouseX, mouseY) {
	// trigger action and send animation
}