class Win extends Phaser.Scene {

    constructor() {
        super('Win');
    }

    init(winner_skin) {
        this.skin = winner_skin
    }

    create() {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, this.winnerText(), {fontFamily: '"sans-serif"', fontSize: '30px'})
            .setOrigin(0.5);
    }

    update() {
        let key = this.input.keyboard.addKey('ENTER')
        if( key.isDown ) {
            this.returnToMenu();
            key.destroy();
        }
    }

    returnToMenu() {
        this.scene.start('Menu');
    }

    winnerText() {
        if (this.skin) {
            return `"${this.skin}" won! Press Enter to return to main menu.`
        }

        return 'Opponent left! Press Enter to return to main menu.'
    }
}

export default Win;