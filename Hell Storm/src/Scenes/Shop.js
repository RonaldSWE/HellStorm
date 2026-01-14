class Shop extends Phaser.Scene {
  constructor() {
    super("Shop");
  }

  preload() {}

  create() {
    // Creating the Shop Background
    this.add.text(200 / 2, 400 / 2, "Coming Soon😈", {
      fontSize: 100,
      fontFamily: "Creepster",
      color: "rgb(255, 0, 0)",
    });
  }

  preload() {}
}

export default Shop;
