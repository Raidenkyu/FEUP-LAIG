/**
 * MyRectangle
 * @constructor
 */

class MyRectangle extends CGFobject{
    constructor(scene, vert_0, vert_1) {
        super(scene);
        this.bot_left = vert_0;
        this.top_right = vert_1;
        this.initBuffers();
    };

    initBuffers(){

        this.vertices = [];

        this.x_min = this.bot_left[0];
        this.y_min = this.bot_left[1];
        this.x_max = this.top_right[0];
        this.y_max = this.top_right[1];

        this.vertices.push(this.x_min, this.y_min, 0);
        this.vertices.push(this.x_max, this.y_min, 0);
        this.vertices.push(this.x_max, this.y_max, 0);
        this.vertices.push(this.x_min, this.y_max, 0);

        this.indices = [0, 1, 2,
                        2, 3, 0];

        this.normals = [0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1] 
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        
    };

    applyTextures(factorS,factorT){
        factorS = factorS || 1;
        factorT = factorT || 1;
        this.texCoords = [];

        var min_S = 0;
        var min_T = 0;
        var max_S = (this.x_max - this.x_min) / factorS;
        var max_T = (this.y_max - this.y_min) / factorT;
    
        this.texCoords.push(min_S, max_T);
        this.texCoords.push(max_S, max_T);
        this.texCoords.push(min_S, min_T);
        this.texCoords.push(max_S, min_T);

        this.updateTexCoordsGLBuffers();
    }
}