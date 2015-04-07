var Sprite = require('../Sprite');
var FireBolt = require('../action/FireBolt');
var HealingPotion = require('../action/HealingPotion');
var Teleport = require('../action/Teleport');

module.exports = Mage = function() {

}

Mage.prototype = new Sprite();

Mage.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Mage", 60, 60, 80, 80, 0.05, [ new FireBolt(null, 1), new Teleport(null, 1), new HealingPotion(null, 1) ]);
}

Mage.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["hair-head", "cloth-torso", "cloth-legs"], "spell");
}

Mage.prototype.digestMessage = function () {

}

Mage.prototype.update = function () {

}
