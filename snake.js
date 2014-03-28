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
    renderer.render(stage);
}
