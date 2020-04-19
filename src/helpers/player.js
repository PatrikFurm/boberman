import {
    PING, TILE_SIZE, MAX_SPEED, STEP_SPEED, INITIAL_SPEED, SPEED, POWER, DELAY,
    MIN_DELAY, STEP_DELAY, INITIAL_DELAY, INITIAL_POWER, STEP_POWER
} from '../helpers/constants';

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(data) {
        super(data.scene, data.spawn.x - TILE_SIZE / 2, data.spawn.y - TILE_SIZE / 2, 'white_player', 10);

        this.scene = data.scene;
        this.id = data.id;
        this.skin = data.skin;
        this.alive = true;

        this._lastBombTime = 0;

        this.speed = INITIAL_SPEED;
        this.delay = INITIAL_DELAY;

        this.blockLayer = data.blockLayer;

        this.prevPosition = { x: data.spawn.x, y: data.spawn.y };
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);

        this.defineSelf(data.name, data.spawn.x, data.spawn.y);

        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNumbers('white_player', { start: 0, end: 2 , first: 0}),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNumbers('white_player', { start: 9, end: 11, first: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('white_player', { start: 6, end: 8, first: 6 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('white_player', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.definePhysics();
        this.defineKeyboard()
    }

    definePhysics() {
        this.scene.physics.add.existing(this);
        this.scene.physics.add.collider(this, this.blockLayer);
    }

    defineKeyboard() {
        let cursors = this.scene.input.keyboard.createCursorKeys();
        this.upKey    = cursors.up;
        this.downKey  = cursors.down;
        this.leftKey  = cursors.left;
        this.rightKey = cursors.right;
        this.spaceKey = cursors.space;
    }

    handleMoves() {
        if ( this.alive ) {
            this.body.setVelocity(0);

            if (this.leftKey.isDown) {
                this.body.setVelocityX(-this.speed);
                this.anims.play('left', true);
            }
            else if (this.rightKey.isDown) {
                this.body.setVelocityX(this.speed);
                this.anims.play('right', true);
            }
            else if (this.upKey.isDown) {
                this.body.setVelocityY(-this.speed);
                this.anims.play('up', true);
            }
            else if (this.downKey.isDown) {
                this.body.setVelocityY(this.speed);
                this.anims.play('down', true);
            }
            else {
                this.anims.stop();
            }

            this.name.setPosition(this.body.position.x + 13.5, this.body.position.y - 10);
            this.name.setOrigin(0.5);

        }
    }

    handleBombs() {
        if ( this.spaceKey.isDown ) {
            let now = this.scene.time.now;

            if ( now > this._lastBombTime ) {
                this._lastBombTime = now + this.delay;
                this.scene.onShowBomb({bomb_id: 'xxx', col: this.currentCol(), row: this.currentRow()});
            }
        }
    }

    currentCol(){
        return Math.floor(this.body.position.x / TILE_SIZE)
    }

    currentRow() {
        return Math.floor(this.body.position.y / TILE_SIZE)
    }

    defineSelf(name, x, y) {
        this.name = new Phaser.GameObjects.Text(this.scene, x, y, `\u272E ${name} \u272E`, {fontFamily: 'Areal', fontSize: '15px'});
        this.scene.add.existing(this.name);
    }
}