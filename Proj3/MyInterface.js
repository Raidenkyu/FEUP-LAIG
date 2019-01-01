/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

    /**
     * Adds a folder containing the IDs of the views passed as parameter.
     * @param {array} views
     */
    addViewsGroup(views){
        var group = this.gui.addFolder("Views");
        group.open();

        const cameraIdArray = Object.keys(views);
        this.currentCameraId = this.scene.graph.defaultView;

        group.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val));
        group.add(this.scene,'rotateCamera').name('Rotate');
    }


    addServerGroup(server){
        var group = this.gui.addFolder("Server");
        group.open();

        group.add(server,'closeServer');

    }

    /**
     * Adds a folder containing the diferent possible modes and difficulty
     * @param {array} views
     */
    addModesGroup(){
        var group = this.gui.addFolder("Zurero");
        group.open();
        group.add(this.scene.game,'undo').name('Undo Play');
        let modes = new Array();
        modes["Player Vs Player"] = 1;
        modes["Player Vs Bot"] = 2;
        modes["Bot Vs Bot"] = 3;
        const modeIdArray = Object.keys(modes);
        this.currentModeId = "Player Vs Player";

        group.add(this, 'currentModeId', modeIdArray).name('Mode').onChange(val => this.scene.game.mode = modes[val]);
        
        let difficulty = new Array();
        difficulty["Easy"] = 1;
        difficulty["Hard"] = 2;
        const difIdArray = Object.keys(difficulty);
        this.currentDifId = "Easy";

        group.add(this, 'currentDifId', difIdArray).name('Difficulty').onChange(val => this.scene.game.botLevel = difficulty[val]);
        group.add(this.scene.game,'initBoard').name("Reset Game");

    }

    /**
     * Initializes the keys
     */
    initKeys() {
		this.scene.gui=this;
		this.processKeyboard=function(){};
        this.activeKeys={};
	}

    /**
     * Processes a pressed key
     * @param {event} event
     */
	processKeyDown(event) {
        this.activeKeys[event.code]=true;
	};

    /**
     * Processes a released key
     * @param {event} event
     */
	processKeyUp(event) {
        this.activeKeys[event.code]=false;
        if(event.code == "KeyM"){
            this.scene.updateMaterial();
        }
	};

    /**
     * Informs if a given key is pressed
     * @param {event} event
     */
	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
	}
}