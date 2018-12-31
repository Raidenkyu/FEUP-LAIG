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
        this.transScale = 2.22222;
        this.initPieces();
        this.initMaterials();
    };

    display(){
        this.scene.pushMatrix();
        this.scene.scale(0.45,0.2,0.45);
        this.blackMaterial.apply();
        for(var i = 0; i < this.blackPieces.length;i++){
            this.scene.pushMatrix();
            this.scene.translate(this.blackPieces[i][1]*this.transScale+1,0.3,this.blackPieces[i][0]*this.transScale+1);
            this.piece.display();
            this.scene.popMatrix();
        }
        this.whiteMaterial.apply();
        for(var i = 0; i < this.whitePieces.length;i++){
            this.scene.pushMatrix();
            this.scene.translate(this.whitePieces[i][1]*this.transScale+1,0.3,this.whitePieces[i][0]*this.transScale+1);
            this.piece.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }


    addBlackPiece(x,y){
        this.blackPieces.push([x,y]);
    }

    addWhitePiece(x,y){
        this.whitePieces.push([x,y]);
    }

    initPieces(){
        this.whitePieces = [];
        this.blackPieces = [];
        this.addWhitePiece(0,0);
        this.addBlackPiece(0,20);
    }

    storePieces(board){
        this.initPieces();
        for(var i = 0; i < board.length;i++){
            for(var j = 0; j < board[0].length;j++){
                if(board[j][i] == "blackStone"){

                    this.addBlackPiece(j+1,i+1);
                }
                else if(board[j][i] == "whiteStone"){
                    this.addWhitePiece(j+1,i+1);
                }
            }
        }
    }

    applyTextures(factorS, factorT){
        //this.piece.applyTextures(factorS,factorT);
    };


    initMaterials(){
        this.blackMaterial = new CGFappearance(this.scene);
        this.blackMaterial.setShininess(1);
        this.blackMaterial.setEmission(0, 0, 0, 0);
        this.blackMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.blackMaterial.setDiffuse(0.1, 0.1, 0.1, 1);
        this.blackMaterial.setSpecular(0.1, 0.1, 0.1, 1);

        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setShininess(1);
        this.whiteMaterial.setEmission(0, 0, 0, 0);
        this.whiteMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.whiteMaterial.setDiffuse(1, 1, 1, 1);
        this.whiteMaterial.setSpecular(1, 1, 1, 1);

        
    }
}