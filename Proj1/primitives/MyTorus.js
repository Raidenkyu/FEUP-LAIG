/**
 * MyTorus
 * @constructor
 */

class MyTorus extends CGFobject{
    constructor(scene, outer_r, inner_r, slices, stacks) {
        super(scene);
        this.outer_r = outer_r;
        this.inner_r = outer_r;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();

    }; 

    initBuffers(){

        var radius = this.outer_r;

        this.vertices = [];
        this.normals = [];
        this.indices = [];

        for (var stack_c = 0; stack_c <= this.stacks; stack_c++)                     
          {  var ang = stack_c * 2 * Math.PI / this.stacks;

            for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
                var phi = slice_c * 2 * Math.PI / this.slices;

                var x = (1 + radius * Math.cos(phi)) * Math.cos(ang);
                var y = (1 + radius * Math.cos(phi)) * Math.sin(ang);
                var z = radius * Math.sin(phi);

                vertices.push(radius * x);
                vertices.push(radius * y);
                vertices.push(radius * z);

                normals.push(x);
                normals.push(y);
                normals.push(z);

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
                indexData.push(first, second, first + 1);
                indexData.push(second, second + 1, first + 1);
            }
        }


        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    applyTextures(factorS,factorT){
        factorS = factorS || 1;
        factorT = factorT || 1;

        //TODO by Fernando

        this.cylinder_surface.applyTextures(factorS,factorT);
        this.top_circle.applyTextures(factorS,factorT);
        this.bot_circle.applyTextures(factorS,factorT);
    }

}

