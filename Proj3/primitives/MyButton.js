/**
 * MyButton
 * @constructor
 */

class MyButton extends CGFobject{
    constructor(scene) {
        super(scene);
        this.obj = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
    };

    display(){
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI, 1,0,0);
        //console.log("Hi");
        this.obj.display();
        this.scene.popMatrix();
    };

    applyTextures(factorS, factorT){

    };

}