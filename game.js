const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 240,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let coins;
let cursors;
let cameraSpeed = 120;
let lastPlatformX = 0;
let score = 0;
let scoreText;

function preload() {
  this.load.image('player', 'https://i.imgur.com/QZ6X9bK.png');
  this.load.image('platform', 'https://i.imgur.com/3WbYy5F.png');
  this.load.image('coin', 'https://i.imgur.com/Fz3sC1J.png');
}

function create() {
  platforms = this.physics.add.staticGroup();
  coins = this.physics.add.group();

  // initial ground
  for (let i = 0; i < 6; i++) {
    spawnPlatform(this, i * 80, 210);
  }

  player = this.physics.add.sprite(80, 100, 'player');
  player.setCollideWorldBounds(false);
  player.body.setSize(20, 28);
  player.setBounce(0.05);

  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(player, coins, collectCoin, null, this);

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(10, 10, 'Score: 0', {
    fontSize: '14px',
    fill: '#000'
  }).setScrollFactor(0);

  this.cameras.main.startFollow(player);
  this.cameras.main.setDeadzone(80, 0);
}

function update(time, delta) {
  // auto-run (Mario feel)
  player.setVelocityX(cameraSpeed);

  // jump
  if ((cursors.space.isDown || cursors.up.isDown) && player.body.blocked.down) {
    player.setVelocityY(-420);
  }

  // infinite generation
  if (player.x > lastPlatformX - 200) {
    spawnPlatform(this, lastPlatformX + Phaser.Math.Between(60, 100), Phaser.Math.Between(130, 200));
  }

  // fall = game over
  if (player.y > 300) {
    this.scene.restart();
    score = 0;
  }
}

function spawnPlatform(scene, x, y) {
  const platform = platforms.create(x, y, 'platform');
  platform.refreshBody();
  lastPlatformX = x;

  if (Math.random() < 0.6) {
    const coin = coins.create(x, y - 20, 'coin');
    coin.body.allowGravity = false;
  }
}

function collectCoin(player, coin) {
  coin.destroy();
  score += 10;
  scoreText.setText('Score: ' + score);
}
