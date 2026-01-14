class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  preload() {
    this.load.image("bg2", "Assets/Images/Hell Fire.png");
    this.load.image("restart_btn", "Assets/Images/Restart Btn.png");
  }

  create() {
    this.add.image(400, 300, "bg2").setDisplaySize(800, 600);

    this.add.text(350 / 2, 400 / 2, "Game Over☠", {
      fontSize: 100,
      fontFamily: "Creepster",
      color: "rgb(255, 0, 0)",
    });

    this.restart_btn = this.add
      .image(800 / 2, 800 / 2, "restart_btn")
      .setDisplaySize(200, 200);

    this.restart_btn.setInteractive({ cursor: "pointer" });

    this.restart_btn.on("pointerdown", () => {
      this.scene.switch("GamePlay");
    });
  }
}

export default GameOver;
