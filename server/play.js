const { MAX_BOMBS } = require('./constants');
var Lobby    = require('./lobby');
var { Game } = require('./entity/game');

var runningGames = new Map();
var bombs = {};
var spoils = {};

var Play = {
    onLeaveGame: function (data) {
        runningGames.delete(this.socket_game_id);

        this.leave(this.socket_game_id);
        this.socket_game_id = null;
    },

    onStartGame: function() {
        let game = Lobby.deletePendingGame(this.socket_game_id);

        runningGames.set(game.id, game);
        bombs[game.id]  = [];
        spoils[game.id] = [];

        //serverSocket.sockets.in(game.id).emit('launch game', game);
        this.broadcast.to(this.socket_game_id).emit('launch game', game);

    },

    updatePlayerPosition: function (coordinates) {
        this.broadcast.to(this.socket_game_id).emit('move player', Object.assign({}, { player_id: this.id }, coordinates));
    },

    onDisconnectFromGame: function() {
        let current_game = runningGames.get(this.socket_game_id);

        if (current_game) {
            serverSocket.sockets.in(this.socket_game_id).emit('player disconnect', {player_id: this.id } );
        }
    },

    createBomb: function({ col, row }) {
        let game_id = this.socket_game_id;
        let current_game = runningGames.get(game_id);
        let current_player = current_game.players[this.id];
        let detonated_bombs = [];
        let bomb = null;

        if ( current_player.bombs < current_player.max_bombs ) {
            for (let b of bombs[game_id]) {
                if ( b.col === col && b.row === row ) {
                    return false;
                }
            }
            bomb = current_game.addBomb({
                col: col,
                row: row,
                power: current_player.power,
                player_id: current_player.id
            });

            bombs[game_id].push(bomb);
            current_player.bombs += 1;
        }

        if ( bomb ){
            setTimeout(function() {
                if ( !bomb.detonated ) {
                    let blastedCells = bomb.detonate();

                    serverSocket.sockets.to(game_id).emit('detonate bomb', {
                        bomb_id: bomb.id,
                        blastedCells: blastedCells,
                        player_id: bomb.player_id
                    });

                    for ( let cell of blastedCells ) {
                        for ( let spoil of spoils[game_id] ){
                            if ( cell.row === spoil.row && cell.col === spoil.col ) {
                                Play.onPickUpSpoil({spoil_id: spoil.id, fake: true, game_id: game_id});
                            }
                        }
                    }

                    for ( let cell of blastedCells ) {
                        if ( cell.spoil ) {
                            spoils[game_id].push(cell.spoil);
                        }
                    }

                    current_player.bombs -= 1;

                    for (var i = 0; i < bombs[game_id].length; i++) {
                        if (bombs[game_id][i].id === bomb.id) {
                            bombs[game_id].splice(i, 1);
                            break;
                        }
                    }

                    for (let b of bombs[game_id]) {
                        if (b.id !== bomb.id) {
                            for (let cell of blastedCells) {
                                if (b.col === cell.col && b.row === cell.row) {
                                    detonated_bombs.push(b);
                                    /*blastedCells = b.detonate();
                                    serverSocket.sockets.to(game_id).emit('detonate bomb', { bomb_id: b.id, blastedCells: blastedCells });*/
                                }
                            }
                        }
                    }

                    while ( detonated_bombs.length > 0 ) {
                        let b = detonated_bombs.pop();

                        b.detonated = true;
                        blastedCells = b.detonate();
                        serverSocket.sockets.to(game_id).emit('detonate bomb', {
                            bomb_id: b.id,
                            blastedCells: blastedCells,
                            player_id: bomb.player_id
                        });

                        for ( let cell of blastedCells ) {
                            for ( let spoil of spoils[game_id] ){
                                if ( cell.row === spoil.row && cell.col === spoil.col ) {
                                    Play.onPickUpSpoil({spoil_id: spoil.id, fake: true, game_id: game_id});
                                }
                            }
                        }

                        for ( let cell of blastedCells ) {
                            if ( cell.spoil ) {
                                spoils[game_id].push(cell.spoil);
                            }
                        }

                        if ( b.player_id === current_player.id ) {
                            current_player.bombs -= 1;
                        }

                        for (var i = 0; i < bombs[game_id].length; i++) {
                            if (bombs[game_id][i].id === b.id) {
                                bombs[game_id].splice(i, 1);
                                break;
                            }
                        }

                        for (var i = 0; i < bombs[game_id].length; i++) {
                            if (b.id !== bombs[game_id][i].id) {
                                for (let cell of blastedCells) {
                                    if (bombs[game_id][i].col === cell.col && bombs[game_id][i].row === cell.row) {
                                        detonated_bombs.push(bombs[game_id][i]);
                                    }
                                }
                            }
                        }
                    }
                }

            }, bomb.explosion_time);

            serverSocket.sockets.to(game_id).emit('show bomb', { bomb_id: bomb.id, col: bomb.col, row: bomb.row });
        }
    },

    onPickUpSpoil: function({ spoil_id, fake, game_id }) {
        if ( !fake ) {
            let game_id = this.socket_game_id;
            let current_game = runningGames.get(game_id);
            let current_player = current_game.players[this.id];

            let spoil = current_game.findSpoil(spoil_id);

            if (spoil) {
                current_game.deleteSpoil(spoil.id);
                current_player.pickSpoil(spoil.spoil_type);

                serverSocket.sockets.to(game_id).emit('spoil was picked', {
                    player_id: current_player.id,
                    spoil_id: spoil.id,
                    spoil_type: spoil.spoil_type
                });
            }
        }
        else {
            let current_game = runningGames.get(game_id);
            let spoil = current_game.findSpoil(spoil_id);

            if ( spoil ) {
                current_game.deleteSpoil(spoil.id);
                serverSocket.sockets.to(game_id).emit('spoil was picked', {
                    player_id: '0',
                    spoil_id: spoil.id,
                    spoil_type: spoil.spoil_type
                });

                for (var i = 0; i < spoils[game_id].length; i++) {
                    if (spoils[game_id][i].id === spoil.id) {
                        spoils[game_id].splice(i, 1);
                        break;
                    }
                }
            }
        }
    },

    onPlayerDied: function(coordinates) {
        serverSocket.sockets.to(this.socket_game_id).emit('show bones', Object.assign({}, { player_id: this.id }, coordinates));

        let game_id = this.socket_game_id;
        let current_game = runningGames.get(game_id);
        let current_player = current_game.players[this.id];

        current_player.dead();

        let alivePlayersCount = 0;
        let alivePlayerSkin = null;
        for (let player of Object.values(current_game.players)) {
            if ( !player.isAlive ) { continue }

            alivePlayerSkin = player.skin;
            alivePlayersCount += 1
        }

        if (alivePlayersCount >= 2) {
            return
        }

        setTimeout(function() {
            serverSocket.sockets.to(game_id).emit('player win', alivePlayerSkin);
        }, 3000);
    }
};

module.exports = Play;