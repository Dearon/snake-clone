var width = 600;
var height = 400;
var direction = 'right';
var speed = 2.5;
var score = 0;
var dotInterval = 4 * 1000; // Milliseconds

var stage = new PIXI.Stage(0xFFFFFF);
var renderer = PIXI.autoDetectRenderer(width, height);
document.body.appendChild(renderer.view);

var scoreText = new PIXI.Text("Score: " + score);
scoreText.x = 10;
scoreText.y = 10;
stage.addChild(scoreText);

var snake = new PIXI.Graphics();
snake.beginFill(0x000000);
snake.drawCircle(0, 0, 10);
snake.endFill();

snake.x = width/2;
snake.y = height/2;
stage.addChild(snake);

var dots = [];
var dotTime = 0;

main();

function main() {
    input();
    movement();
    collision();
    addScoreDot();
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
        direction = 'right';
        snake.x = width/2;
        snake.y = height/2;

        score = 0;
        scoreText.setText("Score: " + score);

        for (var i = 0; i < dots.length; i++) {
            stage.removeChild(dots[i]);
        }

        dots = [];
        dotTime = 0;
    }

    for (var i = 0; i < dots.length; i++) {
        if (snake.x >= (dots[i].x - 10) && 
            snake.x <= (dots[i].x + 10) &&
            snake.y >= (dots[i].y - 10) &&
            snake.y <= (dots[i].y + 10)) {
                try {
                    stage.removeChild(dots[i]);
                    dots.slice(i, 2);
                    score += 1;
                    scoreText.setText("Score: " + score);
                } catch(e) {
                    // The collision will trigger multiple times since JS is async
                    // So if we get here it's because we are trying to remove a child from
                    // stage whom doesn't exist any more
                }
        }
    }
}

function addScoreDot() {
    if (dotTime + dotInterval < Date.now()) {
        dotTime = Date.now();
        var dot = new PIXI.Graphics();
        dot.beginFill(0x000000);
        dot.drawCircle(0, 0, 10);
        dot.endFill();

        dot.x = Math.random() * ((width - 10) - 10) + 10;
        dot.y = Math.random() * ((height - 10) - 10) + 10;
        stage.addChild(dot);
        dots.push(dot);
    }
}
