import { TILESET, LAYER } from '../helpers/constants';

//import Player from '../helpers/player';
import {MyImage} from "../helpers/objects";
import Player from "../helpers/player";
import Bomb from '../helpers/bomb';
//import EnemyPlayer from '../entities/enemy_player';

class Play extends Phaser.Scene {

    init(data) {
        this.clientPlayerId = 1;

        this.currentGame = {
            map_name: data.map_name,
            players: {
                uuid_1: { id: 1, skin: 1, name: "Killer", spawn: { x: 6*35,  y: 4*35 }},
                uuid_2: { id: 2, skin: 2, name: "Slayer", spawn: { x: 7*35,  y: 15*35 }}
            }
        };
    }


    create() {
        this.createMap();
        this.createPlayers();
    }

    update(time, delta) {

        if ( this.player ) {
            this.player.handleMoves();
            this.player.handleBombs();
        }
    }

    createMap() {
        this.map = this.add.tilemap(this.currentGame.map_name);

        let tiles = this.map.addTilesetImage(TILESET);
        this.blockLayer = this.map.createStaticLayer('Blocks', tiles);

        this.game.scale.resize(980, 630);

        if ( this.currentGame.map_name == 'cold_map' )
            this.blockLayer.setCollisionBetween(1, 2);
        else
            this.blockLayer.setCollisionBetween(4, 5);

        this.player  = null;
        //this.enemies = this.game.add.group();

        this.bombs = this.add.group();
    }

    createPlayers() {
        for (let player of Object.values(this.currentGame.players)) {
            let setup = {
                scene:   this,
                blockLayer: this.blockLayer,
                id:     player.id,
                spawn:  player.spawn,
                skin:   player.skin,
                name:   player.name
            };

            if (player.id === this.clientPlayerId) {
                this.player = new Player(setup);
                this.physics.add.existing(this.player);
                this.physics.add.collider(this.player, this.blockLayer);
            }
            else {
                //this.enemies.add(new EnemyPlayer(setup))
            }
        }
    }

    onShowBomb({bomb_id, col, row}){
        this.bombs.add(new Bomb(this, bomb_id, col, row));
        this.physics.add.collider(this.player, this.bombs);
    }
}

export default Play;