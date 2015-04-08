var Sprite = require('../Sprite');
var MagicBolt = require('../action/MagicBolt');
var HealingPotion = require('../action/HealingPotion');
var Heal = require('../action/Heal');
var MagicPit = require('../action/MagicPit');

module.exports = Priest = function() {

}

Priest.prototype = new Sprite();

Priest.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Priest", 70, 70, 65, 65, 0.06, [ new MagicBolt(null, 1), new MagicPit(null, 1), new Heal(null, 1), new HealingPotion(null, 1) ]);
}

Priest.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["cloth-head", "cloth-torso", "cloth-legs", "leather-feet"], "staff");
}

Priest.prototype.digestMessage = function () {

}

Priest.prototype.update = function () {

}
