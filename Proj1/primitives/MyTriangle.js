/**
 * MyTriangle
 * @constructor
 */

class MyTriangle extends CGFobject{
    constructor(scene, vert_1, vert_2, vert_3) {
        super(scene);
        this.v1 = vert_1;
        this.v2 = vert_2;
        this.v3 = vert_3;
        this.initBuffers();
    };

    initBuffers(){

        
        this.vertices = [];

        this.vertices.push(this.v1[0],this.v1[1],this.v1[2]);
        this.vertices.push(this.v2[0],this.v2[1],this.v2[2]);
        this.vertices.push(this.v3[0],this.v3[1],this.v3[2]);

        this.indices = [0,1,2];

        //TODO: this.normals & this.textures

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();


    };

    applyTextures(factorS,factorT){
        factorS = factorS || 1;
        factorT = factorT || 1;
        this.texCoords = [];

        //TODO by Fernando

        this.initGLBuffers();
    }


}
