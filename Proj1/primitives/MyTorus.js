/**
 * MyTorus
 * @constructor
 */

class MyTorus extends CGFobject{
    constructor(scene, inner_r, outer_r, slices, stacks) {
        super(scene);
        this.outer_r = outer_r;
        this.inner_r = inner_r;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();

    }; 

    initBuffers(){

        this.vertices = [];
        this.normals = [];
        this.indices = [];

        for (var stack_c = 0; stack_c <= this.stacks; stack_c++)                     
          {  var ang = stack_c * 2 * Math.PI / this.stacks;

            for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
                var phi = slice_c * 2 * Math.PI / this.slices;

                var x = (this.outer_r + this.inner_r * Math.cos(phi)) * Math.cos(ang);
                var y = (this.outer_r + this.inner_r * Math.cos(phi)) * Math.sin(ang);
                var z = this.inner_r * Math.sin(phi);

                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                this.normals.push(x);
                this.normals.push(y);
                this.normals.push(z);

                /*
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                textureCoordData.push(u);
                textureCoordData.push(v);
                */

            }
        }

        for (var stack_c = 0; stack_c < this.stacks; stack_c++) {
            for (var slice_c = 0; slice_c < this.slices; slice_c++) {
                var first = (stack_c * (this.slices + 1)) + slice_c;
                var second = first + this.slices + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }


        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    applyTextures(factorS,factorT){
        factorS = factorS || 1;
        factorT = factorT || 1;

        //TODO by Fernando

    }

}

