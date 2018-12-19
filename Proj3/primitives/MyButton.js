/**
 * MyButton
 * @constructor
 */

class MyButton extends CGFobject{
    constructor(scene, idTexture) {
        super(scene);
        this.idTexture = idTexture;
        this.obj = new MyPlane(scene, 16 , 16);
    };

    display(){
        
        this.scene.rotate(Math.PI/2.0, 0,1,0);
        this.scene.graph.textures[this.idTexture].bind(0);
        this.obj.display();
        
    };

    applyTextures(factorS, factorT){

    };

}