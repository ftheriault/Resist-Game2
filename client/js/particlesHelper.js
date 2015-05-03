var proton;
var emitterFire = null;

var fireParticleImage = null;
var glowParticleImage = null;

function initParticleSystem(canvas) {
	proton = new Proton();

	//Creating fire effect
	fireParticleImage = new Image();
	fireParticleImage.src = "images/map-assets/fire.png";

	//Creating glow/fog effect
	glowParticleImage = new Image();
	glowParticleImage.src = "images/map-assets/glow.png";

	// add canvas renderer
	var renderer = new Proton.Renderer('canvas', proton, canvas);
	renderer.start();
}

function emitFire () {
	var fireEmitter = new Proton.Emitter();
	fireEmitter.rate = new Proton.Rate(new Proton.Span(1, 1), .02);
	fireEmitter.addInitialize(new Proton.Mass(1));
	fireEmitter.addBehaviour(new Proton.Gravity());
	fireEmitter.addInitialize(new Proton.ImageTarget(fireParticleImage));
	fireEmitter.addInitialize(new Proton.Life(0.3,1.0));
	fireEmitter.addInitialize(new Proton.V(new Proton.Span(0.5, 1), new Proton.Span(0, 45, true), 'polar'));
	fireEmitter.addBehaviour(new Proton.Scale(new Proton.Span(0.6,0.8), new Proton.Span(0.2, 0.4)));
	fireEmitter.addBehaviour(new Proton.Alpha(1, .2));

	return fireEmitter;
}

function createExplosion (x, y, size, fromColor, toColor) {
	var emitter = new Proton.Emitter();
	emitter.rate = new Proton.Rate(new Proton.Span(15, 50), new Proton.Span(.1, .2));
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.Life(1, 2));
	emitter.addInitialize(new Proton.ImageTarget(glowParticleImage, 32));
	emitter.addInitialize(new Proton.Radius(size));
	emitter.addInitialize(new Proton.V(new Proton.Span(3, 6), new Proton.Span(0, 360), 'polar'));
	emitter.addBehaviour(new Proton.Alpha(1, 0));
	emitter.addBehaviour(new Proton.Color(fromColor, toColor));
	emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.3, 4), 0));
	emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, 1003, 610), 'dead'));

	emitter.p.x = x;
	emitter.p.y = y;
	emitter.rotation = 48;

	emitter.emit();
	proton.addEmitter(emitter);

	setTimeout(function () {
		emitter.stopEmit();
	}, 300);
}

function createBloodSpill(x, y) {
	var myEmitter = new Proton.Emitter();
	myEmitter.rate = new Proton.Rate(Proton.getSpan(15, 20), 0.1);
	myEmitter.addInitialize(new Proton.Radius(1,2));
	myEmitter.addInitialize(new Proton.Life(0.5, 1));
	var minSpeed = 2.0;
	var maxSpeed = 5.0;	
	myEmitter.addInitialize(new Proton.V(new Proton.Span(minSpeed, maxSpeed), new Proton.Span(-70, 140, true), 'polar'));
	myEmitter.addBehaviour(new Proton.Gravity(15));
	myEmitter.addBehaviour(new Proton.Color('#cc0000', "#ff0000"));
	myEmitter.addBehaviour(new Proton.Alpha(1, 0.0));
	myEmitter.damping = 0.1;

	myEmitter.p.x = x;
	myEmitter.p.y = y;

	myEmitter.emit();
	proton.addEmitter(myEmitter);

	setTimeout(function () {
		myEmitter.stopEmit();
		proton.removeEmitter(myEmitter);
	}, 250);
}

function createFlies() {
	emitter = new Proton.Emitter();
	emitter.damping = 0.0075;
	emitter.rate = new Proton.Rate(180);
	emitter.addInitialize(new Proton.ImageTarget(glowParticleImage, 32));
	emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, 1003, 700)));
	emitter.addInitialize(new Proton.Mass(1), new Proton.Radius(Proton.getSpan(5, 10)));
	mouseObj = {
		x : game.gameWidth / 2,
		y : game.gameHeight / 2
	};
	repulsionBehaviour = new Proton.Repulsion(mouseObj, 0, 0);
	crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(-2, 0, 1005, 700), 'cross');
	emitter.addBehaviour(repulsionBehaviour, crossZoneBehaviour);
	emitter.addBehaviour(new Proton.Scale(Proton.getSpan(.1, .6)));
	emitter.addBehaviour(new Proton.Alpha(.5));
	emitter.addBehaviour(new Proton.RandomDrift(10, 10, .2));
	emitter.addBehaviour({
		initialize : function(particle) {
			particle.tha = Math.random() * Math.PI;
			particle.thaSpeed = 0.015 * Math.random() + 0.005;
		},

		applyBehaviour : function(particle) {
			particle.tha += particle.thaSpeed;
			particle.alpha = Math.abs(Math.cos(particle.tha));
		}
	});
	emitter.emit('once');
	proton.addEmitter(emitter);

	setTimeout(function () {
		emitter.stopEmit();
		proton.removeEmitter(emitter);
	}, 2000);
}