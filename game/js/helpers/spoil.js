import { SPEED, POWER, DELAY, TILE_SIZE } from './constants';

export default class Spoil extends Phaser.GameObjects.Sprite {

    constructor(scene, spoil) {

        let spoil_type;
        if (spoil.spoil_type === DELAY) {
            spoil_type = 0
        }
        if (spoil.spoil_type === POWER) {
            spoil_type =  1
        }
        if (spoil.spoil_type === SPEED) {
            spoil_type = 2
        }

        super(scene, (spoil.col * TILE_SIZE) + 17, (spoil.row * TILE_SIZE) + 17, 'spoil_tileset', spoil_type);

        this.id = spoil.id;
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

}