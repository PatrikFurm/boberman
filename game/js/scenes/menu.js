class Menu extends Phaser.Scene {

    constructor() {
        super('Menu');
        this.startGameText = "";
        this.joinGameText = "";
    }

    init() {
        this.slotsWithGame = null;

        clientSocket.emit('leave pending game');
    }

    create() {
        let background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'main_menu');
        background.setOrigin(0.5);

        this.startGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 30, 'Start Game', {fontFamily: '"sans-serif"', fontSize: '30px'})
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.hoverState(this.startGameText))
            .on('pointerout',  () => this.removeHoverState(this.startGameText))
            .on('pointerdown', () => this.callScene('select_map'));

        this.joinGameText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 15, 'Join Game', {fontFamily: '"sans-serif"', fontSize: '30px'})
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.hoverState(this.joinGameText))
            .on('pointerout',  () => this.removeHoverState(this.joinGameText))
            .on('pointerdown', () => this.callScene('join_game'));
    }

    hoverState(obj) {
        obj.setStyle({fontSize: '32px'})
    }

    removeHoverState(obj) {
        obj.setStyle({fontSize: '30px'})
    }

    callScene(scene) {
        if ( scene == 'select_map' ) {
            this.scene.start('SelectMap')
        }
        if ( scene == 'join_game' ) {
            this.scene.start('JoinGame')
        }
    }
}

export default Menu;