/**
 * GraphLeaf class, representing the graph leaves.
 */
class GraphLeaf {

    /**
     * @constructor
     */
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
            case 'p':
                this.initializePlane();
                break;
            case 'a':
                this.initializePatch();
                break;    
            case 'v':
                //TODO
                break;
            case 'n':
                this.initializeCylinder2();
                break;
            case 'g':
                this.initializeTerrain();
                break;       
            case 'h':
                //TODO
                break;           
        }

    };

    /**
     * Initializes a triangle primitive.
     */
    initializeTriangle(){
        if (this.args_array.length == 10){
            this.primitive = new MyTriangle(this.scene,[this.args_array[1], this.args_array[2], this.args_array[3]],
                                                       [this.args_array[4], this.args_array[5], this.args_array[6]],
                                                       [this.args_array[7], this.args_array[8], this.args_array[9]]);
        }
        else console.log("Invalid number of arguments for a Triangle");
    };

    /**
     * Initializes a cylinder primitive.
     */
    initializeCylinder(){
        if (this.args_array.length == 6){
            this.primitive = new MyCylinder(this.scene, this.args_array[1], this.args_array[2], this.args_array[3], 
                this.args_array[4], this.args_array[5]);
        }
        else console.log("Invalid number of arguments for a Cylinder");
    };

    /**
     * Initializes a rectangle primitive
     */
    initializeRectangle(){
        if (this.args_array.length == 5){
            this.primitive = new MyRectangle(this.scene,[this.args_array[1], this.args_array[2]],
                                                        [this.args_array[3], this.args_array[4]]);
        }
        else console.log("Invalid number of arguments for a Rectangle");
    };

    /**
     * Initializes a sphere primitive.
     */
    initializeSphere(){
        if (this.args_array.length == 4){
            this.primitive = new MySphere(this.scene,this.args_array[1], this.args_array[2], this.args_array[3]);
        }
        else console.log("Invalid number of arguments for a Sphere");
    }

    /**
     * Initializes a torus primitive.
     */
    initializeTorus(){
        if (this.args_array.length == 5){
            this.primitive = new MyTorus(this.scene, this.args_array[1], this.args_array[2], this.args_array[3], 
                this.args_array[4]);
        }
        else console.log("Invalid number of arguments for a Torus");
    }

    /**
     * Initializes a plane primitive.
     */
    initializePlane(){
        if (this.args_array.length == 3){
            this.primitive = new MyPlane(this.scene, this.args_array[1], this.args_array[2]);
        }
        else console.log("Invalid number of arguments for a Plane");
    }

    /**
     * Initializes a patch primitive.
     */
    initializePatch(){
        if (this.args_array.length == 6){
            this.primitive = new MyPatch(this.scene, this.args_array[1], this.args_array[2], this.args_array[3], this.args_array[4], this.args_array[5]);
        }
        else console.log("Invalid number of arguments for a Patch");
    }

    /**
     * Initializes a cylinder2 primitive.
     */
    initializeCylinder2(){
        if (this.args_array.length == 6){
            this.primitive = new MyCylinder2(this.scene, this.args_array[1], this.args_array[2], this.args_array[3], 
                this.args_array[4], this.args_array[5]);
        }
        else console.log("Invalid number of arguments for a Cylinder2");
    };


    /**
     * Initializes a terrain primitive.
     */
    initializeTerrain(){
        if (this.args_array.length == 5){
            this.primitive = new MyTerrain(this.scene, this.args_array[1], this.args_array[2], this.args_array[3], 
                this.args_array[4]);
        }
        else console.log("Invalid number of arguments for a Terrain");
    };


}

