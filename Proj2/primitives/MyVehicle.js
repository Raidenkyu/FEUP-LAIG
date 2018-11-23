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
        this.wingUp = new MyTriangle(scene,[0,0,5],[5,0,0],[0,2.5,0]);
        this.wingDown = new MyTriangle(scene,[0,0,0],[5,0,0],[0,0,5]);
        this.wingBack = new MyTriangle(scene,[0,0,0],[0,2.5,0],[5,0,0]);
    };

    display(){
        this.scene.pushMatrix();
            this.displayBody();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.displayWing();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.scale(-1,1,1);
            this.displayWing();
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

    displayWing(){
        this.scene.translate(2,0,0);
        this.wingUp.display();
        this.wingDown.display();
        this.wingBack.display();
    }


    applyTextures(factorS,factorT){
        let wingS = factorS*10;
        let wingT = factorT*10;
        this.wingUp.applyTextures(wingS,wingT);
        this.wingDown.applyTextures(wingS,wingT);
        this.wingBack.applyTextures(wingS,wingT);
    }
}