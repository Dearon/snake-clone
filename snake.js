// Constants
var WIDTH = 600;
var HEIGHT = 400;
var COLORS = [
    "0x0F380F",
    "0x306230",
    "0x8BAC0F",
    "0x9BBC0F"
];
var STARTING_SPEED = 0.2 * 1000; // Milliseconds
var STARTING_DIRECTION = 'right';

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

// Set misc variables
var speed = STARTING_SPEED;
var direction = STARTING_DIRECTION;
var timestamp = 0;

// Create the snake and add it to the stage
var snake = new PIXI.Graphics();
snake.beginFill(COLORS[0]);
snake.drawRect(0, 0, 10, 10);
snake.endFill();
stage.addChild(snake);

// Add the snake to the center of the grid
var snakeX = grid.length / 2;
var snakeY = grid[snakeX].length / 2;
grid[snakeX][snakeY] = snake;

// Start the core loop
main();
function main() {
    handleInput();
    moveSnake();
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
    KeyboardJS.on('left', function() { direction = 'left'; });
    KeyboardJS.on('right', function() { direction = 'right'; });
    KeyboardJS.on('up', function() { direction = 'up'; });
    KeyboardJS.on('down', function() { direction = 'down' });
}

// Moves the snake
function moveSnake() {
    if (timestamp + speed < Date.now()) {
        timestamp = Date.now();

        grid[snakeX][snakeY] = '';
        if (direction == 'right') { snakeX += 1; }
        if (direction == 'left') { snakeX -= 1; }
        if (direction == 'up') { snakeY -= 1; }
        if (direction == 'down') { snakeY += 1; }
        grid[snakeX][snakeY] = snake;
    }
}
