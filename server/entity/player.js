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
    }

    dead() {
        this.isAlive = false;
    }

    pickSpoil(spoil_type) {
        if (spoil_type === POWER){
            this.power += STEP_POWER
        }
    }
}

exports.Player = Player;