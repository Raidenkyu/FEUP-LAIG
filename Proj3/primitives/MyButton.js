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
        this.scene.rotate(-Math.PI, 1,0,0);
        this.obj.display();
    }
}