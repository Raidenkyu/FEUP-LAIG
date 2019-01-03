
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
        this.ui_elements = [];
        let text_coords = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];
        let indices = [
            0, 2, 3,
            0, 3, 1
        ];

        let player_position = [-0.3, 0.95,
            0.1, 0.95, -0.3, 0.75,
            0.1, 0.75
        ];
        let bot_position = [-0.2, 0.95,
            0.0, 0.95, -0.2, 0.75,
            0.0, 0.75
        ];
        let player = new InterfaceComponent(this.scene, player_position, text_coords, indices, "player.png");
        this.ui_elements["player"] = player;

        let player_number_position = [
            0.15, 0.95,
            0.2, 0.95,
            0.15, 0.75,
            0.2, 0.75
        ];
        let player1 = new InterfaceComponent(this.scene, player_number_position, text_coords, indices, "1.png");
        let player2 = new InterfaceComponent(this.scene, player_number_position, text_coords, indices, "2.png");
        this.ui_elements["player1"] = player1;
        this.ui_elements["player2"] = player2;

        let undo = new InterfaceComponent(this.scene, [
                0.7, 0.15,
                0.95, 0.15,
                0.7, -0.1,
                0.95, -0.1
            ],
            text_coords,
            indices,
            "undo.png",
            this.game.undo.bind(this.game));
        this.ui_elements.push(undo);

        let reset = new InterfaceComponent(this.scene, [
                0.7, -0.15,
                0.95, -0.15,
                0.7, -0.4,
                0.95, -0.4
            ],
            text_coords,
            indices,
            "reset.png",
            this.game.initBoard.bind(this.game));
        this.ui_elements.push(reset);

        let movie_position = [
            0.7, -0.45,
            0.95, -0.45,
            0.7, -0.7,
            0.95, -0.7
        ];
        let movie = new InterfaceComponent(this.scene, movie_position, text_coords, indices, "movie.png", this.game.playGameMovie.bind(this.game));
        this.ui_elements["movie"] = movie;

        let game_over_position = [-0.5, 0.95,
            0.5, 0.95, -0.5, 0.75,
            0.5, 0.75
        ];
        let game_over = new InterfaceComponent(this.scene, game_over_position, text_coords, indices, "game_over.png");
        this.ui_elements["game_over"] = game_over;

        this.initTimer(text_coords, indices);
        this.initCounter(text_coords, indices);

        //Init shader
        this.ui_shader = new CGFshader(this.gl, 'shaders/interface.vert','shaders/interface.frag');
        let previous_shader = this.scene.activeShader;
        this.scene.setActiveShader(this.ui_shader);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform1i(this.ui_shader.uniforms.uSampler, 0);
        this.scene.setActiveShader(previous_shader);

        //Init events
        let ui_scene = this;
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.addEventListener('click', function(event) {
            let x = event.pageX - canvas.offsetLeft;
            let y = event.pageY - canvas.offsetTop;

            ui_scene.ui_elements.forEach(function(element) {
                if (element.isInside(x, y, canvas.width, canvas.height)) {
                    element.onClick();
                }
            });

            if (ui_scene.ui_elements["movie"].isInside(x, y, canvas.width, canvas.height)) {
                ui_scene.ui_elements["movie"].onClick();
            }
        });
    };

    display() {
        let previous_shader = this.scene.activeShader;
        this.scene.setActiveShader(this.ui_shader);
        this.gl.disable(this.gl.DEPTH_TEST);

        this.ui_elements.forEach(function(element) {
            element.render();
        });
        this.ui_elements["minutes0"].render();
        this.ui_elements["minutes1"].render();
        this.ui_elements["separator"].render();
        this.ui_elements["seconds0"].render();
        this.ui_elements["seconds1"].render();
        this.ui_elements["white_score"].render();
        this.ui_elements["minus"].render();
        this.ui_elements["black_score"].render();
        if (!this.game.terminated) {
            this.ui_elements["player"].render();
            this.ui_elements[this.game.playerTurn].render();
        } else {
            this.ui_elements["movie"].render();
            this.ui_elements["game_over"].render();
        }


        this.gl.enable(this.gl.DEPTH_TEST);
        this.scene.setActiveShader(previous_shader);
    };

    update(deltaTime) {
        if (!this.game.terminated  && !this.game.animationRunning) {
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
        else{
            this.resetTimer();
        }

        if (this.scene.graph) {
            this.ui_elements["white_score"].texture = this.timer_textures[this.game.victories[0]];
            this.ui_elements["black_score"].texture = this.timer_textures[this.game.victories[1]];
        }
    }

    initTimer(text_coords, indices) {
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
            let vertices = [
                i * width + (i + 1) * space_between + initial_x, 0.95,
                (i + 1) * width + (i + 1) * space_between + initial_x, 0.95,
                i * width + (i + 1) * space_between + initial_x, 0.9,
                (i + 1) * width + (i + 1) * space_between + initial_x, 0.9
            ];
            this.ui_elements[ids[i]] = new InterfaceComponent(this.scene, vertices, text_coords, indices);
        }

        this.ui_elements["separator"].texture = this.timer_textures[10];

        this.resetTimer();
    }

    initCounter(text_coords, indices) {
        let ids = ["white_score", "minus", "black_score"];
        let width = 0.03;
        let space_between = 0.005;
        let initial_x = -0.95 - space_between;
        for (let i = 0; i < ids.length; i++) {
            let vertices = [
                i * width + (i + 1) * space_between + initial_x, 0.85,
                (i + 1) * width + (i + 1) * space_between + initial_x, 0.85,
                i * width + (i + 1) * space_between + initial_x, 0.8,
                (i + 1) * width + (i + 1) * space_between + initial_x, 0.8
            ];
            this.ui_elements[ids[i]] = new InterfaceComponent(this.scene, vertices, text_coords, indices);
        }
        this.timer_textures[11] = new CGFtexture(this.scene, "./scenes/" + "images/nums/minus.png");
        this.ui_elements["minus"].texture = this.timer_textures[11];
    }

    resetTimer() {
        this.turnTime = 31 * 1000;
    }
}