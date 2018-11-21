/**
 * MyTerrain
 * @constructor
 */

class MyTerrain extends CGFobject{
	constructor(scene, idTexture, idHeightMap, parts, heightScale) {
        super(scene);
        
        this.scene = scene;
        this.idTexture = idTexture;

        this.testShader = new CGFshader(scene.gl, "shaders/texture1.vert", "shaders/texture1.frag");

		var controlvertexes = [	// U = 0
								[ // V = 0..1;
									[-0.5, 0.0, -0.5, 1 ],
									[0.5,  0.0, -0.5, 1 ]
									
								],
								// U = 1
								[ // V = 0..1
									[ -0.5, 0.0, 0.5, 1 ],
									[ 0.5,  0.0, 0.5, 1 ]							 
								]
							];
							
		var nurbsSurface = new CGFnurbsSurface(1, 1, controlvertexes);
		this.obj = new CGFnurbsObject(scene, parts, parts, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
							
	}
	
	display(){

        this.scene.setActiveShader(this.testShader);
    
        //this.textures[this.idTexture].bind(1);
    
        /*
        this.scene.translate(0,-6,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);	
        */

        
        this.obj.display();
    
        this.scene.setActiveShader(this.scene.defaultShader);
	}

	applyTextures(){
		//Stub, not used
	}

}