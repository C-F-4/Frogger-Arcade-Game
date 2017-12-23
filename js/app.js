const spriteData = {
  'enemy': 'images/enemy-bug.png',
  'characters': [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ],
  'gemTypes': [
    {
      'sprite': 'images/Gem-Blue.png',
      'rarity': 1,
      'score': 5
    },
    {
      'sprite': 'images/Gem-Green.png',
      'rarity': 2,
      'score': 10
    },
    {
      'sprite': 'images/Gem-Orange.png',
      'rarity': 3,
      'score': 20
    }
  ]
};

var Coordinates = function (x, y) {
  this.x = x;
  this.y = y;
};

Coordinates.prototype.getX = function () {
  return this.x;
}

Coordinates.prototype.getY = function () {
  return this.y;
}

// Enemies our player must avoid
var Enemy = function (coordinates, speed) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.coordinates = coordinates;
  this.speed = speed;
  this.sprite = spriteData.enemy;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.coordinates.x += this.speed * dt;
  if (this.coordinates.x >= 400) {
    this.coordinates = new Coordinates(0, Math.random() * 184 + 50);
  }

  // check for collision
  this.hasPlayerCollide(player.coordinates);
};

Enemy.prototype.hasPlayerCollide = function (playerCoordinates) {
  if (
    playerCoordinates.y + 131 >= this.coordinates.y + 90
    && playerCoordinates.x + 25 <= this.coordinates.x + 88
    && playerCoordinates.y + 73 <= this.coordinates.y + 135
    && playerCoordinates.x + 76 >= this.coordinates.x + 11
  ) {
    console.log('Collision');
    updateLevel(scoreCalculator(false));
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.coordinates.getX(), this.coordinates.getY());
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (coordinates, sprite, step) {
  // Variables applied to each of our instances go here,
  this.coordinates = coordinates;
  this.sprite = sprite;
  this.step = step;
};

Player.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
};

// Draw the player on the screen, required method for game
Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.coordinates.getX(), this.coordinates.getY());
  testData();
};

Player.prototype.handleInput = function (keyPressEvent) {
  if (keyPressEvent == 'left' && this.coordinates.getX() > 2.5) {
    player.coordinates.x -= player.step;
  }
  if (keyPressEvent == 'up' && this.coordinates.getY() > -37) {
    player.coordinates.y -= player.step - 20;
  }
  if (keyPressEvent == 'right' && this.coordinates.getX() <= 383) {
    player.coordinates.x += player.step;
  }
  if (keyPressEvent == 'down' && this.coordinates.getY() <= 383) {
    player.coordinates.y += player.step - 20;
  }
  // check for level end;
  if (keyPressEvent == 'up' && this.coordinates.getY() <= -37) {
    updateLevel(scoreCalculator(true));
  }
};

var Gem = function (sprite, score, rarity, coordinates, isCollectable) {
  this.sprite = sprite;
  this.score = score;
  this.rarity = rarity;
  this.coordinates = coordinates;
  this.isCollectable = isCollectable;
};

Gem.prototype.hasPlayerCollected = function () {
  if (this.isCollectable) {
    // update player score based on score
    this.hide();
  }
};

Gem.prototype.hide = function() {
  this.isCollectable = false;
};

Gem.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.coordinates.getX(), this.coordinates.getY());
};

var scoreCalculator = function(isIncrement) {
  var newScore;
  var newLevel;
  var newEnemyCount;
  if (isIncrement) {
    newEnemyCount = allEnemies.length + 1;
    newScore = scoreCounter + (allEnemies.length * gameLevel);
    newLevel = gameLevel + 1;
  } else {
    if (allEnemies.length > 1) {
      newEnemyCount = allEnemies.length - 1;
    } else {
      newEnemyCount = allEnemies.length;
    }
    if (scoreCounter - (allEnemies.length * gameLevel) >= 0) {
      newScore = scoreCounter - (allEnemies.length * gameLevel);
    } else {
      newScore = 0;
    }
    if (gameLevel > 1) {
      newLevel = gameLevel - 1;
    } else {
      newLevel = gameLevel;
    }
  }
  return {
    'score': newScore,
    'level': newLevel,
    'enemyCount': newEnemyCount
  };
};

var updateLevel = function(updatedGameData) {
  allEnemies = new Array();

  // update score
  scoreCounter = updatedGameData['score'];
  // update level
  gameLevel = updatedGameData['level'];
  // Maintain high level
  if (gameLevel > highLevel) {
    highLevel = gameLevel;
  }
  // Maintain High Score
  if (scoreCounter > highestScore) {
    highestScore = scoreCounter;
  }

  // update player position
  setToInitPosition();

  // generate gems
  gemGenerator();

  // refill allEnemies
  var newEnemyCount = updatedGameData['enemyCount'];
  enemyGenerator(newEnemyCount);

  testData();
};

var setToInitPosition = function() {
  player.coordinates = new Coordinates(202.5, 383);
}

// testing function
var testData = function() {
  var object = {
    'gameLevel': gameLevel,
    'scoreCounter': scoreCounter,
    'player': player,
    'enemies': allEnemies,
    'highLevel': highLevel,
    'highestScore': highestScore
  };
  // console.log(
  //   JSON.parse(JSON.stringify(object))
  // );
  delete object['enemies'];
  // show on UI
  var gameWrapper = document.getElementById('game-wrapper');
  // add player score and level to div element created
  dataDiv.innerHTML = JSON.stringify(object, null, 2);
  dataDiv.className = 'data';
  gameWrapper.appendChild(dataDiv);
}

// Character List Generator
var characterListGenerator = function () {
  if (
    spriteData && spriteData.characters &&
    spriteData.characters.length > 1
  ) {
    characterListDiv.innerHTML = '';
    characterListDiv.className = 'character-wrapper';
    var messageTag = document.createElement('p');
    messageTag.className = 'info';
    messageTag.innerText = 'Click on one of the sprites below';
    characterListDiv.appendChild(
      messageTag
    );
    for (const character of spriteData.characters) {
      if (player.sprite !== character) {
        var characterSpan = document.createElement('span');
        characterSpan.className = 'character';
        characterSpan.innerHTML = '<img src="' + character + '">';
        characterSpan.addEventListener('click', function(e) {
          player.sprite = e.target.attributes[0].value;
          characterListGenerator();
        });
        characterListDiv.appendChild(characterSpan);
      }
    }
    var gameWrapper = document.getElementById('game-wrapper');
    gameWrapper.appendChild(characterListDiv);
  }
}

var gemGenerator = function() {
  // Generate gems based on current level, and gemData  
};

var enemyGenerator = function(enemyCount) {
  for (var count = 0; count < enemyCount; count ++) {
    var speed = Math.random() * 256;
    speed = speed > 5 ? speed : 5;
    allEnemies.push(
      new Enemy(
        new Coordinates(0, Math.random() * 184 + 50),
        speed
      )
    );
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = new Array();
var enemy = new Enemy(
  new Coordinates(0, Math.random() * 184 + 50),
  Math.random() * 256
);
allEnemies.push(enemy);

var selectedSprite = spriteData.characters[0];
var playerStepSize = 50;
const playerInitPosition = new Coordinates(202.5, 383);
var player = new Player(
  playerInitPosition,
  selectedSprite,
  playerStepSize
);

var gameLevel = 1;
var highLevel = 1;
var scoreCounter = 0;
var highestScore = 0;

var dataDiv = document.createElement('pre');
var characterListDiv = document.createElement('div');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});