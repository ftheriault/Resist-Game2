var Sprite = require('../Sprite');
var MagicBolt = require('../action/MagicBolt');
var HealingPotion = require('../action/HealingPotion');
var Heal = require('../action/Heal');
var MagicPit = require('../action/MagicPit');
var MagicRain = require('../action/MagicRain');
var HealingAura = require('../action/HealingAura');

module.exports = Priest = function() {

}

Priest.prototype = new Sprite();

Priest.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Priest", 70, 70, 75, 75, 0.06, [ new MagicBolt(null, 1), new MagicPit(null, 0), new MagicRain(null, 0), new Heal(null, 0), new HealingAura(null, 0), new HealingPotion(null, 1) ]);
}

Priest.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["cloth-head", "cloth-torso", "cloth-legs", "leather-feet"], "staff");
}

Priest.prototype.digestMessage = function () {

}

Priest.prototype.update = function () {

}
