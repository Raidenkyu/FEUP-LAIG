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
        //this.testShader.setUniformsValues({isValid: 1});        
        this.scene.rotate(Math.PI/2.0, 0,1,0);
        let buttonMat;
        //console.log(this.scene.game.validMoves);
        if(buttonId == 10){
            buttonMat = this.scene.graph.materials["mat_green"];
        }
        else{
            buttonMat = this.scene.graph.materials["mat_white"];
        }
        buttonMat.setTexture(this.scene.graph.textures[this.idTexture]);
        buttonMat.apply();
        //this.scene.graph.textures[this.idTexture].bind(0);
        this.obj.display();
        //this.testShader.setUniformsValues({isValid: 0}); 
    };

    applyTextures(factorS, factorT){

    };

}