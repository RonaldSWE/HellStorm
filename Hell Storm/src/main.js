import Phaser from "phaser";
import MainMenu from "./Scenes/MainMenu.js";
import GamePlay from "./Scenes/GamePlay.js";
import Shop from "./Scenes/Shop.js";
import GameOver from "./Scenes/GameOver.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 200 } },
  },
  scene: [MainMenu, GamePlay, Shop, GameOver],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
