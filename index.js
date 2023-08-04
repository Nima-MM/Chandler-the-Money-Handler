/** @format */
/**
 * TODO: i can do this
 *
 * ? i love it
 *
 * ! be careful son
 *
 * * is here to highlight
 *
 * you can see the difference here
 */
/**
  * @module chandler-the-money-handler
  * @author nima
  */
let config = {
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
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

/**
 * !Brief description of the object PLATFORMS here.
 * @name platforms
 * @ {object} [platforms] - static object.
 * @property {class} see - {@link http://phaser.io/docs/2.6.2/index#physics Physics}
 */

let platforms;

/**
 * !Brief description of the object PLAYER here.
 * @name player
 * @ {object} [player] - adding physic sprite - dynamic object of physics.
 * @property {class} see - {@link http://phaser.io/docs/2.6.2/index#physics Physics}
 */

let player;

/**
 * !Brief description of the object STARS here.
 * @name stars
 * @ {object} [stars] - game purpose, stars to collecting - dynamic object of physics.
 * @property {class} see - {@link http://phaser.io/docs/2.6.2/index#physics Physics}
 */

let stars;

/**
 * !Brief description of the object BOMBS here.
 * @name bombs
 * @ {object} [bombs] - game purpose, bomb to challenge - dynamic object of physics.
 * @property {class} see - {@link http://phaser.io/docs/2.6.2/index#physics Physics}
 */

let bombs;

/**
 * !Brief description of the object CURSORS here.
 * @name cursors
 * @description keyboard, mouse control
 */

let cursors;

/**
 * !Brief description of the object SCORETEXT here.
 * @name scoreText
 * @description set-up in create-function to store and display score
 */
let scoreText;

/** @global */
/**
 * !Brief description of the variable score here.
 * @name score
 * @ {variable} [score] - game purpose, counting stars collected
 * @property {variable} counter
 */
let score = 0;

// !experimental

let timer;

function preload() {
  // // this.load.setBaseURL('http://localhost');
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  // // this.add.image(0, 0, 'sky').setOrigin(0, 0);
  /**
   * !Brief description of the add-function here.
   * @name background
   * @param {int, int, string} x, y, image - position in scene
   */ // //   this.add.image(400, 100, 'star');

  this.add.image(400, 300, 'sky');

  /**
   * @name physics
   * @description adding physics to world
   */

  platforms = this.physics.add.staticGroup();
  player = this.physics.add.sprite(100, 450, 'dude');
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });
  bombs = this.physics.add.group();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  /**
   * @name collider
   * @description setting collision of world
   */

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.physics.add.collider(platforms, stars);
  this.physics.add.collider(platforms, bombs);
  // // this.physics.add.collider(stars, stars);
  // // this.physics.add.collider(player, stars);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  /**
   * Brief description of the function overlap here.
   * @name overlap();
   * @summary tell phaser checking if the player overlaps with any star in the stars group or not.
   * @param {ParamDataTypeHere} parameterNameHere - no param known yet
   * @return {ReturnValueDataTypeHere} not known yet.
   */
  this.physics.add.overlap(player, stars, collectStar, null, this);

  function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }

  function collectStar(player, star) {
    star.disableBody(true, true);

    score += 1;
    if (score == 12) {
      scoreText.setText("I'm rich bitch");
    } else {
      scoreText.setText('Score: ' + score);
    }

    /**
     * Brief description of the method countActive() here.
     * @name countActive();
     * @summary Phaser group method to check how many stars are alive.
     * @param {boolean} true - if true, method counts stars active in game
     * @return {int} - returns int value to compare the condition
     */

    if (stars.countActive(true) === 0) {
      /** use phaser iterate-function to re-enable all of the stars and reset their y position to zero */
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      let x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      let bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  /**
   * @name animation
   * @description animations of objects
   * The 'repeat -1' value tells the animation to loop.
   */

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  /**
   * Brief description of the function createCursorKeys() here.
   * @name createCursorKeys();
   * @summary This populates the cursors object with four properties:
   * up, down, left, right, that are all instances of Key objects.
   * @param {ParamDataTypeHere} parameterNameHere - no param known yet
   * @return {ReturnValueDataTypeHere} not known yet.
   */
  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(16, 16, 'score: 0', {
    fontsize: '32px',
    fill: '#000',
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-320);
  }
}
