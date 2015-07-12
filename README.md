# Simple Game

Simple framework for turn-based games played to points.

Support this project by [donating on Gratipay](https://gratipay.com/scottgonzalez/).



## Getting Started

Simple Game supports any number of players. Games are played to a number of points, optionally requiring a player to win by at least two points.



## API

### new Player(options)

Creates a new `Player` instance.

* `options` (Object; optional): The options for initializing the player.
	* The options are completely arbitrary, to be used as a key/value store for any data you may want to track about the player.

```js
var player = new Player({
	name: "Scott"
});
```

### Player#addPoint()

Adds a point to the player's score.

```js
player.addPoint();
```

### Player#addPoints(points)

Adds points to the player's score.

* `points` (Number): The number of points to add.

```js
player.addPoints(25);
```

### Player#removePoint()

Removes a point from the player's score.

```js
player.removePoint();
```

### Player#removePoints(points)

Removes points from the player's score.

* `points` (Number): The number of points to remove.

```js
player.removePoints(10);
```

### Player#getScore()

Gets the player's score.

```js
var score = player.getScore();
```

### Player#getOption()

Gets an option for the player.

```js
var name = player.getOption("name");
```

### Player#setOption(option, value)

Sets an option for the player.

```js
player.setOption("name", "Dylan");
```

### Player#reset()

Resets the player's score to zero.

```js
player.reset();
```

### Player events

* `score`: Emitted when a player's score changes. The score is passed as data.
* `reset`: Emitted when a player's score is reset.

### new Game(options)

Creates a new `Game` instance.

* `options` (Object; optional): The options for initializing the game.
	* `maxPoints` (Number; optional; default: `15`): The score needed to win the game.
	* `winBy2` (Boolean; optional; default: `true`): Whether a player needs to win by at least two points.

```js
var dominoes = new Game({
	maxPoints: 100,
	winBy2: false
});
```

### Game#addPlayer(player)

Adds a player to the game.

* `player` (Player): The player to add to the game.

```js
game.addPlayer(new Player());
```

### Game#getPlayers()

Gets the list of players, in turn order.

```js
var players = game.getPlayers();
```

### Game#orderedPlayers()

Gets the list of players, in order by score.

```js
var players = game.orderedPlayers();
```

### Game#reset()

Resets the game, setting all players' scores to zero.

```js
game.reset();
```

### Game events

* `end`: Emitted when a player has won the game. The list of players, in order by score, is passed as data.
* `reset`: Emitted when the game is reset.



## License

Copyright Scott González. Released under the terms of the MIT license.

---

Support this project by [donating on Gratipay](https://gratipay.com/scottgonzalez/).
