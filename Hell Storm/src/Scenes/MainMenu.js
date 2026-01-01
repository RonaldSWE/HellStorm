class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    /* ---------- Loading the Assets ---------- */
    this.load.image("bg", "Assets/Main Menu pic.png");
    this.load.image("play_btn", "Assets/Hell Play.png");
    this.load.image("shop_btn", "Assets/Shop btn.png");
    this.load.audio("hell_screams", "Assets/Hell Screams.mp3");
  }

  create() {
    // Creating the Main Menu Background
    this.add.image(400, 300, "bg").setDisplaySize(800, 600);

    // Adding the game title
    this.add.text(200 / 2, 100 / 2, "Hell Storm", {
      fontSize: 150,
      fontFamily: "Creepster",
      color: "rgb(255, 0, 0)",
    });

    // Creating the play button image
    this.play_btn = this.add
      .image(400, 300, "play_btn")
      .setDisplaySize(200, 200);

    this.shop_btn = this.add
      .image(400, 450, "shop_btn")
      .setDisplaySize(200, 200);

    // Making the play and shop buttons interactive with a cursor of pointer
    this.play_btn.setInteractive({ cursor: "pointer" });
    this.shop_btn.setInteractive({ cursor: "pointer" });

    // Adding the Hell Screams sound as main menu music😈
    this.menuMusic = this.sound.add("hell_screams", {
      loop: true,
      volume: 0.6,
    }); 
    this.menuMusic.play();

    // When Play is clicked
    this.play_btn.on("pointerdown", () => {
      this.menuMusic.stop(); // ⛔ STOP main menu sound
      this.scene.switch("GamePlay"); // ▶ switch scene
    });

    this.shop_btn.on("pointerdown", () => {
      this.menuMusic.stop();
      this.scene.switch("Shop");
    });
  }
}

export default MainMenu;
