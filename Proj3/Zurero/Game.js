/**
 * Game class, representing the game logic.
 */
class Game {
    /**
     * @constructor
     */
    constructor() {
        this.server = new Connection();
        this.boards = [];
        this.validMoves = [];
        this.boardIndex = 0;
        this.playerTurn = "player1";
        this.initBoard();
    }

    initBoard() {
        let reply = function(data) {
            this.boards = [];
            this.boardIndex = 0;
            this.boards.push(data);
            this.loading = false;
            this.updateValidMoves();
            dispatchEvent(new CustomEvent('gameLoaded', { detail: data }));
        };
        this.loading = true;
        let request = this.server.createRequest('initialBoard', null, reply.bind(this));
        return this.server.prologRequest(request);
    }

    move(command){
        let reply = function(data) {
            this.boardIndex++;
            this.boards.push(data);
            this.updateValidMoves();
            dispatchEvent(new CustomEvent('gameLoaded', { detail: data }));
            this.loading = false;
        };
        this.loading = true;
        let direction = command.charAt(0);
        let coord = command.substr(1);
        let move = [this.playerTurn,direction,coord];
        let request = this.server.createRequest('move', [this.getMoveString(move),this.getBoardString()], reply.bind(this));
        return this.server.prologRequest(request);
    }

    updateValidMoves() {
        let reply = function(data) {
            this.validMoves = data;
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

    changeTurn(){
        if(this.playerTurn == "player1"){
            this.playerTurn = "player2";
        }
        else{
            this.playerTurn = "player1";
        }
    }

    waitLoading(){
        while(3000){}
    }

    play(pickId){
        let command = this.pickingTranslator(pickId);
        this.move(command);
    }

    pickingTranslator(index) {
        let command;
        switch (index) {
            case 1:
                command = "uA";
                break;
            case 2:
                command = "uB";
                break;
            case 3:
                command = "uC";
                break;
            case 4:
                command = "uD";
                break;
            case 5:
                command = "uE";
                break;
            case 6:
                command = "uF";
                break;
            case 7:
                command = "uG";
                break;
            case 8:
                command = "uH";
                break;
            case 9:
                command = "uI";
                break;
            case 10:
                command = "uJ";
                break;
            case 11:
                command = "uK";
                break;
            case 12:
                command = "uL";
                break;
            case 13:
                command = "uM";
                break;
            case 14:
                command = "uN";
                break;
            case 15:
                command = "uO";
                break;
            case 16:
                command = "uP";
                break;
            case 17:
                command = "uQ";
                break;
            case 18:
                command = "uR";
                break;
            case 19:
                command = "uS";
                break;
            case 20:
                command = "dA";
                break;
            case 21:
                command = "dB";
                break;
            case 22:
                command = "dC";
                break;
            case 23:
                command = "dD";
                break;
            case 24:
                command = "dE";
                break;
            case 25:
                command = "dF";
                break;
            case 26:
                command = "dG";
                break;
            case 27:
                command = "dH";
                break;
            case 28:
                command = "dI";
                break;
            case 29:
                command = "dJ";
                break;
            case 30:
                command = "dK";
                break;
            case 31:
                command = "dL";
                break;
            case 32:
                command = "dM";
                break;
            case 33:
                command = "dN";
                break;
            case 34:
                command = "dO";
                break;
            case 35:
                command = "dP";
                break;
            case 36:
                command = "dQ";
                break;
            case 37:
                command = "dR";
                break;
            case 38:
                command = "dS";
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

    sleep(ms){
        let start = new Date().getTime();
        while((new Date().getTime() - start) <= ms){}
    }


}