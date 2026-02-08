import Phaser from "phaser";
import MainMenu from "./Scenes/MainMenu.ts";
import GamePlay from "./Scenes/GamePlay.ts";
import Shop from "./Scenes/Shop.ts";
import GameOver from "./Scenes/GameOver.ts";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 200, x: 0 } },
  },
  scene: [MainMenu, GamePlay, Shop, GameOver],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
