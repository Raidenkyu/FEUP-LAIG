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

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();


    };

    applyTextures(factorS,factorT){
        factorS = factorS || 1;
        factorT = factorT || 1;
        this.texCoords = [];

        var a = Math.sqrt(Math.pow((this.v1[0] - this.v3[0]),2) + Math.pow((this.v1[1] - this.v3[1]),2) + Math.pow((this.v1[2] - this.v3[2]),2));
        var b = Math.sqrt(Math.pow((this.v2[0] - this.v1[0]),2) + Math.pow((this.v2[1] - this.v1[1]),2) + Math.pow((this.v2[2] - this.v1[2]),2));
        var c = Math.sqrt(Math.pow((this.v3[0] - this.v2[0]),2) + Math.pow((this.v3[1] - this.v2[1]),2) + Math.pow((this.v3[2] - this.v2[2]),2));
 
        var cos_alpha = (-Math.pow(a,2)+Math.pow(b,2)+Math.pow(c,2))/(2*b*c);
        var cos_beta = (Math.pow(a,2)-Math.pow(b,2)+Math.pow(c,2))/(2*a*c);
        var cos_gamma = (Math.pow(a,2)+Math.pow(b,2)-Math.pow(c,2))/(2*b*a);

        var a_sin_beta = Math.sqrt(Math.pow(a,2) - Math.pow(a*cos_beta,2));

        this.texCoords.push(c - a*cos_beta, factorT - a_sin_beta);
        this.texCoords.push(0, factorT);
        this.texCoords.push(c, factorT);

        this.updateTexCoordsGLBuffers();
    }


}
