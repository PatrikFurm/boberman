import Phaser from "phaser";

import Boot from "./scenes/boot";
import Preload from "./scenes/preload";
import Menu from "./scenes/menu";
import SelectMap from "./scenes/select_map";
import Pending_game from "./scenes/pending_game";
import Play from "./scenes/play";
import JoinGame from "./scenes/join_game";
import Win from "./scenes/win";


const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  width: 1366,
  height: 768,
  scene: Boot
};

const game = new Phaser.Game(config);

game.scene.add('Preload',       Preload, false);
game.scene.add('Menu',          Menu, false);
game.scene.add('SelectMap',     SelectMap, false);
game.scene.add('Pending_game',  Pending_game, false);
game.scene.add('Play',          Play, false);
game.scene.add('JoinGame',      JoinGame, false);
game.scene.add('Win',           Win, false);