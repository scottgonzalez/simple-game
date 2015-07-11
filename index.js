var Util = require("util");
var Events = require("events");

exports.Player = Player;
exports.Game = Game;

function extend(a, b) {
	for (var prop in b) {
		a[prop] = b[prop];
	}
}

function Player(options) {
	this.options = options || {};
	this.score = 0;

	Events.EventEmitter.call(this);
}

Util.inherits(Player, Events.EventEmitter);

extend(Player.prototype, {
	reset: function() {
		this.score = 0;

		this.emit("reset");
	},

	addPoint: function() {
		this.addPoints(1);
	},

	addPoints: function(points) {
		this.score += points;
		this.emit("score", this.score);
	},

	removePoint: function() {
		this.removePoints(1);
	},

	removePoints: function(points) {
		this.score -= points;
		this.emit("score", this.score);
	},

	getScore: function() {
		return this.score;
	},

	getOption: function(option) {
		return this.options[option];
	},

	setOption: function(option, value) {
		this.options[option] = value;
	}
});

function Game(options) {
	options = options || {};
	this.maxPoints = options.maxPoints || 15;
	this.winBy2 = "winBy2" in options ? options.winBy2 : true;
	this.players = [];

	Events.EventEmitter.call(this);
}

Util.inherits(Game, Events.EventEmitter);

extend(Game.prototype, {
	addPlayer: function(player) {
		this.players.push(player);

		player.on("score", this.checkScores.bind(this));
	},

	getPlayers: function() {
		return this.players.slice();
	},

	orderedPlayers: function() {
		return this.getPlayers().sort(function(a, b) {
			return b.getScore() - a.getScore();
		});
	},

	checkScores: function() {
		var orderedPlayers = this.orderedPlayers();
		if (orderedPlayers[0].getScore() < this.maxPoints) {
			return;
		}

		if (!this.winBy2 ||
				orderedPlayers[0].getScore() > (orderedPlayers[1].getScore() + 1)) {
			return this.end(orderedPlayers[0]);
		}
	},

	end: function(winner) {
		this.emit("end", this.orderedPlayers());
	},

	reset: function() {
		this.players.forEach(function(player) {
			player.reset();
		});

		this.emit("reset");
	}
});
