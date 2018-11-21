/**
 * MyCylinder2
 * @constructor
 */

class MyCylinder2 extends CGFobject{
    
	constructor(scene, base_rad, top_rad, height, slices, stacks) {
        super(scene);
        
        let controlvertexes1 = [
            // U = 0
            [ // V = 0..8;
                [-base_rad, 0, 0, 1 ],
                [-base_rad, base_rad, 0, 0.707],
                [0, base_rad, 0, 1 ],
                [base_rad, base_rad, 0, 0.707],
                [base_rad, 0, 0, 1 ],
                [base_rad, -base_rad, 0, 0.707],
                [0, -base_rad, 0, 1 ],
                [-base_rad, -base_rad, 0, 0.707],
                [-base_rad, 0, 0, 1 ]
            ],
            // U = 1
            [ // V = 0..8
                [-top_rad, 0, height, 1 ],
                [-top_rad, top_rad, height, 0.707],
                [0, top_rad, height, 1 ],
                [top_rad, top_rad, height, 0.707],
                [top_rad, 0, height, 1 ],
                [top_rad, -top_rad, height, 0.707],
                [0, -top_rad, height, 1 ],
                [-top_rad, -top_rad, height, 0.707],
                [-top_rad, 0, height, 1 ]								 
            ]
        ];


							
		var nurbsSurface1 = new CGFnurbsSurface(1, 8, controlvertexes1);
        this.side1 = new CGFnurbsObject(scene, stacks, slices, nurbsSurface1); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)									
	}
	
	display(){
        this.side1.display();
	}

	applyTextures(){
		//Stub, not used
	}


}

