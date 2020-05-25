const { POWER, INITIAL_POWER, STEP_POWER } = require('../constants');

class Player {

    constructor({ id, skin, name, spawn, spawnOnGrid }) {
        this.id          = id;
        this.skin        = skin;
        this.name        = name;
        this.spawn       = spawn;
        this.spawnOnGrid = spawnOnGrid;

        this.isAlive = true;

        this.power = INITIAL_POWER;

        this.bombs = 0;
        this.max_bombs = 1;
    }

    dead() {
        this.isAlive = false;
    }

    pickSpoil(spoil_type) {
        if (spoil_type === POWER){
            this.power += STEP_POWER
        }

        if ( spoil_type === 2 ) {
            if ( this.max_bombs < 5 ) {
                this.max_bombs += 1;
            }
        }
    }
}

exports.Player = Player;