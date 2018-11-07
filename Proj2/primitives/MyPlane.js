/**
 * MyPlane
 * @constructor
 */

class MyPlane extends CGFobject{
	constructor(id, degree1, degree2, controlvertexes) {
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
		this.obj = new CGFnurbsObject(this, 20, 20, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		
	}

    display(){

       
        
    };

}