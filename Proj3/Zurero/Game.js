var GameMode = {PVP:1,PVB:2,BVB:3};

/**
 * Game class, representing the game logic.
 */
class Game {
    /**
     * @constructor
     */
    constructor(scene) {
        this.scene = scene;
        this.mode = GameMode.PVP;
        this.pieces = this.scene.graph.primitives['pieces'];
        this.server = new Connection();
        this.botLevel = 1; // Assumiste bem.
        this.initBoard();
    }

    initBoard() {
        this.botAction = false;
        this.terminated = false;
        this.winner = 'none';
        this.boards = [];
        this.movesArray = [];
        this.validMoves = [];
        this.validIDs = [];
        this.boardIndex = 0;
        this.playerTurn = "player1";
        this.animationRunning = false;
        let reply = function(data) {
            this.boards.push(data);
            this.pieces.storePieces(data);
            this.updateValidMoves();
            if(this.mode == GameMode.BVB){
                this.botAction = true;
            }
            dispatchEvent(new CustomEvent('gameLoaded', { detail: data }));
        };
        let request = this.server.createRequest('initialBoard', null, reply.bind(this));
        return this.server.prologRequest(request);
    }

    move(command){
        let reply = function(data) {
            this.addBoard(data);
            dispatchEvent(new CustomEvent('gameLoaded', { detail: data }));
        };
        let direction = command.charAt(0);
        let coord = command.substr(1);
        if(this.checkMove(direction,coord)){
            let move = [this.playerTurn,direction,coord];
            let request = this.server.createRequest('move', [this.getMoveString(move),this.getBoardString()], reply.bind(this));
            
            this.setupAnimationVars(direction, coord);
            console.log("Animation Running = " + this.animationRunning);

            return this.server.prologRequest(request);
        }
        console.log("Invalid Move");
        return false;
        
    }

    setupAnimationVars(direction, coord){
        let currTurn = this.movesArray.length-1;
        this.ani_Dir = direction
        this.ani_Index = parseInt(coord);
        this.ani_firstIte = true;
        this.ani_term = false;
        this.ani_winner = "none";
        this.calcBoardDif(this.ani_Dir, this.ani_Index-1, this.boards[currTurn]);

        this.animationRunning = true;
    }

    calcBoardDif(dir, index, oldBoard){
        let count;
        let cell;
        this.ani_PiecesCoords = [];
        switch (dir) {
            case "l":
                count = 0;
                cell = oldBoard[18-index][count];
                while(cell == "emptySpace"){
                    count++;
                    cell = oldBoard[18-index][count];
                }
                if(oldBoard[18-index][count+1] == "emptySpace"){
                    this.ani_PiecesCoords.push([18-index+1,count+1], [18-index+1, count+2]);
                }
                else{
                    this.ani_PiecesCoords.push([18-index+1,count]);
                }
                break;

            case "r":
                count = 18;
                cell = oldBoard[18-index][count];
                while(cell == "emptySpace"){
                    count--;
                    cell = oldBoard[18-index][count];
                }
                if(oldBoard[18-index][count-1] == "emptySpace"){
                    this.ani_PiecesCoords.push([18-index+1,count+1], [18-index+1, count]);
                }
                else{
                    this.ani_PiecesCoords.push([18-index+1, count+2]);
                }
                break;

            case "u":
                count = 0;
                cell = oldBoard[count][index];
                while(cell == "emptySpace"){
                    count++;
                    cell = oldBoard[count][index];
                }
                if(oldBoard[count+1][index] == "emptySpace"){
                    this.ani_PiecesCoords.push([count+1,index+1], [count+2, index+1]);
                }
                else{
                    this.ani_PiecesCoords.push([count,index+1]);
                }
                break;

            case "d":
                count = 18;
                cell = oldBoard[count][index];
                while(cell == "emptySpace"){
                    count--;
                    cell = oldBoard[count][index];
                }
                if(oldBoard[count-1][index] == "emptySpace"){
                    this.ani_PiecesCoords.push([count+1,index+1], [count, index+1]);
                }
                else{
                    this.ani_PiecesCoords.push([count+2, index+1]);
                }
                break;     
        }

        /*
        if(this.playerTurn == "player1"){
            this.ani_PiecesCoords.push([0,0]);
        }
        else{
            this.ani_PiecesCoords.push([0,20]);
        }
        */
        this.ani_pTurn = this.playerTurn;
        
    }

    undo(){ 
        if(this.boardIndex > 1){
            this.boards.pop();
            this.boards.pop();
            this.movesArray.pop();
            this.movesArray.pop();
            this.boardIndex--;
            this.boardIndex--;
            this.pieces.storePieces(this.boards[this.boardIndex]);
            this.updateValidMoves();
        }
        else{
            console.log("This was the initial board!! There's no previous board!");
        }
    }

    checkMove(direction,coord){
        let num = parseInt(coord);
        for(var i = 0; i < this.validMoves.length;i++){
            if(this.validMoves[i][0] == direction && this.validMoves[i][1] == num){
                return true;
            }
        }
        return false;
    }

    gameover(){
        let reply = function(data) {
            this.winner = data;
            if(this.winner != 'none'){
                if(!this.animationRunning){
                    this.terminated = true;
                    this.validIDs = [];
                    this.showWinner;
                }
                else{
                    this.ani_term = true;
                }
            }
            else{
                this.updateValidMoves();
            }
            dispatchEvent(new CustomEvent('gameLoaded', { detail: data }));
        };
        let request = this.server.createRequest('game_over', [this.getBoardString()], reply.bind(this));
        return this.server.prologRequest(request);
    }

    showWinner(){
        console.log("Congratulions " + this.winner + "! You Win!");
    }

    playBot(){
        let reply = function(data) {
            this.addBoard(data);
            dispatchEvent(new CustomEvent('gameLoaded', { detail: data }));
        };
        let request = this.server.createRequest('playBot', [this.playerTurn,this.botLevel,this.getBoardString()], reply.bind(this));
        return this.server.prologRequest(request);
    }

    updateValidMoves() {
        let reply = function(data) {
            if(!this.animationRunning){
                this.validMoves = data;
                this.validIDs = [];
                this.validMoves.forEach(element => {
                    this.validIDs.push(this.getValidId(element));
                });
            }
            else{
                this.ani_ValidMoves = data;
            }

            dispatchEvent(new CustomEvent('gameLoaded', { detail: data }));
        };
        let request = this.server.createRequest('valid_moves', [this.getBoardString(),this.playerTurn], reply.bind(this));
        this.server.prologRequest(request);
    }

    getBoardString() {
        return JSON.stringify(this.boards[this.boardIndex]);
    }

    getMoveString(move){
        return JSON.stringify(move);
    }

    botTurn(){
        if(this.botAction && !this.terminated){
            this.botAction = false;
            this.playBot();
        }
    }

    nextTurn(){
        this.changeTurn();
        if(this.mode == GameMode.BVB || (this.mode == GameMode.PVB && this.playerTurn == "player2")){
            this.botAction = true;
        }
    }

    changeTurn(){
        if(this.playerTurn == "player1"){
            this.playerTurn = "player2";
        }
        else{
            this.playerTurn = "player1";
        }


    }


    play(pickId){
        if(!this.animationRunning){
            if(this.mode == GameMode.PVP || (this.mode == GameMode.PVB && this.playerTurn == "player1")){
                let command = this.pickingTranslator(pickId);
                this.movesArray.push(command);
                this.move(command);
            }
        }
    }

    playGameMovie(){
        
    }

    addBoard(board){
        if(board != null && board != []){
            this.boardIndex++;
            this.boards.push(board);
            this.pieces.storePieces(board);
            this.gameover();
            this.nextTurn();
        }
    }

    pickingTranslator(index) {
        let command;
        switch (index) {
            case 1:
                command = "u1";
                break;
            case 2:
                command = "u2";
                break;
            case 3:
                command = "u3";
                break;
            case 4:
                command = "u4";
                break;
            case 5:
                command = "u5";
                break;
            case 6:
                command = "u6";
                break;
            case 7:
                command = "u7";
                break;
            case 8:
                command = "u8";
                break;
            case 9:
                command = "u9";
                break;
            case 10:
                command = "u10";
                break;
            case 11:
                command = "u11";
                break;
            case 12:
                command = "u12";
                break;
            case 13:
                command = "u13";
                break;
            case 14:
                command = "u14";
                break;
            case 15:
                command = "u15";
                break;
            case 16:
                command = "u16";
                break;
            case 17:
                command = "u17";
                break;
            case 18:
                command = "u18";
                break;
            case 19:
                command = "u19";
                break;
            case 20:
                command = "d1";
                break;
            case 21:
                command = "d2";
                break;
            case 22:
                command = "d3";
                break;
            case 23:
                command = "d4";
                break;
            case 24:
                command = "d5";
                break;
            case 25:
                command = "d6";
                break;
            case 26:
                command = "d7";
                break;
            case 27:
                command = "d8";
                break;
            case 28:
                command = "d9";
                break;
            case 29:
                command = "d10";
                break;
            case 30:
                command = "d11";
                break;
            case 31:
                command = "d12";
                break;
            case 32:
                command = "d13";
                break;
            case 33:
                command = "d14";
                break;
            case 34:
                command = "d15";
                break;
            case 35:
                command = "d16";
                break;
            case 36:
                command = "d17";
                break;
            case 37:
                command = "d18";
                break;
            case 38:
                command = "d19";
                break;
            case 39:
                command = "l19";
                break;
            case 40:
                command = "l18";
                break;
            case 41:
                command = "l17";
                break;
            case 42:
                command = "l16";
                break;
            case 43:
                command = "l15";
                break;
            case 44:
                command = "l14";
                break;
            case 45:
                command = "l13";
                break;
            case 46:
                command = "l12";
                break;
            case 47:
                command = "l11";
                break;
            case 48:
                command = "l10";
                break;
            case 49:
                command = "l9";
                break;
            case 50:
                command = "l8";
                break;
            case 51:
                command = "l7";
                break;
            case 52:
                command = "l6";
                break;
            case 53:
                command = "l5";
                break;
            case 54:
                command = "l4";
                break;
            case 55:
                command = "l3";
                break;
            case 56:
                command = "l2";
                break;
            case 57:
                command = "l1";
                break;
            case 58:
                command = "r19";
                break;
            case 59:
                command = "r18";
                break;
            case 60:
                command = "r17";
                break;
            case 61:
                command = "r16";
                break;
            case 62:
                command = "r15";
                break;
            case 63:
                command = "r14";
                break;
            case 64:
                command = "r13";
                break;
            case 65:
                command = "r12";
                break;
            case 66:
                command = "r11";
                break;
            case 67:
                command = "r10";
                break;
            case 68:
                command = "r9";
                break;
            case 69:
                command = "r8";
                break;
            case 70:
                command = "r7";
                break;
            case 71:
                command = "r6";
                break;
            case 72:
                command = "r5";
                break;
            case 73:
                command = "r4";
                break;
            case 74:
                command = "r3";
                break;
            case 75:
                command = "r2";
                break;
            case 76:
                command = "r1";
                break;
        }
        return command;
    }

    getValidId(move) {
        let id;
        switch (move[0]) {
            case "u":
                id = 0*19 + move[1];
                break;
            case "d":
                id = 1*19 + move[1];
                break;
            case "l":
                id = 2*19 + 20 - move[1];
                break;
            case "r":
                id = 3*19 + 20 - move[1];
                break;                                            
        }
        return id;
    }



}