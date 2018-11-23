/**
 * MyVehicle
 * @constructor
 */

class MyVehicle extends CGFobject{
    constructor(scene) {
        super(scene);
        this.front = new MyCylinder2(scene,2,0,5.0,5,1);
        this.body = new MyCylinder2(scene,3,2,5.0,5,1);
        this.back = new MyCylinder2(scene,3,3,1.0,5,1);
        this.exhaust = new MyCylinder2(scene,0,3,0.1,5,1);
        this.leftWingSide = new MyTriangle(scene,[0,0,5],[0,2.5,0],[0,0,0]);
        this.leftWingUp = new MyTriangle(scene,[0,0,5],[5,0,0],[0,2.5,0]);
        this.leftWingDown = new MyTriangle(scene,[0,0,0],[5,0,0],[0,0,5]);
        this.leftWingBack = new MyTriangle(scene,[0,0,0],[0,2.5,0],[5,0,0]);
        this.rightWingSide = new MyTriangle(scene,[0,0,5],[0,0,0],[0,2.5,0]);
        this.rightWingUp = new MyTriangle(scene,[0,0,5],[0,2.5,0],[-5,0,0]);
        this.rightWingDown = new MyTriangle(scene,[0,0,0],[0,0,5],[-5,0,0]);
        this.rightWingBack = new MyTriangle(scene,[0,0,0],[-5,0,0],[0,2.5,0]);
    };

    display(){
        this.scene.pushMatrix();
            this.displayBody();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.displayLeftWing();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.displayRightWing();
        this.scene.popMatrix();
    };

    displayBody(){
        this.scene.rotate(-Math.PI/2,0,0,1);
        
        this.scene.pushMatrix();
            this.scene.translate(0,0,-1);
            this.back.display();
            this.scene.translate(0,0,-0.1);

        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(0,0,-1.1);
            this.exhaust.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,5);
            this.front.display();
        this.scene.popMatrix();
    }

    displayLeftWing(){
        this.scene.translate(2,0,0);
        this.leftWingUp.display();
        this.leftWingDown.display();
        this.leftWingBack.display();
        this.leftWingSide.display();
    }

    displayRightWing(){
        this.scene.translate(-2,0,0);
        this.rightWingUp.display();
        this.rightWingDown.display();
        this.rightWingBack.display();
        this.rightWingSide.display();
    }


    applyTextures(factorS,factorT){
        let wingS = factorS*10;
        let wingT = factorT*10;
        this.rightWingUp.applyTextures(wingS,wingT);
        this.rightWingDown.applyTextures(wingS,wingT);
        this.rightWingBack.applyTextures(wingS,wingT);
        this.rightWingSide.applyTextures(wingS,wingT);

        this.leftWingUp.applyTextures(wingS,wingT);
        this.leftWingDown.applyTextures(wingS,wingT);
        this.leftWingBack.applyTextures(wingS,wingT);
        this.leftWingSide.applyTextures(wingS,wingT);
    }
}