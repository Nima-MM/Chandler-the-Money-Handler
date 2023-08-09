import GameScene from "./GameScene";
/**
 * TODO: i can do this
 * ? i love it
 * ! be careful son
 * * is here to highlight
 * you can see the difference here

/**
 * chandler-the-money-handler
 */
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: GameScene
};

var game = new Phaser.Game(config);