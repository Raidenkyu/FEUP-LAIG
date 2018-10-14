/**
 * MyCylinder
 * @constructor
 */

class MyCylinder extends CGFobject{
    constructor(scene, base_rad, top_rad, height, slices, stacks) {
        super(scene);
        this.cylinder_surface = new MyCylinderSurface(scene, base_rad, top_rad, height, slices, stacks);
        this.top_circle = new MyCircle(scene, top_rad, slices);
        this.bot_circle = new MyCircle(scene, base_rad, slices);
        this.height = height;
    };

    display(){
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.top_circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bot_circle.display();
        this.scene.popMatrix();

        this.cylinder_surface.display();
    };


    applyTextures(factorS,factorT){
        factorS = factorS || 1;
        factorT = factorT || 1;

        //TODO by Fernando

        this.cylinder_surface.applyTextures(factorS,factorT);
        this.top_circle.applyTextures(factorS,factorT);
        this.bot_circle.applyTextures(factorS,factorT);
    }

}

/**
 * MyCylinderSurface
 * @constructor
 */

class MyCylinderSurface extends CGFobject{
    constructor(scene, base_rad, top_rad, height, slices, stacks/*, text_s, text_t*/) {
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
            //var v = 1 - (stack_c / this.stacks);
            for (slice_c = 0; slice_c <= this.slices; slice_c++) {
                var x = Math.cos(curr_angle) * curr_radius;
                var y = Math.sin(curr_angle) * curr_radius;
                //var u = 1 - (slice_c / this.slices);
                this.vertices.push(x, y, z0);
                this.normals.push(x, y, 0);
                //this.texCoords.push(u, v);
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

