if (typeof exports !== 'undefined') {
	var Sprite = require.main.require('./../common/Sprite');
}

(function(exports){
	exports.prototype = Object.create(Sprite);

	exports.prototype.initPlayer = function () {
		this.build(30, 30, 90, 50, 0.4);
	}

})(typeof exports === 'undefined'? this.Hunter = {} : exports);