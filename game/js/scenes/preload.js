/*
import mainMenuImg from "../../assets/menu/main_menu.png";
import selectMapMenu from "../../assets/menu/select_map_menu.png";
import lobbyMenu from "../../assets/menu/lobby_menu.png";

import hotMapPrev from "../../assets/menu/hot_map_preview.png";
import coldMapPrev from "../../assets/menu/cold_map_preview.png";

import assetPlayerPrev1 from "../../assets/champions/prev1.png";
import assetPlayerPrev2 from "../../assets/champions/prev2.png";
import assetPlayerPrev3 from "../../assets/champions/prev3.png";
import assetPlayerPrev4 from "../../assets/champions/prev4.png";

import tiles from "../../assets/maps/tileset.png";
import coldMap from "../../assets/maps/cold_map.json";
import hotMap from "../../assets/maps/hot_map.json";

import whitePlayer from "../../assets/champions/white.png";
import blackPlayer from "../../assets/champions/black.png";
import redPlayer from "../../assets/champions/red.png";
import bluePlayer from "../../assets/champions/blue.png";

import bomb from "../../assets/bombs.png";*/

class Preload extends Phaser.Scene {

    constructor() {
        super('Preload');
    }

    preload() {
        let text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Loading...', { fontFamily: '"Arial"', fontSize: '30px', color: '#FFFFFF', });
        text.setOrigin(0.5);

        // Menu:
        this.load.image('main_menu',        'assets/menu/main_menu.png');
        this.load.image('select_map_menu',  'assets/menu/select_map_menu.png');
        this.load.image('lobby_menu',       'assets/menu/lobby_menu.png');

        // Menu Maps
        this.load.image('hot_map_preview',  'assets/menu/hot_map_preview.png');
        this.load.image('cold_map_preview', 'assets/menu/cold_map_preview.png');

        // prev skins
        this.load.image('asset_player_prev1',   'assets/champions/prev1.png');
        this.load.image('asset_player_prev2',   'assets/champions/prev2.png');
        this.load.image('asset_player_prev3',   'assets/champions/prev3.png');
        this.load.image('asset_player_prev4',   'assets/champions/prev4.png');

        // Maps
        this.load.image('tiles',   'assets/maps/tileset.png');
        this.load.tilemapTiledJSON('cold_map',  'assets/maps/cold_map.json');
        this.load.tilemapTiledJSON('hot_map',   'assets/maps/hot_map.json');

        // champs
        this.load.spritesheet('white_player', 'assets/champions/white.png', {frameWidth: 27, frameHeight: 35});
        this.load.spritesheet('black_player', 'assets/champions/black.png', {frameWidth: 78, frameHeight: 100});
        this.load.spritesheet('red_player',   'assets/champions/red.png',   {frameWidth: 78, frameHeight: 100});
        this.load.spritesheet('blue_player',  'assets/champions/blue.png',  {frameWidth: 78, frameHeight: 100});

        this.load.spritesheet('bomb_tileset',  'assets/bombs.png', {frameWidth: 35, frameHeight: 35});
    }

    create() {
        this.scene.start('Menu');
    }
}

export default Preload;
