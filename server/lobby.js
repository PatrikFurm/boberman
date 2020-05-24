var { Game } = require('./entity/game');

var lobbyId = 'lobby_room';

var pendingGames = new Map();

var Lobby = {
    onEnterLobby: function (callback) {
        // this == socket
        this.join(lobbyId);

        callback( Lobby.availablePendingGames() )
    },

    onCreateGame: function(map_name, callback) {
        var newGame = new Game({ map_name: map_name });
        pendingGames.set(newGame.id, newGame);

        Lobby.updateLobbyGames();

        callback({ game_id: newGame.id, map_name: newGame.map_name });
    },

    availablePendingGames: function() {
        return [...pendingGames.values()].filter(item => item.isFull() === false );
    },

    updateLobbyGames: function() {
        serverSocket.sockets.in(lobbyId).emit('display pending games', Lobby.availablePendingGames() );
    },

    onEnterPendingGame: function ({ game_id }) {
        let current_game = pendingGames.get(game_id);

        this.join(current_game.id);

        this.socket_game_id = current_game.id;

        current_game.addPlayer(this.id);

        if ( current_game.isFull() ){
            Lobby.updateLobbyGames();
        }

        Lobby.updateCurrentGame(current_game);
    },

    updateCurrentGame: function(game) {
        serverSocket.sockets.in(game.id).emit('update game', { current_game: game });
    },

    onLeavePendingGame: function() {
        let current_game = pendingGames.get(this.socket_game_id);

        if (current_game) {
            this.leave(current_game.id);
            this.socket_game_id = null;

            current_game.removePlayer(this.id);

            if( current_game.isEmpty() ){
                pendingGames.delete(current_game.id);
                Lobby.updateLobbyGames();
                return
            }

            if ( !current_game.isFull() ){
                Lobby.updateLobbyGames();
            }

            Lobby.updateCurrentGame(current_game)
        }
    },

    deletePendingGame: function(game_id) {
        let game = pendingGames.get(game_id);

        if ( game ) {
            pendingGames.delete(game.id);

            Lobby.updateLobbyGames();

            return game
        }
    },

    onLeaveLobby: function() {
        this.leave(lobbyId);
    }
};

module.exports = Lobby;