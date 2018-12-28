/**
 * MyPieces
 * @constructor
 */

class MyPieces extends CGFobject{
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.blackPieces = [];
        this.whitePieces = [];
        this.piece = new MySphere(scene,1,15,15);
        this.initPieces();
    };

    display(){
        this.scene.pushMatrix();
        this.scene.scale(0.45,0.2,0.45);
        for(var i = 0; i < this.blackPieces.length;i++){
            this.scene.pushMatrix();
            this.scene.translate(this.blackPieces[i][0],0.3,this.blackPieces[i][1]);
            this.scene.popMatrix();
        }
        for(var i = 0; i < this.whitePieces.length;i++){
            this.scene.pushMatrix();
            this.scene.translate(this.whitePieces[i][0],0.3,this.whitePieces[i][1]);
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }

    initPieces(){
        
    }

    applyTextures(factorS, factorT){
        this.piece.applyTextures(factorS,factorT);
    };
}