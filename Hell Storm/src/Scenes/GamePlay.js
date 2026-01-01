class GamePlay extends Phaser.Scene {
  constructor() {
    super("GamePlay");
  }

  preload() {
    /* ---------- Loading the Assets ---------- */
    this.load.image("bg2", "Assets/Hell Fire.png");
    this.load.image("player", "Assets/Player.png");
    this.load.image("fire_drop", "Assets/Fire Drop.png");
    this.load.image("coin", "Assets/Coin.png");
    this.load.image("force_field", "Assets/Force field.png");
    this.load.image("shield_powerUp", "Assets/ShieldPowerUP.png");
    this.load.audio("coin_sound", "Assets/Coin sound.png");
    this.load.audio("death_sound", "Assets/Death sound.png");
  }

  create() {
    // Creating the Main Menu Background
    this.add.image(400, 300, "bg2").setDisplaySize(800, 600);

    // Creating a physics sprite
    this.player = this.physics.add
      .sprite(400, 400, "player")
      .setDisplaySize(50, 50);
    this.player.setCollideWorldBounds(true);

    /* ---------- TouchScreen Movements ---------- */
    this.player.setInteractive({ draggable: true, cursor: "pointer" });
    this.input.on("drag", (pointer, player, dragX, dragY) => {
      player.setPosition(dragX, dragY);
    });

    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    /* ---------- Keyboard Movements ---------- */
    if (this.cursor.left.isDown) {
      this.player.x -= 4;
    } else if (this.cursor.right.isDown) {
      this.player.x += 4;
    } else if (this.cursor.up.isDown) {
      this.player.y -= 4;
    } else if (this.cursor.down.isDown) {
      this.player.y += 4;
    }
  }
}

export default GamePlay;
