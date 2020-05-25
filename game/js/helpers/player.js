import {
    PING, TILE_SIZE, MAX_SPEED, STEP_SPEED, INITIAL_SPEED, SPEED, POWER, DELAY,
    MIN_DELAY, STEP_DELAY, INITIAL_DELAY, INITIAL_POWER, STEP_POWER, EXPLOSION_TIME
} from './constants';
import Info from './info';

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(data) {
        super(data.scene, data.spawn.x - TILE_SIZE / 2, data.spawn.y - TILE_SIZE / 2, data.skin, 10);

        this.scene  = data.scene;
        this.id     = data.id;
        this.skin   = data.skin;
        this.alive  = true;

        this._lastBombTime = 0;
        this.anim_id = '_' + Math.random().toString(36).substr(2, 9);

        /* nastavenie hraca */
        this.speed = INITIAL_SPEED;
        this.delay = 1;
        this.power = INITIAL_POWER;

        this.blockLayer = data.blockLayer;

        this.info = new Info({ game: this.scene, player: this });

        /* pohyb */
        this.prevPosition = { x: data.spawn.x, y: data.spawn.y };
        this.scene.time.removeAllEvents();
        this.scene.time.addEvent({delay: PING, callback: this.positionUpdaterLoop, callbackScope: this, loop: true})


        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);

        this.defineSelf(data.name, data.spawn.x, data.spawn.y);

        this.scene.anims.create({
            key: 'up' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(this.skin, { start: 0, end: 2 , first: 0}),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'down' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(this.skin, { start: 9, end: 11, first: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'left' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(this.skin, { start: 6, end: 8, first: 6 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'right' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(this.skin, { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.definePhysics();
        this.defineKeyboard()
    }

    positionUpdaterLoop() {
        if ( this.alive ) {
            let newPosition = {x: this.body.position.x, y: this.body.position.y}

            if (this.prevPosition.x !== newPosition.x || this.prevPosition.y !== newPosition.y) {
                clientSocket.emit('update player position', newPosition);
                this.prevPosition = newPosition;
            }
        }
    }

    definePhysics() {
        this.scene.physics.add.existing(this);
        this.scene.physics.add.collider(this, this.blockLayer);

        this.body.setSize(15,15, true);
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
                this.anims.play('left' + this.skin + this.anim_id, true);
            }
            else if (this.rightKey.isDown) {
                this.body.setVelocityX(this.speed);
                this.anims.play('right' + this.skin + this.anim_id, true);
            }
            else if (this.upKey.isDown) {
                this.body.setVelocityY(-this.speed);
                this.anims.play('up' + this.skin + this.anim_id, true);
            }
            else if (this.downKey.isDown) {
                this.body.setVelocityY(this.speed);
                this.anims.play('down' + this.skin + this.anim_id, true);
            }
            else {
                this.anims.stop();
                this.setFrame(10);
            }

            this.name.setPosition(this.body.position.x + 7.5, this.body.position.y - 22.5);
            this.name.setOrigin(0.5);

        }
    }

    handleBombs() {
        let lastPos = {col: 0, row: 0}
        if ( this.alive ) {
            if (this.spaceKey.isDown) {
                  clientSocket.emit('create bomb', {col: this.currentCol(), row: this.currentRow()});
            }
        }
    }

    pickSpoil( spoil_type ){
        if ( spoil_type === SPEED ){ this.increaseSpeed() }
        if ( spoil_type === POWER ){ this.increasePower() }
        if ( spoil_type === DELAY ){ this.increaseDelay() }
    }

    increaseSpeed(){
        if (this.speed < MAX_SPEED) {
            this.speed = this.speed + STEP_SPEED;
        }
    }

    increaseDelay(){
        if (this.delay < MIN_DELAY){
            this.delay += STEP_DELAY;
        }
    }

    increasePower(){
        this.power += STEP_POWER;
    }

    currentCol(){
        return Math.floor(this.body.position.x / TILE_SIZE)
    }

    currentRow() {
        return Math.floor(this.body.position.y / TILE_SIZE)
    }

    becomesDead() {
        this.alive = false
        this.info.showDeadInfo()
        this.destroy();
        this.name.visible = false;
    }

    defineSelf(name, x, y) {
        this.name = new Phaser.GameObjects.Text(this.scene, x, y, `\u272E ${name} \u272E`, {fontFamily: 'Areal', fontSize: '15px'});
        this.scene.add.existing(this.name);
    }
}