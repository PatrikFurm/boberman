export default class Info {

    constructor({ game, player }) {
        this.scene  =  game;
        this.player = player;

        this.style    = { font: '14px Arial', fill: '#ffffff', align: 'left' }
        this.redStyle = { font: '30px Arial', fill: '#ff0044', align: 'center' };

        this.deadText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY - 30, 'You died :(', this.redStyle);
        this.deadText.setOrigin(0.5);
        this.deadText.visible = false
    }

    showDeadInfo() {
        this.deadText.visible = true
    }
}