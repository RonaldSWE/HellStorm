class GamePlay extends Phaser.Scene {
  constructor() {
    super("GamePlay");
  }

  preload() {
    /* ---------- Loading the Assets ---------- */
    this.load.image("bg2", "Assets/Images/Hell Fire.png");
    this.load.image("player", "Assets/Images/Player.png");
    this.load.image("fire_drop", "Assets/Images/Fire Drop.png");
    this.load.image("coin", "Assets/Images/Coin.png");
    this.load.image("force_field", "Assets/Images/Force field.png");
    this.load.image("shield_powerUp", "Assets/Images/ShieldPowerUP.png");
    this.load.audio("coin_sound", "Assets/Audio/Coin sound.mp3");
    this.load.audio("death_sound", "Assets/Audio/Death sound.mp3");
  }

  create() {
    // Creating the Main Menu Background
    this.add.image(400, 300, "bg2").setDisplaySize(800, 600);

    // Creating a physics sprite
    this.player = this.physics.add
      .sprite(600, 600, "player")
      .setDisplaySize(50, 50);
    this.player.setCollideWorldBounds(true);

    /* ---------- TouchScreen Movements ---------- */
    this.player.setInteractive({ draggable: true, cursor: "pointer" });
    this.input.on("drag", (pointer, player, dragX, dragY) => {
      player.setPosition(dragX, dragY);
    });

    // Enable keyboard input for movement
    this.cursor = this.input.keyboard.createCursorKeys();

    // Create a group to manage all falling fire drops
    // Using a group allows collision detection with multiple fire objects
    this.fireGroup = this.physics.add.group();

    // Spawn falling fire drops every 0.4 seconds at random positions
    this.time.addEvent({
      delay: 400,
      callback: () => {
        let x = Phaser.Math.Between(0, this.sys.game.config.width);
        let y = Phaser.Math.Between(0, this.sys.game.config.height);
        // Create fire sprite and add to group with downward velocity
        this.fireGroup.create(x, y, "fire_drop")
          .setDisplaySize(60, 60)
          .setVelocity(0, 50); // Move downward at 50 pixels/second
      },
      loop: true,
    });

    // Detect collision between player and ANY fire drop in the group
    // Using overlap instead of collider for continuous collision checking
    this.physics.add.overlap(this.player, this.fireGroup, (player, fire) => {
      fire.destroy();
      this.sound.play("death_sound");
      this.scene.switch("GameOver");
    });

    // Create a group to manage all falling coins
    // Using a group allows collision detection with multiple coin objects
    this.coinGroup = this.physics.add.group();

    // Spawn falling coins every 1 second at random positions
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        let x = Phaser.Math.Between(0, this.sys.game.config.width);
        let y = Phaser.Math.Between(0, this.sys.game.config.height);
        // Create fire sprite and add to group with downward velocity
        this.coinGroup.create(x, y, "coin")
          .setDisplaySize(60, 60)
          .setVelocity(0, 100); // Move downward at 100 pixels/second
      },
      loop: true,
    });

    // Detect collision between player and ANY coins in the group
    // Using overlap instead of collider for continuous collision checking
    // And also increment the coin count whenever a coin is collected
    let coin_count = 0;

    let coinText = this.add.text(10, 50, `Coins: ${coin_count}`, {
      fontSize: 30,
      fontFamily: "Creepster",
    });

    this.physics.add.overlap(this.player, this.coinGroup, (player, coin) => {
      coin.destroy();
      ++coin_count;
      coinText.setText(`Coins: ${coin_count}`);
      this.sound.play("coin_sound");
    });

  }

  update() {
    /* ---------- Keyboard Movements ---------- */
    if (this.cursor.left.isDown) {
      this.player.x -= 7;
    } else if (this.cursor.right.isDown) {
      this.player.x += 7;
    } else if (this.cursor.space.isDown) {
      this.player.y -= 7;
    } else {
      return 0;
    }
  }
}

export default GamePlay;
