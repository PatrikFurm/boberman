import { AVAILABLE_MAPS } from '../helpers/constants';

class SelectMap extends Phaser.Scene {

    constructor() {
        super('SelectMap');

        this.hotMapImage = "";
        this.coldMapImage = "";
    }

    create() {
        let background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'select_map_menu');
        background.setOrigin(0.5);

        this.hotMapImage = this.add.image(this.cameras.main.centerX - 150, this.cameras.main.centerY + 30, 'hot_map_preview')
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.hoverMap(this.hotMapImage))
            .on('pointerout', () => this.removeHoverMap(this.hotMapImage))
            .on('pointerdown', () => this.mapSelect(0));

        this.coldMapImage = this.add.image(this.cameras.main.centerX + 150, this.cameras.main.centerY + 30, 'cold_map_preview')
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.hoverMap(this.coldMapImage))
            .on('pointerout', () => this.removeHoverMap(this.coldMapImage))
            .on('pointerdown', () => this.mapSelect(1));
    }

    hoverMap(obj) {
        obj.setScale(1.05, 1.05);
    }

    removeHoverMap(obj) {
        obj.setScale(1.0, 1.0);
    }

    mapSelect(index) {
        let map_name = AVAILABLE_MAPS[index];

        this.scene.start('Pending_game', {
            game_id: 1,
            map_name: map_name
        });
    }
}

export default SelectMap;