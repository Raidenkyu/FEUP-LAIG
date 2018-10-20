class GraphLeaf {
    constructor(scene, prim_type, args_array) {
        this.scene = scene;
        this.prim_type = prim_type;
        this.args_array = args_array;
        this.primitive = null;

        switch (this.prim_type) {
            case 't':
                this.initializeTriangle();
                break;
            case 'r':
                this.initializeRectangle();
                break;    
            case 'c':
                this.initializeCylinder();
                break;
            case 's':
                this.initializeSphere();
                break;
            case 'o':
                this.initializeTorus();
                break;    
        }

    };

    initializeTriangle(){
        if (this.args_array.length == 10){
            this.primitive = new MyTriangle(this.scene,[this.args_array[1], this.args_array[2], this.args_array[3]],
                                                       [this.args_array[4], this.args_array[5], this.args_array[6]],
                                                       [this.args_array[7], this.args_array[8], this.args_array[9]]);
        }
        else console.log("Invalid number of arguments for a Triangle");
    };


    initializeCylinder(){
        if (this.args_array.length == 6){
            this.primitive = new MyCylinder(this.scene, this.args_array[1], this.args_array[2], this.args_array[3], 
                this.args_array[4], this.args_array[5]);
        }
        else console.log("Invalid number of arguments for a Cylinder");
    };

    initializeRectangle(){
        if (this.args_array.length == 5){
            this.primitive = new MyRectangle(this.scene,[this.args_array[1], this.args_array[2]],
                                                        [this.args_array[3], this.args_array[4]]);
        }
        else console.log("Invalid number of arguments for a Rectangle");
    };

    initializeSphere(){
        if (this.args_array.length == 4){
            this.primitive = new MySphere(this.scene,this.args_array[1], this.args_array[2], this.args_array[3]);
        }
        else console.log("Invalid number of arguments for a Sphere");
    }

    
    initializeTorus(){
        if (this.args_array.length == 5){
            this.primitive = new MyTorus(this.scene, this.args_array[1], this.args_array[2], this.args_array[3], 
                this.args_array[4]);
        }
        else console.log("Invalid number of arguments for a Torus");
    }

}

