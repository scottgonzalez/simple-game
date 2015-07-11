var sinon = require("sinon");
var Player = require("../index").Player;
var Game = require("../index").Game;

exports.constructor = {
	"no options": function(test) {
		test.expect(3);

		var game = new Game();

		test.strictEqual(game.maxPoints, 15, "Should default to a 15 point game");
		test.strictEqual(game.winBy2, true, "Should default to win by 2");
		test.deepEqual(game.players, [], "Should default to no players");
		test.done();
	},

	"with options": function(test) {
		test.expect(3);

		var game = new Game({
			maxPoints: 100,
			winBy2: false
		});

		test.strictEqual(game.maxPoints, 100, "Should set max points");
		test.strictEqual(game.winBy2, false, "Should disable win by 2");
		test.deepEqual(game.players, [], "Should default to no players");
		test.done();
	}
};

exports.addPlayer = {
	main: function(test) {
		test.expect(5);

		var game = new Game();
		var checkScores = sinon.spy(game, "checkScores");

		var player = new Player();
		var player2 = new Player();

		game.addPlayer(player);
		test.deepEqual(game.players, [player], "Should store player");

		game.addPlayer(player2);
		test.deepEqual(game.players, [player, player2], "Should store multiple players");

		test.strictEqual(checkScores.callCount, 0, "Should not have checked scores prior to scoring");

		player.addPoint();
		test.strictEqual(checkScores.callCount, 1, "Should check scores when first player scores");
		checkScores.reset();

		player2.addPoint();
		test.strictEqual(checkScores.callCount, 1, "Should check scores when second player scores");
		checkScores.reset();

		test.done();
	}
};

exports.getPlayers = {
	main: function(test) {
		test.expect(2);

		var game = new Game();
		var player = new Player();
		var player2 = new Player();

		game.addPlayer(player);
		game.addPlayer(player2);

		var players = game.getPlayers();
		test.deepEqual(players, [player, player2], "Should return players");
		test.notStrictEqual(players, game.players, "Should not return internal reference");

		test.done();
	}
};

exports.orderedPlayers = {
	main: function(test) {
		test.expect(2);

		var game = new Game();

		var player = new Player();
		player.addPoints(5);
		game.addPlayer(player);

		var player2 = new Player();
		player2.addPoints(3);
		game.addPlayer(player2);

		var player3 = new Player();
		player3.addPoints(8);
		game.addPlayer(player3);

		var players = game.orderedPlayers();
		test.deepEqual(players, [player3, player, player2], "Should return players in order");
		test.notStrictEqual(players, game.players, "Should not return internal reference");

		test.done();
	}
};

exports.checkScores = {
	setUp: function(done) {
		this.game = new Game();
		this.end = sinon.spy(this.game, "end");

		this.player = new Player();
		this.playerGetScore = sinon.stub(this.player, "getScore");
		this.game.addPlayer(this.player);

		this.player2 = new Player();
		this.player2GetScore = sinon.stub(this.player2, "getScore");
		this.game.addPlayer(this.player2);

		done();
	},

	"win by 2": function(test) {
		test.expect(3);

		this.playerGetScore.returns(5);
		this.player2GetScore.returns(10);

		this.game.checkScores();
		test.strictEqual(this.end.callCount, 0, "Should not end game at 5 - 10");

		this.playerGetScore.returns(15);
		this.game.checkScores();
		test.strictEqual(this.end.callCount, 1, "Should end game at 15 - 10");
		test.strictEqual(this.end.args[0][0], this.player, "Should pass player as winner");

		test.done();
	},

	"win by 2, overtime": function(test) {
		test.expect(4);

		this.playerGetScore.returns(15);
		this.player2GetScore.returns(14);

		this.game.checkScores();
		test.strictEqual(this.end.callCount, 0, "Should not end game at 15 - 14");

		this.playerGetScore.returns(20);
		this.player2GetScore.returns(21);

		this.game.checkScores();
		test.strictEqual(this.end.callCount, 0, "Should not end game at 21 - 20");

		this.player2GetScore.returns(22);
		this.game.checkScores();
		test.strictEqual(this.end.callCount, 1, "Should end game at 22 - 20");
		test.strictEqual(this.end.args[0][0], this.player2, "Should pass player2 as winnder");

		test.done();
	},

	"not win by 2": function(test) {
		test.expect(3);

		this.game.winBy2 = false;

		this.playerGetScore.returns(5);
		this.player2GetScore.returns(10);

		this.game.checkScores();
		test.strictEqual(this.end.callCount, 0, "Should not end game at 5 - 10");

		this.playerGetScore.returns(14);
		this.player2GetScore.returns(15);

		this.game.checkScores();
		test.strictEqual(this.end.callCount, 1, "Should end game at 15 - 14");
		test.strictEqual(this.end.args[0][0], this.player2, "Should pass player2 as winner");

		test.done();
	}
};

exports.end = {
	main: function(test) {
		test.expect(2);

		var game = new Game();

		var player = new Player();
		player.addPoints(5);
		game.addPlayer(player);

		var player2 = new Player();
		player2.addPoints(3);
		game.addPlayer(player2);

		var player3 = new Player();
		player3.addPoints(8);
		game.addPlayer(player3);

		game.on("end", function(players) {
			test.deepEqual(players, [player3, player, player2], "Should return players in order");
			test.notStrictEqual(players, game.players, "Should not return internal reference");

			test.done();
		});

		game.end();
	}
};

exports.reset = {
	main: function(test) {
		test.expect(3);

		var game = new Game();

		var player = new Player();
		var playerReset = sinon.spy(player, "reset");
		game.addPlayer(player);

		var player2 = new Player();
		var player2Reset = sinon.spy(player2, "reset");
		game.addPlayer(player2);

		game.on("reset", function() {
			test.ok(true, "Should emit reset event");
		});

		game.reset();
		test.strictEqual(playerReset.callCount, 1, "Should reset player");
		test.strictEqual(player2Reset.callCount, 1, "Should reset player2");

		test.done();
	}
};
