var Sprite = require('../Sprite');
var FireBolt = require('../action/FireBolt');
var HealingPotion = require('../action/HealingPotion');
var Teleport = require('../action/Teleport');
var FrostNova = require('../action/FrostNova');
var FireWell = require('../action/FireWell');
var FireAura = require('../action/FireAura');

module.exports = Mage = function() {

}

Mage.prototype = new Sprite();

Mage.prototype.initPlayer = function (id, name) {
	this.build(true, id, name, "Mage", 60, 60, 90, 90, 0.05, [ new FireBolt(null, 1), new FireWell(null, 0), new FrostNova(null, 0), new Teleport(null, 0), new FireAura(null, 0), new HealingPotion(null, 1) ]);
}

Mage.prototype.loadUI = function() {	
	this.spriteUI = new SpriteUI("human", ["hair-head", "cloth-torso", "cloth-legs"], "spell");
}

Mage.prototype.digestMessage = function () {

}

Mage.prototype.update = function () {

}
