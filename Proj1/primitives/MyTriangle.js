/**
 * MyTriangle
 * @constructor
 */

class MyTriangle extends CGFobject{
    constructor(scene, vert_1, vert_2, vert_3, text_s, text_t) {
        CGFobject.call(this, scene);
        this.v1 = vert_1;
        this.v2 = vert_2;
        this.v3 = vert_3;
        this.text_s = text_s || 1;
        this.text_t = text_t || 1;
        this.initBuffers();
    };

    initBuffers(){

        this.vertices = [];

        this.vertices.push(v1[0],v1[1],v1[2]);
        this.vertices.push(v2[0],v2[1],v2[2]);
        this.vertices.push(v3[0],v3[1],v3[2]);

        this.indices = [0,1,2];

        //TODO: this.normals & this.textures


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };


}
