var DEGREE_TO_RAD = Math.PI / 180;
var FPS = 1000/60;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(FPS);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                if(light.length > 5){
                    this.lights[i].setSpotCutOff(light[5]);
                    this.lights[i].setSpotExponent(light[6]);
                    this.lights[i].setSpotDirection(light[7][0],light[7][1],light[7][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }


    /**
     * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.game = new Game(this);
        this.initViews();

        this.axis = new CGFaxis(this, this.graph.axisLength);
        this.setGlobalAmbientLight(this.graph.ambientR, this.graph.ambientG, this.graph.ambientB, this.graph.ambientA);
        this.gl.clearColor(this.graph.backgroundR, this.graph.backgroundG, this.graph.backgroundB, this.graph.backgroundA);

        this.initLights();
        this.interface.initKeys();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        // Adds lights group.
        this.interface.addViewsGroup(this.graph.views);

        this.interface.addModesGroup();

        this.interface.addServerGroup(this.game.server);

        this.sceneInited = true;
    }

    /**
     * Initializes the default view
     */
    initViews(){
        this.camera = this.graph.views[this.graph.defaultView];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Selects a view
     * @param {string} id
     */
    selectView(id){
        this.camera = this.graph.views[id];
        this.interface.setActiveCamera(this.camera);
    }


    logPicking(){
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];				
                        //console.log("Picked object: " + obj + ", with pick id " + customId);
                        this.clickAction(customId);
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
    }

    clickAction(id){
        if(id < 77 && !this.game.terminated){
            this.game.play(id);
        }
    }




    /**
     * Displays the scene.
     */
    display() {
        
        //Picking
        this.logPicking();
        this.clearPickRegistration();
        
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

       

        if (this.sceneInited) {
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup

        //TODO - this.clearPickRegistration(); again?
    }
    /**
     * Updates the scene to be displayed, including its primitives and animations
     * @param {Time} currTime 
     */
    update(currTime){
        var deltaTime = currTime - this.lastTime;
        let elapsedTime = deltaTime/1000;
        this.updateCamera(elapsedTime);
        this.updateAnimations(elapsedTime);
        this.updateGame();
        if(this.sceneInited){
            for(var key in this.graph.primitives){
                let elem = this.graph.primitives[key];
                if(elem instanceof MyWater)
                    elem.update(currTime);
            }
        }
        this.lastTime = currTime;
    }

    updateGame(){
        if(this.game){
            this.game.botTurn();
        }

    }

    updateCamera(deltaTime){
        if(this.cameraRotating){
            let cam = this.camera;
            let angularSpeed = Math.PI/5;
            let elapsedAngle = angularSpeed*deltaTime;
            let nextAngle = this.cameraAngle + elapsedAngle;
            if(nextAngle >= Math.PI/2){
                elapsedAngle = Math.PI/2 - this.cameraAngle;
                this.cameraRotating = null;
                this.cameraAngle = 0;
            }
            this.cameraAngle += elapsedAngle;
            cam.orbit([0,1,0],elapsedAngle);
        }
    }

    rotateCamera(){
        if(this.cameraRotating == null){
        this.cameraRotating = this.camera;
        this.cameraAngle = 0;
        }
        else{
            console.log("Wait!! Another camera still is rotating");
        }
    }

    /**
     * Updates the animations of every component with the given time span.
     * @param {Number} deltaTime 
     */
    updateAnimations(deltaTime){
        for (var key in this.graph.graphNodes){
            var node = this.graph.graphNodes[key];
            if(node.animationsIndex < node.animations.length){
                var animation = node.animations[node.animationsIndex];
                animation.update(deltaTime);
                mat4.copy(node.animMatrix,animation.apply());
                

                if(animation.terminated){
                    node.animationsIndex++;
                }
            }
        }
    }


    /**
     * Updates the materials of the objects
     */
    updateMaterial(){
        this.graph.nextMaterial();
    }
}