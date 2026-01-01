import Phaser from "phaser";
import MainMenu from "./Scenes/MainMenu.js";
import GamePlay from "./Scenes/GamePlay.js";
import Shop from "./Scenes/Shop.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 550,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 } },
  },
  scene: [MainMenu, GamePlay, Shop],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
