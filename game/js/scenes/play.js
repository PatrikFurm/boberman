import { TILESET, LAYER, TILE_SIZE } from '../helpers/constants';
import { findFrom, findAndDestroyFrom } from '../helpers/finders';
import { MyImage } from "../helpers/objects";

import Player from "../helpers/player";
import EnemyPlayer from '../helpers/enemy_player';
import Bomb from '../helpers/bomb';
import FireBlast from '../helpers/fire_blast';
import Spoil from '../helpers/spoil';

class Play extends Phaser.Scene {

    init(data) {
        this.currentGame = data
    }


    create() {
        this.createMap();
        this.createPlayers();

        this.setEventHandlers();
        this.time.addEvent({delay: 400, callback: this.stopAnimationLoop, callbackScope: this, loop: true})
    }

    createMap() {
        this.map = this.add.tilemap(this.currentGame.map_name);
        this.map.addT

        let tiles = this.map.addTilesetImage(TILESET);
        this.blockLayer = this.map.createDynamicLayer('Blocks', tiles);

        this.game.scale.resize(980, 630);

        if ( this.currentGame.map_name == 'cold_map' )
            this.blockLayer.setCollisionBetween(1, 2);
        else
            this.blockLayer.setCollisionBetween(4, 5);

        this.player  = null;
        this.enemies = this.add.group();

        this.bombs   = this.add.group();
        this.blasts  = this.add.group();
        this.spoils  = this.add.group();

        this.bones   = this.add.group();
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

            if (player.id === clientSocket.id) {
                this.player = new Player(setup);
                this.physics.add.existing(this.player);
                this.physics.add.collider(this.player, this.blockLayer);
            }
            else {
                this.enemies.add(new EnemyPlayer(setup))
            }
        }
    }

    setEventHandlers() {
        clientSocket.on('move player',          this.onMovePlayer.bind(this));

        clientSocket.on('show bomb',            this.onShowBomb.bind(this));
        clientSocket.on('detonate bomb',        this.onDetonateBomb.bind(this));

        clientSocket.on('player win',           this.onPlayerWin.bind(this));
        clientSocket.on('show bones',           this.onShowBones.bind(this));

        clientSocket.on('spoil was picked',     this.onSpoilWasPicked.bind(this));

        clientSocket.on('player disconnect',    this.onPlayerDisconnect.bind(this));
    }

    stopAnimationLoop() {
        for (let enemy of this.enemies.getChildren()) {
            if (enemy.lastMoveAt < this.time.now - 200) {
                enemy.anims.stop();
                enemy.setFrame(10);
            }
        }
    }

    onMovePlayer({ player_id, x, y }) {
        try {
            let enemy = findFrom(player_id, this.enemies);
            if (!enemy) {
                return
            }

            enemy.goTo({x: x, y: y})
        }
        catch (e) {}
    }

    onPlayerVsBlast(player, blast) {
        if (player.alive) {
            clientSocket.emit('player died', { col: player.currentCol(), row: player.currentRow() });
            player.becomesDead()
        }
    }

    onPlayerVsSpoil(player, spoil) {
        clientSocket.emit('pick up spoil', { spoil_id: spoil.id });
        spoil.destroy();
    }

    onShowBones({ player_id, col, row }) {
        let bone = new MyImage(this, col * TILE_SIZE + 15, row * TILE_SIZE + 15, 'bone_tileset');
        this.bones.add(bone);

        findAndDestroyFrom(player_id, this.enemies)
    }

    onSpoilWasPicked({ player_id, spoil_id, spoil_type }){

        if (player_id === this.player.id){
            this.player.pickSpoil(spoil_type)
        }

        findAndDestroyFrom(spoil_id, this.spoils)
    }

    onPlayerDisconnect({ player_id }) {
        findAndDestroyFrom(player_id, this.enemies);

        if (this.enemies.children.length >= 1) { return }

        this.onPlayerWin()
    }

    update(time, delta) {

        if ( this.player ) {
            this.player.handleMoves();
            this.player.handleBombs();

            this.physics.add.collider(this.player, this.blockLayer);
            this.physics.add.collider(this.player, this.enemies);

            this.physics.overlap(this.player, this.blasts, this.onPlayerVsBlast, null, this);
            this.physics.overlap(this.player, this.spoils, this.onPlayerVsSpoil, null, this);
        }
    }

    onPlayerWin(winner_skin) {
        clientSocket.emit('leave game');

        this.scene.start('Win', winner_skin);
    }

    onShowBomb({bomb_id, col, row}){
        this.bombs.add(new Bomb(this, bomb_id, col, row));
        this.physics.add.collider(this.player, this.bombs);
    }

    onDetonateBomb({ bomb_id, blastedCells  }) {
        findAndDestroyFrom(bomb_id, this.bombs);

        for (let cell of blastedCells) {
            this.blasts.add(new FireBlast(this, cell));
        };

        for (let cell of blastedCells) {
            if (!cell.destroyed) { continue }

            this.map.putTileAt(this.blockLayer.layer.properties.empty, cell.col, cell.row);
        };

        for (let cell of blastedCells) {
            if (!cell.destroyed) { continue }
            if (!cell.spoil) { continue }

            this.spoils.add(new Spoil(this, cell.spoil));
        };
    }
}

export default Play;