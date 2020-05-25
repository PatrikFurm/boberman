class Boot extends Phaser.Scene {

    constructor() {
        super({
            key: 'Boot',
            active: true
        });
    }

    create() {

        let text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Loading...', { fontFamily: '"Arial"', fontSize: '30px', color: '#FFFFFF', });
        text.setOrigin(0.5);

        this.scene.start('Preload');
    }
}

export default Boot;
