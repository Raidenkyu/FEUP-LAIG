/**
 * MyCylinder2
 * @constructor
 */

class MyCylinder2 extends CGFobject{
    constructor(scene, base_rad, top_rad, height, slices, stacks) {
        super(scene);
        this.base_rad = base_rad;
        this.top_rad = top_rad;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers(){
        var angle = 2.0 * Math.PI / this.slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (var stack_c = 0; stack_c <= this.stacks; stack_c++) {
            var curr_angle = 0.0;
            var curr_radius = (this.top_rad - this.base_rad) * (stack_c / this.stacks) + this.base_rad;
            var z0 = this.height * stack_c / this.stacks;
            for (slice_c = 0; slice_c <= this.slices; slice_c++) {
                var x = Math.cos(curr_angle) * curr_radius;
                var y = Math.sin(curr_angle) * curr_radius;
                this.vertices.push(x, y, z0);
                this.normals.push(x, y, 0);
                curr_angle += angle;
            }
        }
    
        for (var stack_c = 0; stack_c < this.stacks; stack_c++) {
            for (var slice_c = 0; slice_c < this.slices; slice_c++) {
                var index1 = slice_c + stack_c * (this.slices + 1);
                var index2 = slice_c + stack_c * (this.slices + 1) + 1;
                var index3 = slice_c + (stack_c + 1) * (this.slices + 1);
                var index4 = slice_c + (stack_c + 1) * (this.slices + 1) + 1;
                this.indices.push(index4, index3, index1);
                this.indices.push(index1, index2, index4);
            }
    }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    applyTextures(factorS,factorT){
        factorS = factorS || 1;
        factorT = factorT || 1;
        this.texCoords = [];

        for (var stack_c = 0; stack_c <= this.stacks; stack_c++) {
            var v = 1 - (stack_c / this.stacks);
            for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
                var u = 1 - (slice_c / this.slices);
                this.texCoords.push(u, v);
            }
        }

        this.updateTexCoordsGLBuffers();
    }

}

