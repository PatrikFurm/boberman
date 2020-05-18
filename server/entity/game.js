
const { TILE_SIZE, EMPTY_CELL, DESTRUCTIBLE_CELL, NON_DESTRUCTIBLE_CELL, SKINS } = require('../constants');

var uuidv4 = require('uuid/v4');
var faker = require('faker');

var { Player } = require('./player');
var { Bomb } = require('./bomb.js');

class Game {
    constructor({ map_name }) {
        this.id           = uuidv4();
        this.name         = faker.commerce.color();
        this.map_name     = map_name;

        this.layer_info   = require('../../game/assets/maps/' + this.map_name + '.json').layers[0];
        this.max_players  = this.layer_info.properties.max_players;

        this.players      = {};
        this.playerSkins  = [...SKINS];
        this.playerSpawns = this.layer_info.properties.spawns.slice();

        this.bombs        = new Map();
        this.spoils       = new Map();

        this.shadow_map   = this.createMapData();
    }

    addPlayer(id) {
        let skin = this.getAndRemoveSkin();
        let [spawn, spawnOnGrid] = this.getAndRemoveSpawn();
        let name = faker.name.firstName().slice(0,5);

        let player = new Player({ id: id, skin: skin, name: name, spawn: spawn, spawnOnGrid: spawnOnGrid });
        this.players[player.id] = player;
    }

    getAndRemoveSkin() {
        let index = 0;
        let randomSkin = this.playerSkins[index];
        this.playerSkins.splice(index, 1);

        return randomSkin;
    }

    getAndRemoveSpawn() {
        let index = Math.floor(Math.random() * this.playerSpawns.length);
        let spawnOnGrid = this.playerSpawns[index];
        this.playerSpawns.splice(index, 1);

        let spawn = { x: spawnOnGrid.col * TILE_SIZE, y: spawnOnGrid.row * TILE_SIZE };
        return [spawn, spawnOnGrid];
    }

    isFull() {
        return Object.keys(this.players).length === this.max_players
    }

    removePlayer(id) {
        let player = this.players[id];

        this.playerSkins.push(player.skin);
        this.playerSpawns.push(player.spawnOnGrid);

        delete this.players[id];
    }

    isEmpty() {
        return Object.keys(this.players).length === 0
    }

    addBomb({ col, row, power }) {
        let bomb = new Bomb({ game: this, col: col, row: row, power: power });
        if ( this.bombs.get(bomb.id) ) {
            return false
        }
        this.bombs.set(bomb.id, bomb);
        return bomb
    }

    findSpoil(spoil_id){
        return this.spoils.get(spoil_id)
    }

    addSpoil(spoil) {
        this.spoils.set(spoil.id, spoil);
    }

    deleteSpoil(spoil_id){
        this.spoils.delete(spoil_id)
    }

    createMapData() {
        let tiles  = this.layer_info.data;
        let width  = this.layer_info.width;
        let height = this.layer_info.height;
        let empty  = this.layer_info.properties.empty;
        let wall   = this.layer_info.properties.wall;
        let balk   = this.layer_info.properties.balk;

        let mapMatrix = [];
        let i = 0;

        for( let row = 0; row < height; row++ ) {
            mapMatrix.push([]);

            for( let col = 0; col < width; col++ ) {
                mapMatrix[row][col] = EMPTY_CELL;

                if( tiles[i] == balk ) {
                    mapMatrix[row][col] = DESTRUCTIBLE_CELL;
                } else if( tiles[i] == wall ) {
                    mapMatrix[row][col] = NON_DESTRUCTIBLE_CELL;
                }

                i++;
            }
        }

        return mapMatrix;
    }

    getMapCell(row, col) {
        return this.shadow_map[row][col]
    }

    nullifyMapCell(row, col) {
        this.shadow_map[row][col] = EMPTY_CELL
    }
}

exports.Game = Game;