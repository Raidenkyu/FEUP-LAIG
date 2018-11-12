/**
 * MyPatch
 * @constructor
 */

class MyPatch extends CGFobject{
	constructor(scene, npointsU, npointsV, degree1, degree2, controlvertexes) {
		super(scene);
							
		var nurbsSurface = new CGFnurbsSurface(npointsU, npointsV, controlvertexes);
		this.obj = new CGFnurbsObject(scene, degree1, degree2, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)					
	}
	
	display(){
		this.obj.display();
	}

	applyTextures(){
		//Stub, not used
	}

}