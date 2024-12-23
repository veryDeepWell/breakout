const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let paddle;
let ball;
let bricks;
let cursors;
let score = 0;
let scoreText;

function preload() {
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('brick', 'assets/brick.png');
}

function create() {
    paddle = this.physics.add.sprite(400, 550, 'paddle').setImmovable();
    paddle.setDisplaySize(100, 20);
    paddle.body.setSize(100, 20);
    paddle.body.collideWorldBounds = true;

    ball = this.physics.add.sprite(400, 500, 'ball');
    ball.setDisplaySize(20, 20);
    ball.body.setSize(20, 20);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(200, -200);

    bricks = this.physics.add.staticGroup();

    for (let y = 50; y < 200; y += 30) {
        for (let x = 100; x < 700; x += 50) {
            const brick = bricks.create(x, y, 'brick');
            brick.setDisplaySize(48, 20);
            brick.body.setSize(48, 20);
        }
    }

    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) {
        paddle.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(300);
    } else {
        paddle.setVelocityX(0);
    }

    if (ball.y > 600) {
        this.add.text(300, 300, 'Game Over', { fontSize: '40px', fill: '#ff0000' }).setOrigin(0.5);
        this.physics.pause();
    }
}

function hitPaddle(ball, paddle) {
    const diff = ball.x - paddle.x;
    ball.setVelocity(diff * 5, ball.body.velocity.y);
}

function hitBrick(ball, brick) {
    brick.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (bricks.countActive() === 0) {
        this.add.text(400, 300, 'You Win!', { fontSize: '40px', fill: '#00ff00' }).setOrigin(0.5);
        this.physics.pause();
    }
}
//yalopata
//veryDeepWell