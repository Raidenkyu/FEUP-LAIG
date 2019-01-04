/**
 * MyPieces
 * @constructor
 */

var AniState = {Circ:1,Lin1Piece:2,Lin2Pieces1:3,Lin2Pieces2:4,Done:5};

class MyPieces extends CGFobject{
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.blackPieces = [];
        this.whitePieces = [];
        this.animatedPieces = [];
        this.aniState = AniState.Circ;
        this.piece = new MySphere(scene,1,15,15);
        this.transScale = 2.22222;
        this.animationTime = 0;
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

        for(var i = 0; i < this.animatedPieces.length;i++){
            if(i == 0){
                if(this.scene.game.ani_pTurn == "player1")
                    this.whiteMaterial.apply();
                else
                    this.blackMaterial.apply();
            }
            else if(i == 1){
                if(this.scene.game.ani_PieceColor == "whiteStone")
                    this.whiteMaterial.apply();
                else
                    this.blackMaterial.apply();
            }

            this.scene.pushMatrix();
            this.scene.translate(this.animatedPieces[i][2]*this.transScale+1,this.animatedPieces[i][1]+0.3,this.animatedPieces[i][0]*this.transScale+1);
            this.piece.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }


    update(deltaTime) {
        if(this.scene.game.animationRunning){
            
            //Init the animation
            if(this.scene.game.ani_firstIte){
                this.blackPiecesAnimation = [];
                this.whitePiecesAnimation = [];
                this.removePiecesAnimation();
                this.aniState = AniState.Circ;

                this.calcAnimationVals();

                let timePerCell = 0.3;

                this.circAnimation = new CircularAnimation("circular", 3, [this.centerArcPoint[0],0,this.centerArcPoint[1]], this.radius, 180, 180);
                
                if(this.scene.game.ani_PiecesCoords.length == 1){
                    this.linAnimation1 = new LinearAnimation("linear1piece", timePerCell*(this.nSpaces+1), [[this.endArcPoint[0],0,this.endArcPoint[1]],[this.endTranslate1Point[0],0,this.endTranslate1Point[1]]]);
                    this.aniPieces = 1;
                }
                else{
                    this.linAnimation1 = new LinearAnimation("linear1piece", timePerCell*(this.nSpaces+1), [[this.endArcPoint[0],0,this.endArcPoint[1]],[this.midTranslate1Point[0],0,this.midTranslate1Point[1]]]);
                    this.linAnimation2 = new LinearAnimation("linear2piece", timePerCell*(this.nSpaces+1), [[this.endTranslate1Point[0],0,this.endTranslate1Point[1]],[this.endTranslate1Point[0],0.001,this.endTranslate1Point[1]]]);
                    this.linAnimation3 = new LinearAnimation("linear3piece", timePerCell, [[this.midTranslate1Point[0],0,this.midTranslate1Point[1]],[this.endTranslate1Point[0],0,this.endTranslate1Point[1]]]);
                    this.linAnimation4 = new LinearAnimation("linear4piece", timePerCell, [[this.endTranslate1Point[0],0,this.endTranslate1Point[1]],[this.endTranslate2Point[0],0,this.endTranslate2Point[1]]]);
                    this.linAnimation5 = new LinearAnimation("linear5piece", timePerCell*(this.nSpaces+1), [[this.endTranslate1Point[0],0,this.endTranslate1Point[1]],[this.endTranslate1Point[0],0.001,this.endTranslate1Point[1]]]);
                    this.aniPieces = 2;
                }

                this.scene.game.ani_firstIte = false;
            }

            
            this.updateAnimations(deltaTime);


            this.animationTime += deltaTime;
            if(this.aniState == AniState.Done /*|| this.animationTime > 10.0*/){
                //Atualizar visualmente as valid moves
                this.scene.game.validMoves = this.scene.game.ani_ValidMoves;
                this.scene.game.validIDs = [];
                this.scene.game.validMoves.forEach(element => {
                    this.scene.game.validIDs.push(this.scene.game.getValidId(element));
                });

                this.animationTime = 0;
                this.reinsertPiecesAnimation();
                this.blackPiecesAnimation = [];
                this.whitePiecesAnimation = [];
                this.scene.game.animationRunning = false;

                //Jogo terminou
                if(this.scene.game.ani_term){
                    this.scene.game.terminated = true;
                    this.scene.game.validIDs = [];
                    this.scene.game.showWinner();
                }

                console.log("Terminou a Animação!");
            }
        }
	}



    updateAnimations(deltaTime){
        this.animatedPieces = [];

        this.updateAniState();

        switch(this.aniState){
            case AniState.Circ:
                //console.log("Circ");
                this.circAnimation.update(deltaTime);
                let newCircPos = this.circAnimation.applyPieces(this.dirVec);
                this.animatedPieces.push(newCircPos);
                if(this.aniPieces == 2){
                    this.linAnimation5.update(deltaTime);
                    let newCircPos2 = this.linAnimation5.applyPieces();
                    this.animatedPieces.push(newCircPos2);
                }
                //console.log(newCircPos);
                break;
            case AniState.Lin1Piece:
                //console.log("Lin1Piece");
                this.linAnimation1.update(deltaTime);
                let newPos = this.linAnimation1.applyPieces();
                this.animatedPieces.push(newPos);
                break;
            case AniState.Lin2Pieces1:
                //console.log("Lin2Pieces1");
                this.linAnimation1.update(deltaTime);
                this.linAnimation2.update(deltaTime);
                let newPos1 = this.linAnimation1.applyPieces();
                this.animatedPieces.push(newPos1);
                let newPos2 = this.linAnimation2.applyPieces();
                this.animatedPieces.push(newPos2);
                break;
            case AniState.Lin2Pieces2:
                //console.log("Lin2Pieces2");
                this.linAnimation3.update(deltaTime);
                this.linAnimation4.update(deltaTime);
                let newPos3 = this.linAnimation3.applyPieces();
                this.animatedPieces.push(newPos3);
                let newPos4 = this.linAnimation4.applyPieces();
                this.animatedPieces.push(newPos4);
                break; 
            case AniState.Done:
                console.log("Done");
                break;
        }

    }


    calcAnimationVals(){

        let dir = this.scene.game.ani_Dir;
        if(this.scene.game.ani_pTurn == "player1")
            this.startArcPoint = [0,0];
        else
            this.startArcPoint = [0,20];

        this.endTranslate1Point = this.scene.game.ani_PiecesCoords[0];

        if(this.scene.game.ani_PiecesCoords.length == 2){
            switch (dir){
                case "l":
                    this.midTranslate1Point = [this.scene.game.ani_PiecesCoords[0][0], this.scene.game.ani_PiecesCoords[0][1]-1];
                    this.endTranslate2Point = [this.scene.game.ani_PiecesCoords[0][0], this.scene.game.ani_PiecesCoords[0][1]+1];
                    break;
                case "r":
                    this.midTranslate1Point = [this.scene.game.ani_PiecesCoords[0][0], this.scene.game.ani_PiecesCoords[0][1]+1];
                    this.endTranslate2Point = [this.scene.game.ani_PiecesCoords[0][0], this.scene.game.ani_PiecesCoords[0][1]-1];
                    break;
                case "u":
                    this.midTranslate1Point = [this.scene.game.ani_PiecesCoords[0][0]-1, this.scene.game.ani_PiecesCoords[0][1]];
                    this.endTranslate2Point = [this.scene.game.ani_PiecesCoords[0][0]+1, this.scene.game.ani_PiecesCoords[0][1]];
                    break;
                case "d":
                    this.midTranslate1Point = [this.scene.game.ani_PiecesCoords[0][0]+1, this.scene.game.ani_PiecesCoords[0][1]];
                    this.endTranslate2Point = [this.scene.game.ani_PiecesCoords[0][0]-1, this.scene.game.ani_PiecesCoords[0][1]];
                    break;
            }
        }
        
        this.nSpaces = this.scene.game.ani_nSpaces;
        let index = this.scene.game.ani_Index;
        switch (dir){
            case "l":
                this.endArcPoint = [20-index, 0];
                break;
            case "r":
                this.endArcPoint = [20-index, 20];
                break;
            case "u":
                this.endArcPoint = [0, index];
                break;
            case "d":
                this.endArcPoint = [20, index];
                break;
        }


        this.centerArcPoint = [((this.endArcPoint[0]+this.startArcPoint[0])/2.0),((this.endArcPoint[1]+this.startArcPoint[1])/2.0)];
        this.radius = Math.sqrt(Math.pow((this.centerArcPoint[0]-this.startArcPoint[0]),2) + Math.pow((this.centerArcPoint[1]-this.startArcPoint[1]),2));

        let startEndVec = [this.endArcPoint[0]-this.startArcPoint[0], 0, this.endArcPoint[1]-this.startArcPoint[1]];
        let tempVec = [0,0,0];
        this.rotVecY(tempVec, startEndVec, [0,0,0], Math.PI/2);
        let vecLength = Math.sqrt(Math.pow(tempVec[0],2)+Math.pow(tempVec[1],2)+Math.pow(tempVec[2],2));
        this.dirVec = [tempVec[0]/vecLength,tempVec[1]/vecLength,tempVec[2]/vecLength];

        //console.log(this.startArcPoint);
        //console.log(this.centerArcPoint);
        //console.log(this.endArcPoint);
        //console.log(this.radius);
        
        //console.log(startEndVec);
        //console.log(this.dirVec);

    }

    removePiecesAnimation(){
        for(let i = 0; i < this.blackPieces.length; i++){
            for(let j = 0; j < this.scene.game.ani_PiecesCoords.length; j++){
                if(this.blackPieces[i][0] == this.scene.game.ani_PiecesCoords[j][0] && this.blackPieces[i][1] == this.scene.game.ani_PiecesCoords[j][1]){
                    this.blackPieces.splice(i,1);
                    i--;
                    break;
                }
            }
        }
        for(let i = 0; i < this.whitePieces.length; i++){
            for(let j = 0; j < this.scene.game.ani_PiecesCoords.length; j++){
                if(this.whitePieces[i][0] == this.scene.game.ani_PiecesCoords[j][0] && this.whitePieces[i][1] == this.scene.game.ani_PiecesCoords[j][1]){
                    this.whitePieces.splice(i,1);
                    i--;
                    break;
                }
            }
        }
    }

    reinsertPiecesAnimation(){
        for(let i = 0; i < this.blackPiecesAnimation.length; i++){
            this.blackPieces.push(this.blackPiecesAnimation[i]);
        }
        for(let i = 0; i < this.whitePiecesAnimation.length; i++){
            this.whitePieces.push(this.whitePiecesAnimation[i]);
        }
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
        if(this.scene != undefined)
            if(this.scene.game != undefined){
                this.addWhitePiece(0,0);
                this.addBlackPiece(0,20);
            }
    }

    storePieces(board){
        this.initPieces();
        for(var i = 0; i < board.length;i++){
            for(var j = 0; j < board[0].length;j++){
                if(board[j][i] == "blackStone"){
                    if(!this.scene.game.animationRunning)
                        this.addBlackPiece(j+1,i+1);
                    else{
                        let toAdd = true;
                        for(let k = 0; k < this.scene.game.ani_PiecesCoords.length; k++){
                            if(j+1 == this.scene.game.ani_PiecesCoords[k][0] && i+1 == this.scene.game.ani_PiecesCoords[k][1]){
                                this.blackPiecesAnimation.push([j+1,i+1]);
                                toAdd = false;
                            }
                        }
                        if(toAdd)
                            this.addBlackPiece(j+1,i+1);
                    }
                        
                }
                else if(board[j][i] == "whiteStone"){
                    if(!this.scene.game.animationRunning)
                        this.addWhitePiece(j+1,i+1);
                    else{
                        let toAdd = true;
                        for(let k = 0; k < this.scene.game.ani_PiecesCoords.length; k++){
                            if(j+1 == this.scene.game.ani_PiecesCoords[k][0] && i+1 == this.scene.game.ani_PiecesCoords[k][1]){
                                this.whitePiecesAnimation.push([j+1,i+1]);
                                toAdd = false;
                            }
                        }
                        if(toAdd)
                            this.addWhitePiece(j+1,i+1);
                    }

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

    updateAniState(){
        switch(this.aniState){
            case AniState.Circ:
                if(this.circAnimation.terminated)
                    if(this.scene.game.ani_PiecesCoords.length == 1)
                        this.aniState = AniState.Lin1Piece;
                    else
                        this.aniState = AniState.Lin2Pieces1;
                break;
            case AniState.Lin1Piece:
                if(this.linAnimation1.terminated)
                    this.aniState = AniState.Done;
                break;
            case AniState.Lin2Pieces1:
                if(this.linAnimation1.terminated && this.linAnimation2.terminated)
                    this.aniState = AniState.Lin2Pieces2;
                break;
            case AniState.Lin2Pieces2:
                if(this.linAnimation3.terminated && this.linAnimation4.terminated)
                    this.aniState = AniState.Done;
                break;
            case AniState.Done:
                break;
        }
    }


    rotVecY(out, a, b, c){

        let p = [], r=[];
      
        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
      
        //perform rotation
        r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
        r[1] = p[1];
        r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
      
        //translate to correct position
        out[0] = r[0] + b[0];
        out[1] = r[1] + b[1];
        out[2] = r[2] + b[2];
      
        return out;
    }


}