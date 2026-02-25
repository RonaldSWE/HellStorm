import Phaser from "phaser";

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

  // Game objects
  player!: Phaser.Physics.Arcade.Sprite;
  cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  fireGroup!: Phaser.Physics.Arcade.Group;
  shieldGroup!: any;
  shielded!: any;
  coinGroup!: any;
  forceField!: any;
  shieldTimer!: any;
  pointsText!: Phaser.GameObjects.Text;
  coinText!: Phaser.GameObjects.Text;
  points: number = 0;

  create() {
    // Reset game state
    this.points = 0;

    // Creating the Main Menu Background
    this.add.image(400, 300, "bg2").setDisplaySize(800, 600);

    // Creating a physics sprite
    this.player = this.physics.add
      .sprite(600, 600, "player")
      .setDisplaySize(50, 50);
    this.player.setCollideWorldBounds(true);

    /* ---------- TouchScreen Movements ---------- */
    this.player.setInteractive({ draggable: true, cursor: "pointer" });
    this.input.on(
      "drag",
      (pointer: any, player: any, dragX: number, dragY: number) => {
        player.setPosition(dragX, dragY);
      },
    );

    // Enable keyboard input for movement
    this.cursor = this.input.keyboard!.createCursorKeys();

    // Create a group to manage all falling fire drops
    // Using a group allows collision detection with multiple fire objects
    this.fireGroup = this.physics.add.group();

    // Spawn falling fire drops every 0.5 seconds at random positions
    this.time.addEvent({
      delay: 500,
      callback: () => {
        let x = Phaser.Math.Between(0, Number(this.sys.game.config.width));
        let y = 0; // This makes sure the fire only spawns from the top
        // Create fire sprite and add to group with downward velocity
        this.fireGroup
          .create(x, y, "fire_drop")
          .setDisplaySize(60, 60)
          .setVelocity(0, 200); // Move downward at 200 pixels/second
      },
      loop: true,
    });

    // Detect collision between player and ANY fire drop in the group
    // Using overlap instead of collider for continuous collision checking
    this.physics.add.overlap(this.player, this.fireGroup, (player, fire) => {
      fire.destroy();

      // Only trigger game over if player is not shielded
      if (!this.shielded) {
        this.sound.play("death_sound");
        this.scene.switch("GameOver");
      }
    });

    // Create a group to manage all falling coins
    // Using a group allows collision detection with multiple coin objects
    this.coinGroup = this.physics.add.group();

    // Spawn falling coins every 1 second at random positions
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        let x = Phaser.Math.Between(0, Number(this.sys.game.config.width));
        let y = 0;
        // Create fire sprite and add to group with downward velocity
          this.coinGroup
            .create(x, y, "coin")
            .setDisplaySize(60, 50)
            .setVelocity(0, 100); // Move downward at 100 pixels/second
      },
      loop: true,
    });

    // Detect collision between player and ANY coins in the group
    // Using overlap instead of collider for continuous collision checking
    // And also increment the coin count whenever a coin is collected
    let coin_count = 0;

    this.coinText = this.add.text(10, 50, `Coins: ${coin_count}`, {
      fontSize: 30,
      fontFamily: "Creepster",
    });

    this.pointsText = this.add.text(10, 10, `Points: ${this.points}`, {
      fontSize: 30,
      fontFamily: "Creepster",
    });

    // When the player hits a coin, increment the coin count
    this.physics.add.overlap(this.player, this.coinGroup, (player, coin) => {
      coin.destroy();
      ++coin_count;
      this.coinText.setText(`Coins: ${coin_count}`);
      this.sound.play("coin_sound");
    });

    // Create a group to manage all falling shields
    // Using a group allows collision detection with multiple coin objects
    this.shieldGroup = this.physics.add.group();

    // Spawn falling shields every 10 second at random positions
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        let x = Phaser.Math.Between(0, Number(this.sys.game.config.width));
        let y = 0;
        // Create fire sprite and add to group with downward velocity
        this.shieldGroup
          .create(x, y, "shield_powerUp")
          .setDisplaySize(60, 60)
          .setVelocity(0, 50); // Move downward at 50 pixels/second
      },
      loop: true,
    });

    // Detect collision between player and ANY shields in the group
    // Using overlap instead of collider for continuous collision checking
    this.shielded = false;
    this.forceField = null;
    this.shieldTimer = null;

    this.physics.add.overlap(
      this.player,
      this.shieldGroup,
      (player, shield) => {
        shield.destroy();

        // If a shield timer is already running, cancel it
        if (this.shieldTimer) {
          this.shieldTimer.remove();
        }

        // If shield doesn't exist, create it
        if (!this.forceField) {
          this.forceField = this.add
            .image(this.player.x, this.player.y, "force_field")
            .setDisplaySize(100, 100);
          this.shielded = true;
        }

        // Add or extend shield by 10 seconds
        this.shieldTimer = this.time.delayedCall(10000, () => {
          if (this.forceField) {
            this.forceField.destroy();
            this.forceField = null;
          }
          this.shielded = false;
          this.shieldTimer = null;
        });
      },
    );
  }

  update() {
    // Keep force field following the player
    if (this.forceField && this.forceField.active) {
      this.forceField.setPosition(this.player.x, this.player.y);
    }

    // Check if fire drops have fallen off screen and increment points
    const screenHeight = Number(this.sys.game.config.height);
    this.fireGroup.children.entries.forEach((fire: any) => {
      if (fire.y > screenHeight) {
        fire.destroy();
        ++this.points;
        this.pointsText.setText(`Points: ${this.points}`);
      }
    });

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
