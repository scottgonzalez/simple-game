var sinon = require("sinon");
var Player = require("../index").Player;

exports.constructor = {
	"no options": function(test) {
		test.expect(2);

		var player = new Player();

		test.strictEqual(player.score, 0, "Should start with a score of 0");
		test.deepEqual(player.options, {}, "Should start with empty options");
		test.done();
	},

	"with options": function(test) {
		test.expect(2);

		var providedOptions = {};
		var player = new Player(providedOptions);

		test.strictEqual(player.score, 0, "Should start with a score of 0");
		test.strictEqual(player.options, providedOptions, "Should store options");
		test.done();
	}
};

exports.addPoint = {
	main: function(test) {
		test.expect(2);

		var player = new Player();
		var addPoints = sinon.spy(player, "addPoints");

		player.addPoint();
		test.ok(addPoints.calledOnce, "Should call addPoints()");
		test.deepEqual(addPoints.args[0], [1], "Should add 1 point");
		test.done();
	}
};

exports.addPoints = {
	main: function(test) {
		test.expect(4);

		var player = new Player();
		var spy = sinon.spy();

		player.on("score", spy);

		player.addPoints(1);
		test.ok(spy.calledOnce, "Should emit for first call");
		test.deepEqual(spy.args[0], [1]);
		spy.reset();

		player.addPoints(3);
		test.ok(spy.calledOnce, "Should emit for second call");
		test.deepEqual(spy.args[0], [4]);
		test.done();
	}
};

exports.removePoint = {
	main: function(test) {
		test.expect(2);

		var player = new Player();
		var removePoints = sinon.spy(player, "removePoints");

		player.removePoint();
		test.ok(removePoints.calledOnce, "Should call removePoints()");
		test.deepEqual(removePoints.args[0], [1], "Should remove 1 point");
		test.done();
	}
};

exports.removePoints = {
	main: function(test) {
		test.expect(4);

		var player = new Player();
		var spy = sinon.spy();

		player.addPoints(10);
		player.on("score", spy);

		player.removePoints(1);
		test.ok(spy.calledOnce, "Should emit for first call");
		test.deepEqual(spy.args[0], [9]);
		spy.reset();

		player.removePoints(3);
		test.ok(spy.calledOnce, "Should emit for second call");
		test.deepEqual(spy.args[0], [6]);
		test.done();
	}
};

exports.getScore = {
	main: function(test) {
		test.expect(2);

		var player = new Player();

		test.strictEqual(player.getScore(), 0);
		player.addPoints(3);
		test.strictEqual(player.getScore(), 3);
		test.done();
	}
};

exports.reset = {
	main: function(test) {
		test.expect(2);

		var player = new Player();
		var spy = sinon.spy();

		player.addPoints(10);
		player.on("reset", spy);

		player.reset();
		test.ok(spy.calledOnce, "Should emit event");
		test.strictEqual(player.getScore(), 0, "Should reset score");
		test.done();
	}
};

exports.getOption = {
	main: function(test) {
		test.expect(2);

		var player = new Player({
			foo: "bar"
		});

		test.strictEqual(player.getOption("foo"), "bar", "Should return value");
		test.strictEqual(player.getOption("x"), undefined, "Should handle non-existent option");
		test.done();
	}
};

exports.setOption = {
	main: function(test) {
		test.expect(2);

		var player = new Player({
			foo: "bar"
		});

		player.setOption("foo", "qux");
		test.strictEqual(player.getOption("foo"), "qux", "Should update exsiting value");

		player.setOption("new", "value");
		test.strictEqual(player.getOption("new"), "value", "Should add new option");
		test.done();
	}
};
