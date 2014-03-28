var direction = 'right';
var speed = 2.5;

var stage = new PIXI.Stage(0xFFFFFF);
var renderer = PIXI.autoDetectRenderer(600, 400);

document.body.appendChild(renderer.view);

requestAnimFrame(animate);

var snake = new PIXI.Graphics();
snake.beginFill(0x000000);
snake.drawCircle(200, 200, 10);
snake.endFill();
stage.addChild(snake);

function animate() {
    requestAnimFrame(animate);

    if (direction == 'left') { snake.x -= speed; }
    if (direction == 'right') { snake.x += speed; }
    if (direction == 'up') { snake.y -= speed; }
    if (direction == 'down') { snake.y += speed; }

    handleInput();
    renderer.render(stage);
}

function handleInput() {
    KeyboardJS.on('left', function() { direction = 'left'; });
    KeyboardJS.on('right', function() { direction = 'right'; });
    KeyboardJS.on('up', function() { direction = 'up'; });
    KeyboardJS.on('down', function() { direction = 'down'; });
}
