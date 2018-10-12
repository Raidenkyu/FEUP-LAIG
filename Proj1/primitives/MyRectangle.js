/**
 * MyRectangle
 * @constructor
 */

class MyRectangle extends CGFobject{
    constructor(scene, vert_0, vert_1 /*, text_s, text_t*/) {
        super(scene);
        this.bot_left = vert_0;
        this.top_right = vert_1;
        //this.text_s = text_s || 1;
        //this.text_t = text_t || 1;
        this.initBuffers();
    };

    initBuffers(){

        
        this.vertices = [];

        var x_min = this.bot_left[0];
        var y_min = this.bot_left[1];
        var x_max = this.top_right[0];
        var y_max = this.top_right[1];

        this.vertices.push(x_min, y_min, 0);
        this.vertices.push(x_max, y_min, 0);
        this.vertices.push(x_max, y_max, 0);
        this.vertices.push(x_min, y_max, 0);

        this.indices = [0, 1, 2,
                        2, 3, 0];

        this.normals = [0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1] 
        
        //this.textures

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        
    };


}