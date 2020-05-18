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
        this.load.image('join_game',        'assets/menu/join_game.png');

        // Menu Maps
        this.load.image('hot_map_preview',  'assets/menu/hot_map_preview.png');
        this.load.image('cold_map_preview', 'assets/menu/cold_map_preview.png');

        // prev skins
        this.load.image('white_player_preview',    'assets/champions/prev1.png');
        this.load.image('black_player_preview',    'assets/champions/prev2.png');
        this.load.image('red_player_preview',      'assets/champions/prev3.png');
        this.load.image('blue_player_preview',     'assets/champions/prev4.png');

        // kosti
        this.load.image('bone_tileset',   'assets/champions/skull.png');

        // bonusy
        this.load.spritesheet('spoil_tileset',   'assets/spoil_tileset.png', {frameWidth: 35, frameHeight: 35});

        // Maps
        this.load.image('tiles',   'assets/maps/tileset.png');
        this.load.tilemapTiledJSON('cold_map',  'assets/maps/cold_map.json');
        this.load.tilemapTiledJSON('hot_map',   'assets/maps/hot_map.json');

        // champs
        this.load.spritesheet('white_player', 'assets/champions/white.png', {frameWidth: 27, frameHeight: 35});
        this.load.spritesheet('black_player', 'assets/champions/black.png', {frameWidth: 27, frameHeight: 35});
        this.load.spritesheet('red_player',   'assets/champions/red.png',   {frameWidth: 27, frameHeight: 35});
        this.load.spritesheet('blue_player',  'assets/champions/blue.png',  {frameWidth: 27, frameHeight: 35});

        // Bomba
        this.load.spritesheet('bomb_tileset',  'assets/bombs.png', {frameWidth: 35, frameHeight: 35});

        // Vybuch bomby
        this.load.spritesheet('explosion_center',     'assets/explosion/explosion_center.png',     {frameWidth: 35, frameHeight: 35});
        this.load.spritesheet('explosion_horizontal', 'assets/explosion/explosion_horizontal.png', {frameWidth: 35, frameHeight: 35});
        this.load.spritesheet('explosion_vertical',   'assets/explosion/explosion_vertical.png',   {frameWidth: 35, frameHeight: 35});
        this.load.spritesheet('explosion_up',         'assets/explosion/explosion_up.png',         {frameWidth: 35, frameHeight: 35});
        this.load.spritesheet('explosion_right',      'assets/explosion/explosion_right.png',      {frameWidth: 35, frameHeight: 35});
        this.load.spritesheet('explosion_down',       'assets/explosion/explosion_down.png',       {frameWidth: 35, frameHeight: 35});
        this.load.spritesheet('explosion_left',       'assets/explosion/explosion_left.png',       {frameWidth: 35, frameHeight: 35});
    }

    create() {
        this.scene.start('Menu');
    }
}

export default Preload;
