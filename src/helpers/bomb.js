import { TILE_SIZE, EXPLOSION_TIME } from '../helpers/constants';

export default class Bomb extends Phaser.GameObjects.Sprite {

    constructor(scene, id, col, row) {
        let centerCol = (col * TILE_SIZE) + TILE_SIZE / 2;
        let centerRow = (row * TILE_SIZE) + TILE_SIZE / 2;

        super(scene, centerCol, centerRow, 'bomb_tileset');
        this.setScale(0.7);
        this.setOrigin(0.5);

        this.scene = scene;
        this.id = id;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.tweens.add({
            targets: this,
            scale: {from: 0.7, to: 1.2},
            ease: 'Linear',
            duration: EXPLOSION_TIME,
            yoyo: true
        });

        this.body.immovable = true;


        this.scene.anims.create({
            key: 'bomb',
            frames: this.scene.anims.generateFrameNumbers('bomb_tileset', { start: 0, end: 13 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.play('bomb');
    }

    update() {
        this.game.debug.body(this);
    }

}