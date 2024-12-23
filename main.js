// Основная настройка игры на Phaser
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
    // Загружаем изображения
    this.load.image('paddle', 'assets/paddle.png'); // Укажите путь к изображению каретки
    this.load.image('ball', 'assets/ball.png');     // Укажите путь к изображению мяча
    this.load.image('brick', 'assets/brick.png');   // Укажите путь к изображению кирпича
}

function create() {
    // Добавляем платформу (paddle)
    paddle = this.physics.add.sprite(400, 550, 'paddle').setImmovable();
    paddle.setDisplaySize(100, 20); // Обрезаем изображение до 100x20
    paddle.body.setSize(100, 20); // Устанавливаем физический хитбокс
    paddle.body.collideWorldBounds = true;

    // Добавляем мяч
    ball = this.physics.add.sprite(400, 500, 'ball');
    ball.setDisplaySize(20, 20); // Обрезаем изображение до 20x20
    ball.body.setSize(20, 20); // Устанавливаем физический хитбокс
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(200, -200);

    // Добавляем кирпичи
    bricks = this.physics.add.staticGroup();

    for (let y = 50; y < 200; y += 30) {
        for (let x = 100; x < 700; x += 50) {
            const brick = bricks.create(x, y, 'brick');
            brick.setDisplaySize(48, 20); // Обрезаем изображение до 48x20
            brick.body.setSize(48, 20); // Устанавливаем физический хитбокс
        }
    }

    // Настроим столкновения
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);

    // Настроим управление
    cursors = this.input.keyboard.createCursorKeys();

    // Добавляем текст для очков
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });
}

function update() {
    // Управление платформой
    if (cursors.left.isDown) {
        paddle.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(300);
    } else {
        paddle.setVelocityX(0);
    }

    // Завершение игры при падении мяча
    if (ball.y > 600) {
        this.add.text(300, 300, 'Game Over', { fontSize: '40px', fill: '#ff0000' }).setOrigin(0.5);
        this.physics.pause();
    }
}

function hitPaddle(ball, paddle) {
    // Изменяем угол отскока в зависимости от точки соприкосновения
    const diff = ball.x - paddle.x;
    ball.setVelocity(diff * 5, ball.body.velocity.y); // Используем setVelocity для изменения обеих компонент скорости мяча
}

function hitBrick(ball, brick) {
    brick.disableBody(true, true);

    // Увеличиваем счет
    score += 10;
    scoreText.setText('Score: ' + score);

    // Победа, если все кирпичи уничтожены
    if (bricks.countActive() === 0) {
        this.add.text(400, 300, 'You Win!', { fontSize: '40px', fill: '#00ff00' }).setOrigin(0.5);
        this.physics.pause();
    }
}
