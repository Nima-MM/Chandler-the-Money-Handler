/** @format */

import Phaser from 'phaser';

class GameScene extends Scene {
    // TODO !CONSTRUCTOR!
  constructor() {
    super({ key: 'GameScene' }); 

    var gameClock = new Phaser.Time.Clock(game.scene);
  }

    // !preload
  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.setPath('assets/audio/SoundEffects');

    this.load.audio('aLStep_player', 'single_footstep_1.wav');
    this.load.audio('aRStep_player', 'single_footstep_1.wav');
    // // this.load.audio('aLStep_player', 'single_Ffootstep_drum_1.wav');
    // // this.load.audio('aRStep_player', 'single_Ffootstep_drum_1.wav');
    this.load.audio('aJump_player', 'single_Ffootstep_snare_2.wav');
    // // this.load.audio('aCollectStar', 'collect_timer_1.wav');
    this.load.audio('aCollectStar', 'single_Ffootstep_drum_1.wav');

    this.load.setPath('assets/audio/Tracks');

    this.load.audio(
      'aBackground',
      'Alan Walker - Lily short - compact.mp3'
    );
  }

    // !create
  create() {
    // TODO BUTTON
    // // const btn = document.getElementById('#helloButton');

   
    this.add.image(400, 300, 'sky');

    this.aBackground = this.sound.add('aBackground');
    this.aBackground.play({ loop: true });
    this.aLStep_player = this.sound.add('aLStep_player');
    this.aRStep_player = this.sound.add('aRStep_player');
    this.aJump_player = this.sound.add('aJump_player');
    this.aCollectStar = this.sound.add('aCollectStar');

    const platforms = this.physics.add.staticGroup();
    const player = this.physics.add.sprite(100, 450, 'dude');
    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 50, stepX: 70 },
    });
    const bombs = this.physics.add.group();



    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(platforms, stars);
    this.physics.add.collider(platforms, bombs);
    this.physics.add.collider(stars, stars);
    this.physics.add.collider(bombs, bombs);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.overlap(player, stars, collectStar, null, this);

    function hitBomb(player, bomb) {
      this.physics.pause();
      this.aBackground.stop();
      player.setTint(0xff0000);
      player.anims.play('turn');
      gameOver = true;
      player.setActive(false); ////.setVisible(false);
    }

    function collectStar(player, star) {
      star.disableBody(true, true);

      score += 1;

      if (score == 12) {
        scoreText.setText("I'm rich bitch");
        // // this.aBackground.play('aBackground_alan');
      } else {
        scoreText.setText('Stars: ' + score);
      }

      if (!this.aCollectStar.isPlaying) {
        this.aCollectStar.play();
      }

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

    var cursors = this.input.keyboard.createCursorKeys();

    var scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '25px',
      fill: '#000',
    });

      // Timer
    var timerText = this.add
      .text(784, 16, 'Timer: 0', {
        fontSize: '25px',
        fill: '#000',
      })
      .setOrigin(1, 0); 
      
    let gameClock = this.time.addEvent({
      delay: 10, // duration in milliseconds
      callback: updateTimer,
      callbackScope: this,
      loop: true,
    });   
    
    function updateTimer() {
        /** increase timer by 0.01 sec */
      let timer;
      timer += 0.01;
        /** separating seconds from milliseconds */ 
      let formattedTimer = timer.toFixed(2);
        /** update text for timer */ 
      timerText.setText('Timer: ' + formattedTimer);
      if (!player.active) {
        // player hitted by a bomb... stop timer
        gameClock.remove();
      }
    }

 
        // TODO BUTTONTXT
    var restartButton = this.add.text(250, 250, 'Hello Phaser!', {
      fill: '0#f0',
    });

    restartButton.setInteractive();
    restartButton.on('pointerdown', () => {
      console.log('pointerdown');
    });
  }

    // !Update
  update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
      if (!this.aLStep_player.isPlaying) {
        this.aLStep_player.play();
      }
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
      if (!this.aRStep_player.isPlaying) {
        this.aRStep_player.play();
      }
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-320);
      if (!this.aJump_player.isPlaying) {
        this.aJump_player.play();
      }
    }
  }
}

export default GameScene;
