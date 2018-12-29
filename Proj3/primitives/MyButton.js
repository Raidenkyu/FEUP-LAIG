/**
 * MyButton
 * @constructor
 */

class MyButton extends CGFobject{
    constructor(scene, idTexture) {
        super(scene);
        this.scene = scene;
        this.idTexture = idTexture;
        this.obj = new MyPlane(scene, 16 , 16);
    };

    display(buttonId){     
        this.scene.rotate(Math.PI/2.0, 0,1,0);

        let n = this.scene.game.validIDs.includes(buttonId);

        let buttonMat;
        if(n){
            buttonMat = this.scene.graph.materials["mat_green"];
        }
        else{
            buttonMat = this.scene.graph.materials["mat_white"];
        }
        buttonMat.setTexture(this.scene.graph.textures[this.idTexture]);
        buttonMat.apply();
        //this.scene.graph.textures[this.idTexture].bind(0);
        this.obj.display();
    };

    applyTextures(factorS, factorT){

    };

}