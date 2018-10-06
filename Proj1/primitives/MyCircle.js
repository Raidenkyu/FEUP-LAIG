/**
 * MyCircle
 * @constructor
 */

class MyCircle extends CGFobject{
    constructor(scene, radius, slices) {
        CGFobject.call(this, scene);
        this.radius = radius;
        this.slices = slices;
        this.initBuffers();
    };

    initBuffers(){

        var angle = 2.0 * Math.PI / this.slices;

        this.vertices = [];

        //this.textures

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };


}