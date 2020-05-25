import { MyImage, MyText } from '../helpers/objects';

class Pending_game extends Phaser.Scene {

    constructor() {
        super('Pending_game');
    }

    init(data) {
        this.game_id = data.game_id;
        this.map_name = data.map_name;

        this.playerSlots = null;

        this.leftGameButton = null;
        this.game_started = false;
        this.current_game = null;


        clientSocket.on('update game', this.displayGameInfo.bind(this));
        clientSocket.on('launch game', this.launchGame.bind(this));

        clientSocket.emit('enter pending game', { game_id: this.game_id });
    }

    create() {
        this.game_started = false;

        let background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'lobby_menu')
            .setOrigin(0.5);

        let selectedMap = this.add.image(this.cameras.main.centerX - 180, this.cameras.main.centerY + 30, this.map_name + '_preview')
            .setOrigin(0.5)
            .setScale(0.7,0.7);

        this.leftGameButton = this.add.text(this.cameras.main.centerX - 180, this.cameras.main.centerY + 120, 'Left Lobby', {fontFamily: '"sans-serif"', fontSize: '30px'})
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.hoverState(this.leftGameButton))
            .on('pointerout',  () => this.removeHoverState(this.leftGameButton))
            .on('pointerdown', () => this.leaveGameAction());

        this.startGameButton = this.add.text(this.cameras.main.centerX + 180, this.cameras.main.centerY + 120, 'Start Game', {fontFamily: '"sans-serif"', fontSize: '30px', color: '#ccc'})
            .setOrigin(0.5)
            .removeInteractive()
            .on('pointerover', () => this.hoverState(this.startGameButton))
            .on('pointerout',  () => this.removeHoverState(this.startGameButton))
            .on('pointerdown', () => {
                this.startGameAction()
            });
    }

    displayGameInfo( {current_game} ) {
        let players = Object.values(current_game.players);
        this.current_game = current_game;

        if ( this.playerSlots ) {
            this.playerSlots.clear(true);
        }

        this.playerSlots = this.add.group();
        let slotBox;
        let slotName;
        let offset = this.cameras.main.centerX - 34;
        let y = this.cameras.main.centerY + 15;

        for ( var i = 0; i < 4; i++ ){
            let _player = players[i];

            if  ( _player ) {
                slotBox = new MyImage(this, offset, y, _player.skin + "_preview");
                slotName = new MyText(this, offset, y + 50, _player.name, {fontSize: '20px'});
                this.playerSlots.add(slotBox, true);
                this.playerSlots.add(slotName, true);
            }
            offset += 89.5;
        }

        this.startGameButton
            .setStyle({color: '#cccccc', fontSize: '20px'})
            .removeInteractive();

        if ( players.length > 1 ) {
            this.startGameButton
                .setStyle({color: '#FFFFFF', fontSize: '30px'})
                .setInteractive({useHandCursor: true});
        }


    }

    hoverState(obj) {
        obj.setStyle({fontSize: '32px'})
    }

    removeHoverState(obj) {
        obj.setStyle({fontSize: '30px'})
    }

    leaveGameAction() {
        clientSocket.emit('leave pending game');
        this.scene.start('Menu');
    }

    startGameAction() {
        clientSocket.emit('start game');
        this.scene.start('Play', this.current_game);
    }

    launchGame(game) {
        if ( !this.game_started ) {
            this.game_started = true;
            this.scene.start('Play', game);
        }
    }
}

export default Pending_game;