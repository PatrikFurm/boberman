export class MyText extends Phaser.GameObjects.Text{
    constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style);

        this.setOrigin(0.5);
        scene.add.existing(this);
    }
}

export class MyImage extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.setOrigin(0.5);
        scene.add.existing(this);
    }
}

export class GameSlots {
    constructor({ scene, availableGames, callback, callbackContext, x, y, style }) {
        this.group = scene.add.group();

        for ( let availableGame of availableGames ) {
            let yOffset = y;
            let game = new Phaser.GameObjects.Text(scene, x, y,`Join Game: ${availableGame.name}`, style)
                .setOrigin(0.5)
                .on('pointerdown', () => this.callScene('select_map'));

            yOffset += 50;

            this.group.add(game);
        }

        scene.add.existing(this.group);
    }

    destroy() {
        this.group.clear();
    }
}