import {TILE_SIZE, PING} from './constants';

export default class EnemyPlayer extends Phaser.GameObjects.Sprite {

    constructor(data) {
        super(data.scene, data.spawn.x - TILE_SIZE / 2, data.spawn.y - TILE_SIZE / 2, data.skin, 10);

        this.scene  = data.scene;
        this.id     = data.id;
        this.skin   = data.skin;

        this.anim_id = '_' + Math.random().toString(36).substr(2, 9);

        this.currentPosition    = data.spawn;
        this.lastMoveAt         = 0;

        this.scene.add.existing(this);

        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.setOrigin(0.5, 0.5);
        this.body.setSize(15,15, true);

        this.defineSelf(data.name, data.spawn.x - TILE_SIZE / 2, data.spawn.y - TILE_SIZE / 2 - 25);

        this.scene.anims.create({
            key: 'up' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(data.skin, { start: 0, end: 2 , first: 0}),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'down' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(data.skin, { start: 9, end: 11, first: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'left' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(data.skin, { start: 6, end: 8, first: 6 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'right' + this.skin + this.anim_id,
            frames: this.scene.anims.generateFrameNumbers(data.skin, { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
    }

    update() {
        this.game.debug.body(this);
    }

    defineSelf(name, x, y) {
        this.name = new Phaser.GameObjects.Text(this.scene, x, y, name, {fontFamily: 'Areal', fontSize: '15px'});
        this.name.setOrigin(0.5);
        this.scene.add.existing(this.name);
    }

    goTo(newPosition) {
        this.lastMoveAt = this.scene.time.now;
        this.animateFace(newPosition);
        this.scene.tweens.add({
            targets: this,
            x: newPosition.x + 7.5,
            y: newPosition.y + 7.5,
            ease: 'Linear',
            duration: PING,
            repeat: false
        });

        this.scene.tweens.add({
            targets: this.name,
            x: newPosition.x + 7.5,
            y: newPosition.y - 22.5,
            ease: 'Linear',
            duration: PING,
            repeat: false
        });
    }

    animateFace(newPosition) {
        let face = 'down' + this.skin;
        let diffX = newPosition.x - this.currentPosition.x;
        let diffY = newPosition.y - this.currentPosition.y;

        if (diffX < 0) {
            face = 'left' + this.skin + this.anim_id;
        } else if (diffX > 0) {
            face = 'right' + this.skin + this.anim_id;
        } else if (diffY < 0) {
            face = 'up' + this.skin + this.anim_id;
        } else if (diffY > 0) {
            face = 'down' + this.skin + this.anim_id;
        } else {
            this.anims.stop();
            this.setFrame(10);
        }

        this.anims.play(face, true);
        this.currentPosition = newPosition;
    }
}