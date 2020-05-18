import { MyText } from '../helpers/objects';
import { GameSlots } from '../helpers/objects';

class JoinGame extends Phaser.Scene {

    init () {
        this.slotsWithGame = null;
    }

    create() {
        let background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'join_game');
        background.setOrigin(0.5);

        this.leftGameButton = this.add.text(this.cameras.main.centerX - 180, this.cameras.main.centerY + 120, 'Back', {fontFamily: '"sans-serif"', fontSize: '30px'})
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.hoverState(this.leftGameButton))
            .on('pointerout',  () => this.removeHoverState(this.leftGameButton))
            .on('pointerdown', () => this.leaveGameAction());

        clientSocket.emit('enter lobby', this.displayPendingGames.bind(this));
    }

    displayPendingGames(availableGames) {
        if (this.slotsWithGame) {
            this.slotsWithGame.clear(true)
        }

        this.slotsWithGame = this.add.group();

        let yOffset = this.cameras.main.centerY - 50;
        let game;

        for ( let availableGame of availableGames ) {

            game = new MyText(this, this.cameras.main.centerX, yOffset, `Join Game: ${availableGame.name}`, {fontSize: '30px'});
            game.setInteractive({useHandCursor: true})
                .on('pointerdown', () => this.joinGameAction(availableGame.id, availableGame.map_name));

            yOffset += 40;

            this.slotsWithGame.add(game);
        }
    }

    joinGameAction(game_id, map_name) {
        this.scene.start('Pending_game', {
            game_id: game_id,
            map_name: map_name
        });
    }

    hoverState(obj) {
        obj.setStyle({fontSize: '32px'})
    }

    removeHoverState(obj) {
        obj.setStyle({fontSize: '30px'})
    }

    leaveGameAction() {
        clientSocket.emit('leave lobby');
        this.scene.start('Menu');
    }
}

export default JoinGame;