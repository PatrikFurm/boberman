import { TILE_SIZE } from './constants';

export default class FireBlast extends Phaser.GameObjects.Sprite {

    constructor(game, cell) {
        super(game, (cell.col * TILE_SIZE) + 15, (cell.row * TILE_SIZE) + 15, cell.type, 0);

        this.scene = game

        this.scene.anims.create({
            key: 'blast'+cell.type,
            frames: this.scene.anims.generateFrameNumbers(cell.type),
            frameRate: 15,
            repeat: false,
            yoyo: false,
            hideOnComplete: true
        });

        this.setOrigin(0.5);

        this.scene.add.existing(this);

        this.anims.play('blast'+cell.type, false);

        this.scene.physics.world.enable(this);

        this.on('animationcomplete', function () {
            this.destroy();
        }, this);
    }

}