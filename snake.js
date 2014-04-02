// Constants
var WIDTH = 600;
var HEIGHT = 400;
var COLORS = [
    "0x0F380F",
    "0x306230",
    "0x8BAC0F",
    "0x9BBC0F"
];
var MOVEMENT_SPEED = 0.2 * 1000; // Seconds to milliseconds
var MOVEMENT_DIRECTION = 'right';
var POINT_SPEED = 5 * 1000 // Seconds to milliseconds

// The in-game grid
var grid = [];
for (var i = 0; i < (WIDTH/10); i++) {
    grid[i] = [];
    for (var j = 0; j < (HEIGHT/10); j++) {
        grid[i][j] = "";
    }
}

// Setting up Pixi
var stage = new PIXI.Stage(COLORS[3]);
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
var gameDiv = document.getElementById("game");
gameDiv.appendChild(renderer.view);

// Create the snake and add it to the stage
var snake = new PIXI.Graphics();
snake.beginFill(COLORS[0]);
snake.drawRect(0, 0, 10, 10);
snake.endFill();
stage.addChild(snake);

// Set the basic variables and reset the timestamp to trigger right away
var movementSpeed = MOVEMENT_SPEED;
var direction = MOVEMENT_DIRECTION;
var movementTimestamp = Date.now();
var pointSpeed = POINT_SPEED;
var pointTimestamp = Date.now() - (POINT_SPEED);
var points = [];
var score = 0;
var snakeX = grid.length / 2;
var snakeY = grid[snakeX].length / 2;
grid[snakeX][snakeY] = snake;

// Create the score text and add it to the stage
var scoreText = new PIXI.Text("Score: " + score, { font: "14px Arial" });
scoreText.x = 10;
scoreText.y = 10;
stage.addChild(scoreText);

// Start the core loop
main();
function main() {
    handleInput();
    moveSnake();
    addPoints();
    setLocation();
    requestAnimFrame(draw);
}

// Sets the correct x and y for an object depending on their location in the grid array
function setLocation() {
    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            if (grid[x][y] != '') {
                grid[x][y].x = x * 10;
                grid[x][y].y = y * 10;
            }
        }
    }
}

// Put everything on the screen
function draw() {
    renderer.render(stage);
    main();
}

// See if the player wants to change the direction of the snake
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

// Moves the snake and check for collisions
function moveSnake() {
    if (movementTimestamp + movementSpeed < Date.now()) {
        movementTimestamp = Date.now();
        grid[snakeX][snakeY] = '';

        if (direction == 'right') { snakeX += 1; }
        if (direction == 'left') { snakeX -= 1; }
        if (direction == 'up') { snakeY -= 1; }
        if (direction == 'down') { snakeY += 1; }

        // Check for collisions with the wall
        if (snakeX < 0 || snakeX >= (WIDTH / 10) || snakeY < 0 || snakeY >= (HEIGHT / 10)) {
            reset();
        // Check for collision with a point
        } else if (grid[snakeX][snakeY] != '') {
            for (var i = 0; i < points.length; i++) {
                if (points[i][0] == snakeX && points[i][1] == snakeY) {
                    score += 1;
                    scoreText.setText("Score: " + score);
                    stage.removeChild(grid[snakeX][snakeY]);
                    points.splice(i, 1);
                    grid[snakeX][snakeY] = snake;
                }
            }
        } else {
            grid[snakeX][snakeY] = snake;
        }
    }
}

// Add points to the grid
function addPoints() {
    var random = function(grid) {
        var x = Math.floor(Math.random() * (grid.length));
        var y = Math.floor(Math.random() * (grid[x].length));

        return [x, y];
    }

    if (pointTimestamp + pointSpeed < Date.now()) {
        pointTimestamp = Date.now();

        var xy = random(grid);
        var x = xy[0];
        var y = xy[1];

        if (grid[x][y] == '') {
            var point = new PIXI.Graphics();
            point.beginFill(COLORS[1]);
            point.drawRect(0, 0, 10, 10);
            point.endFill();
            stage.addChild(point);

            grid[x][y] = point;
            points.push([x, y]);
        } else {
            pointTimestamp = 0;
            addPoints();
        }
    }
}

// Reset the game
function reset() {
    // Remove all the point dots from the map
    for (var i = 0; i < points.length; i++) {
        var x = points[i][0];
        var y = points[i][1];
        stage.removeChild(grid[x][y]);
        grid[x][y] = '';
    }

    // Reset variables to the default values    
    movementSpeed = MOVEMENT_SPEED;
    direction = MOVEMENT_DIRECTION;
    movementTimestamp = Date.now() + (0.5 * 1000);
    pointSpeed = POINT_SPEED;
    pointTimestamp = Date.now() - (POINT_SPEED);
    points = [];
    snakeX = grid.length / 2;
    snakeY = grid[snakeX].length / 2;
    grid[snakeX][snakeY] = snake;
    score = 0;

    // Reset the score text
    scoreText.setText("Score: " + score);
}
