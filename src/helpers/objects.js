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