
class GameInterface {
    constructor(scene, game) {
        this.scene = scene;
        this.game = game;
        this.gl = scene.gl;
        this.init();
        this.update(0);
    };

    init() {
        //Init elements

        this.maxTurnTime = 30;

        this.ui_elements = [];

        let player = new InterfaceComponent(this.scene, [-0.3, 0.95], 0.4, 0.20, "player.png");
        this.ui_elements["player"] = player;

        let player_coords = [0.14, 0.96];
        let player_width = 0.04;
        let player_height = 0.18;
        let player1 = new InterfaceComponent(this.scene, player_coords, player_width, player_height, "1.png");
        let player2 = new InterfaceComponent(this.scene, player_coords, player_width, player_height, "2.png");
        this.ui_elements["player1"] = player1;
        this.ui_elements["player2"] = player2;

        let start = new InterfaceComponent(this.scene, [-0.25, 0.2], 0.5, 0.3, "start.png",
            this.game.start.bind(this.game));

        this.ui_elements["start"] = start;

        let undo = new InterfaceComponent(this.scene, [0.7, 0.15], 0.25, 0.25, "undo.png",
            this.game.undo.bind(this.game));

        this.ui_elements.push(undo);

        let reset = new InterfaceComponent(this.scene, [0.7, -0.15], 0.25, 0.25, "reset.png",
            this.game.initBoard.bind(this.game));

        this.ui_elements.push(reset);

        let movie = new InterfaceComponent(this.scene, [0.7, -0.45], 0.25, 0.25, "movie.png", this.game.playGameMovie.bind(this.game));
        this.ui_elements["movie"] = movie;

        let winner = new InterfaceComponent(this.scene, [-0.5, 0.95], 1, 0.2, "winner.png");
        this.ui_elements["winner"] = winner;

        let winner_coords = [0.05, 0.94];

        let player1winner = new InterfaceComponent(this.scene, winner_coords, player_width, player_height, "1winner.png");
        let player2winner = new InterfaceComponent(this.scene, winner_coords, player_width, player_height, "2winner.png");
        this.ui_elements["player1winner"] = player1winner;
        this.ui_elements["player2winner"] = player2winner;

        let timer_label = new InterfaceComponent(this.scene, [-0.96, 0.97], 0.2, 0.1, "timer.png");
        this.ui_elements["timer_label"] = timer_label;

        let score_label = new InterfaceComponent(this.scene, [-0.96, 0.77], 0.2, 0.1, "score.png");
        this.ui_elements["score_label"] = score_label;

        this.initTimer();
        this.initCounter();

        //Init shader
        this.ui_shader = new CGFshader(this.gl, 'shaders/interface.vert', 'shaders/interface.frag');
        let previous_shader = this.scene.activeShader;
        this.scene.setActiveShader(this.ui_shader);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.ui_shader.uniforms.uSampler, 0);
        this.scene.setActiveShader(previous_shader);

        //Init events
        let ui_scene = this;
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.addEventListener('click', function (event) {
            let x = event.pageX - canvas.offsetLeft;
            let y = event.pageY - canvas.offsetTop;

            ui_scene.ui_elements.forEach(function (element) {
                if (element.isInside(x, y, canvas.width, canvas.height)) {
                    element.onClick();
                }
            });

            if (ui_scene.ui_elements["movie"].isInside(x, y, canvas.width, canvas.height)) {
                ui_scene.ui_elements["movie"].onClick();
            }

            if (ui_scene.ui_elements["start"].isInside(x, y, canvas.width, canvas.height)) {
                ui_scene.ui_elements["start"].onClick();
            }
        });
    };

    display() {
        let previous_shader = this.scene.activeShader;
        this.scene.setActiveShader(this.ui_shader);
        this.gl.disable(this.gl.DEPTH_TEST);

        this.ui_elements.forEach(function (element) {
            element.display();
        });
        if (this.game.inited) {
            this.ui_elements["timer_label"].display();
            this.ui_elements["score_label"].display();
            this.ui_elements["minutes0"].display();
            this.ui_elements["minutes1"].display();
            this.ui_elements["separator"].display();
            this.ui_elements["seconds0"].display();
            this.ui_elements["seconds1"].display();
            this.ui_elements["white_score"].display();
            this.ui_elements["minus"].display();
            this.ui_elements["black_score"].display();
        }
        else{
            this.ui_elements["start"].display();
        }
        if (!this.game.terminated) {
            this.ui_elements["player"].display();
            this.ui_elements[this.game.playerTurn].display();
        } else {
            this.ui_elements["movie"].display();
            this.ui_elements["winner"].display();
            this.ui_elements[this.game.winner + "winner"].display();
        }


        this.gl.enable(this.gl.DEPTH_TEST);
        this.scene.setActiveShader(previous_shader);
    };

    update(deltaTime) {
        if (this.game.inited && !this.game.terminated && !this.game.animationRunning) {
            this.turnTime -= deltaTime;
            if (this.turnTime > 0) {
                let seconds = Math.floor((this.turnTime % (1000 * 60)) / 1000);
                let minutes = Math.floor((this.turnTime % (1000 * 60 * 60)) / (1000 * 60));

                this.ui_elements["minutes0"].texture = this.timer_textures[Math.floor(minutes / 10)];
                this.ui_elements["minutes1"].texture = this.timer_textures[minutes % 10];
                this.ui_elements["seconds0"].texture = this.timer_textures[Math.floor(seconds / 10)];
                this.ui_elements["seconds1"].texture = this.timer_textures[seconds % 10];
            } else {
                this.game.timeout();
            }
        }
        else {
            this.resetTimer();
        }

        if (this.scene.graph) {
            this.ui_elements["white_score"].texture = this.timer_textures[this.game.victories[0]];
            this.ui_elements["black_score"].texture = this.timer_textures[this.game.victories[1]];
        }
    }

    initTimer() {
        this.timer_textures = [];
        for (let i = 0; i < 10; i++) {
            this.timer_textures[i] = new CGFtexture(this.scene, "./scenes/images/nums/" + i + ".png");
        }
        this.timer_textures[10] = new CGFtexture(this.scene, "./scenes/images/nums/colon.png");

        let ids = ["minutes0", "minutes1", "separator", "seconds0", "seconds1"];
        let width = 0.03;
        let space_between = 0.005;
        let initial_x = -0.95 - space_between;
        for (let i = 0; i < ids.length; i++) {

            let x = i * width + (i + 1) * space_between + initial_x;
            let y = 0.85;
            this.ui_elements[ids[i]] = new InterfaceComponent(this.scene, [x, y], width, 0.05);
        }

        this.ui_elements["separator"].texture = this.timer_textures[10];

        this.resetTimer();
    }

    initCounter() {
        let ids = ["white_score", "minus", "black_score"];
        let width = 0.03;
        let space_between = 0.005;
        let initial_x = -0.95 - space_between;
        for (let i = 0; i < ids.length; i++) {

            let x = i * width + (i + 1) * space_between + initial_x;
            let y = 0.65;
            this.ui_elements[ids[i]] = new InterfaceComponent(this.scene, [x, y], width, 0.05);
        }
        this.timer_textures[11] = new CGFtexture(this.scene, "./scenes/" + "images/nums/minus.png");
        this.ui_elements["minus"].texture = this.timer_textures[11];
    }

    resetTimer() {
        this.turnTime = (this.maxTurnTime + 1) * 1000;
    }
}