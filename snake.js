// Constants
var WIDTH = 600;
var HEIGHT = 400;
var TILE_SIZE = 10;
var COLORS = [
    "0x0F380F",
    "0x306230",
    "0x8BAC0F",
    "0x9BBC0F"
];
var MOVEMENT_SPEED = 0.1 * 1000; // Seconds to milliseconds
var MOVEMENT_DIRECTION = 'right';
var POINT_SPEED = 5 * 1000 // Seconds to milliseconds

// Create the grid
var grid = [];
for (var i = 0; i < (WIDTH/TILE_SIZE); i++) {
    grid[i] = [];
    for (var j = 0; j < (HEIGHT/TILE_SIZE); j++) {
        grid[i][j] = "";
    }
}

// Setting up Pixi
var stage = new PIXI.Stage(COLORS[3]);
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
var gameDiv = document.getElementById("game");
gameDiv.appendChild(renderer.view);

// Set variables used to make the game work
var movementSpeed = MOVEMENT_SPEED;
var direction = MOVEMENT_DIRECTION;
var movementTimestamp = Date.now();
var pointSpeed = POINT_SPEED;
var pointTimestamp = Date.now() - (POINT_SPEED);
var score = 0;
var coords = {
    "snake": [],
    "points": []
}

// Add the first part of the snake
coords.snake.push(createDot([grid.length/2, grid[0].length/2], COLORS[0]))

// Create the score text
var scoreText = new PIXI.Text("Score: " + score, { font: "14px Arial" });
scoreText.x = 10;
scoreText.y = 10;
stage.addChild(scoreText);

// Start looping the core loop
main();
function main() {
    handleInput();
    moveSnake();
    addPoint();
    translateCoords();
    renderer.render(stage);
    requestAnimFrame(main);
}

// Find a random unused coordinate in the grid
function randomCoord() {
    var x = Math.floor(Math.random() * (grid.length));
    var y = Math.floor(Math.random() * (grid[x].length));

    if (grid[x][y] == '') {
        return [x, y];
    } else {
        return randomCoord();
    }
}

// Create a dot (e.g. a snake part)
// localCoord can be a empty array for a random coordinate or a predefined one through [x, y]
// Color is a string containing a RGB code
function createDot(localCoords, color) {
    var dot = new PIXI.Graphics();
    dot.beginFill(color);
    dot.drawRect(0, 0, 10, 10);
    dot.endFill();

    if (localCoords.length == 0) {
        localCoords = randomCoord();
    }

    x = localCoords[0];
    y = localCoords[1];

    stage.addChild(dot);
    grid[x][y] = dot;

    return localCoords;
}

// Set the correct x and y for an object based on the grid coordinate
function translateCoords() {
    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            if (grid[x][y] != '') {
                grid[x][y].x = x * TILE_SIZE;
                grid[x][y].y = y * TILE_SIZE;
            }
        }
    }
}

// Check if a coordinate falls outside of the grid
function wallCollision(localCoords) {
    if (localCoords[0] < 0 || localCoords[0] >= (WIDTH / TILE_SIZE) || localCoords[1] < 0 || localCoords[1] >= (HEIGHT / TILE_SIZE)) {
        return true;
    }
    return false;
}

// Check if a coordinate currently holds a point
function pointCollision(localCoords) {
    for (var i = 0; i < coords.points.length; i++) {
        var x = coords.points[i][0];
        var y = coords.points[i][1];

        if (localCoords[0] == x && localCoords[1] == y) {
            return true;
        }
    }
    return false;
}

// If a coordinate holds a point then remove the point, add one score point and add a snake part
function handlePointCollision(localCoords) {
    for (var i = 0; i < coords.points.length; i++) {
        var x = coords.points[i][0];
        var y = coords.points[i][1];

        if (localCoords[0] == x && localCoords[1] == y) {
            score += 1;
            scoreText.setText("Score: " + score);

            stage.removeChild(grid[x][y]);
            coords.points.splice(i, 1);

            coords.snake.push(createDot([], COLORS[0]));
        }
    }
}

// Check if a coordinate holds a part of the snake
function bodyCollision(localCoords) {
    for (var i = 0; i < coords.snake.length; i++) {
        var x = coords.snake[i][0];
        var y = coords.snake[i][1];

        if (localCoords[0] == x && localCoords[1] == y) {
            return true;
        }
    }
    return false;
}

// Allows the user to change directions
function handleInput() {
    KeyboardJS.on('left', function() {
        if (direction != 'right') { direction = 'left'; }
    });
    KeyboardJS.on('right', function() {
        if (direction != 'left') { direction = 'right'; }
    });
    KeyboardJS.on('up', function() {
        if (direction != 'down') { direction = 'up'; }
    });
    KeyboardJS.on('down', function() {
        if (direction != 'up') { direction = 'down'; }
    });
}

// Checks collisions for the new coordinate and then either resets or moves the snake depending on the collision results
function moveSnake() {
    if (movementTimestamp + movementSpeed < Date.now()) {
        movementTimestamp = Date.now();

        var willReset = false;
        var newCoords = [coords.snake[0][0], coords.snake[0][1]];
        var oldCoords = [];

        if (direction == 'right') { newCoords[0] += 1; }
        if (direction == 'left') { newCoords[0] -= 1; }
        if (direction == 'up') { newCoords[1] -= 1; }
        if (direction == 'down') { newCoords[1] += 1; }

        if (wallCollision(newCoords)) {
            willReset = true;
        } else {
            if (grid[newCoords[0]][newCoords[1]] != '') {
                if (pointCollision(newCoords)) {
                    handlePointCollision(newCoords);
                }

                if (bodyCollision(newCoords)) {
                    willReset = true;
                }
            }
        }

        if (willReset) {
            reset();
        } else {
            for (var i = 0; i < coords.snake.length; i++) {
                oldCoords = coords.snake[i];

                grid[newCoords[0]][newCoords[1]] = grid[oldCoords[0]][oldCoords[1]];
                grid[oldCoords[0]][oldCoords[1]] = '';

                coords.snake[i] = newCoords;
                newCoords = oldCoords;
            }
        }
    }
}

// Adds a point to the grid
function addPoint() {
    if (pointTimestamp + pointSpeed < Date.now()) {
        pointTimestamp = Date.now();
        coords.points.push(createDot([], COLORS[1]));
    }
}

// Resets the game to the default settings
function reset() {
    for (var i = 0; i < coords.points.length; i++) {
        var x = coords.points[i][0];
        var y = coords.points[i][1];
        stage.removeChild(grid[x][y]);
        grid[x][y] = '';
    }

    for (var i = 0; i < coords.snake.length; i++) {
        var x = coords.snake[i][0];
        var y = coords.snake[i][1];
        stage.removeChild(grid[x][y]);
        grid[x][y] = '';
    }

    // Reset variables to the default values    
    movementSpeed = MOVEMENT_SPEED;
    direction = MOVEMENT_DIRECTION;
    movementTimestamp = Date.now() + (0.5 * 1000);
    pointSpeed = POINT_SPEED;
    pointTimestamp = Date.now() - (POINT_SPEED);
    score = 0;
    coords.snake = [];
    coords.points = [];
    coords.snake.push(createDot([grid.length/2, grid[0].length/2], COLORS[0]))

    // Reset the score text
    scoreText.setText("Score: " + score);
}
