/**
 * MyPlane
 * @constructor
 */

class MyPlane extends CGFobject{
	constructor(scene, degree1, degree2) {
		super(scene);
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
		this.obj = new CGFnurbsObject(scene, degree1, degree2, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
							
	}
	
	display(){
		this.obj.display();
	}

	applyTextures(){
		//Stub, not used
	}

}