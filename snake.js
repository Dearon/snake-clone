var width = 600;
var height = 400;
var direction = 'right';
var speed = 2.5;

var stage = new PIXI.Stage(0xFFFFFF);
var renderer = PIXI.autoDetectRenderer(width, height);
document.body.appendChild(renderer.view);

var snake = new PIXI.Graphics();
snake.beginFill(0x000000);
snake.drawCircle(0, 0, 10);
snake.endFill();

snake.x = width/2;
snake.y = height/2;
stage.addChild(snake);

main();

function main() {
    input();
    movement();
    collision();
    requestAnimFrame(animate);
}

function animate() {
    renderer.render(stage);
    main();
}

function input() {
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

function movement() {
    if (direction == 'left') { snake.x -= speed; }
    if (direction == 'right') { snake.x += speed; }
    if (direction == 'up') { snake.y -= speed; }
    if (direction == 'down') { snake.y += speed; }
}

function collision() {
    if (snake.x < 0 || snake.x > width || snake.y < 0 || snake.y > height) {
        snake.x = width/2;
        snake.y = height/2;
    }
}
