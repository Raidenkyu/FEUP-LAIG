/**
 * MyPieces
 * @constructor
 */

var AniState = {Circ:1,Lin1:2,Lin2:3,Done:4};

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
            this.scene.pushMatrix();
            this.scene.translate(this.animatedPieces[i][2]*this.transScale+1,0.3,this.animatedPieces[i][0]*this.transScale+1);
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
                this.scene.game.ani_firstIte = false;

                this.calcAnimationVals();
                this.circAnimation = new CircularAnimation("circular", 3, this.centerArcPoint, this.radius, 0, Math.PI);
                
                if(this.scene.game.ani_PiecesCoords.length == 1){
                    this.linAnimation1 = new LinearAnimation("linear1piece", 3, [[0,0,0],[10,0,10]]);
                    this.aniPieces = 1;
                }
                else{
                    this.linAnimation1 = new LinearAnimation("linear1piece", 3, [[0,0,0],[10,0,10]]);
                    this.linAnimation2 = new LinearAnimation("linear1piece", 3, [[0,0,0],[10,0,10]]);
                    this.linAnimation3 = new LinearAnimation("linear1piece", 3, [[0,0,0],[10,0,10]]);
                    this.aniPieces = 2;
                }

            }

            
            this.updateAnimations(deltaTime);


            this.animationTime += deltaTime;
            if(this.animationTime > 7.0){ //Terminou a animação, 7s neste momento
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

        switch(this.aniState){
            case AniState.Circ:
                if(this.circAnimation.terminated)
                    this.aniState = AniState.Lin1;
                
                break;
            case AniState.Lin1:
                if(this.linAnimation1.terminated){
                    if(this.aniPieces == 1)
                        this.aniState = AniState.Done;
                    else
                        this.aniState = AniState.Lin2;
                }
                break;
            case AniState.Lin2:
                if(this.linAnimation2.terminated && this.linAnimation3.terminated){
                    this.aniState = AniState.Done;
                }
                break;
            case AniState.Done:
                break;
        }
        

        switch(this.aniState){
            case AniState.Circ:
                console.log("Circ");
                break;
            case AniState.Lin1:
                console.log("Lin1");
                break;
            case AniState.Lin2:
                console.log("Lin2");
                break;
        }


        this.linAnimation1.update(deltaTime);



        if(!this.linAnimation1.terminated){
                
            let newPos = this.linAnimation1.applyPieces();
            this.animatedPieces.push(newPos);
            //console.log(newPos);
        }

    }

    calcAnimationVals(){

        this.startArcPoint = this.scene.game.ani_PiecesCoords[this.scene.game.ani_PiecesCoords.length-1];

        this.endTranslatePoint = this.scene.game.ani_PiecesCoords[0];

        let dir = this.scene.game.ani_Dir;
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
        /*
        if(this.scene.game.ani_pTurn == "player1")
            this.whitePieces.push([0,0]);
        else
            this.blackPieces.push([0,20]);
            */

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
                //if(!this.scene.game.animationRunning){
                    this.addWhitePiece(0,0);
                    this.addBlackPiece(0,20);
                /*}
                else{
                    if(this.scene.game.ani_pTurn == "player1")
                        this.addBlackPiece(0,20);
                    else
                        this.addWhitePiece(0,0);
                }
                */
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
}