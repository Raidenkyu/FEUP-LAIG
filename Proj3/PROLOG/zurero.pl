%% includes

:- include('boardPrinter.pl').
:- include('utilities.pl').
:- include('menus.pl').
:- include('gameLogic.pl').
:- include('botPlayer.pl').
:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(library(random)).
:- use_module(library(system)).

% Defines both players
player(player1).
player(player2).

% Starts the application
zurero :-
    setrandomness,
    mainMenu.

% Starts a game session in the corresponding Game Mode
startGame(GameMode) :-
    initialBoard(Tab),
    retractall(blackCell(X,Y)),
    retractall(whiteCell(X,Y)),
    storeCell(blackStone,10,10),
    gameLoop(GameMode,player1,Tab).

% Game Loop for both human players
gameLoop(pvp,PlayerTurn,Tab) :-
    display_game(Tab),
    playHuman(PlayerTurn,Direction,Tab,NewTab),
    terminate(pvp,Direction,PlayerTurn,NewTab).

% Game Loop for player 1 when facing a computer
gameLoop(pvb,player1,Tab) :-
    display_game(Tab),
    playHuman(player1,Direction,Tab,NewTab),
    terminate(pvb,Direction,player1,NewTab).

% Game Loop for player2 when facing a human
gameLoop(pvb,player2,Tab) :-
    display_game(Tab),
    botInt(Level),
    playBot(player2,Level,Direction,Tab,NewTab),
    Direction = 'p', %%Valor aleatorio para ficar instanciado,
    terminate(pvb,Direction,player2,NewTab).

% Game Loop for both players controlled by computer
gameLoop(bvb,PlayerTurn,Tab) :-
    display_game(Tab),
    botInt(Level),
    playBot(PlayerTurn,Level,Direction,Tab,NewTab),
    Direction = 'p', %%Valor aleatorio para ficar instanciado,
    terminate(bvb,Direction,PlayerTurn,NewTab).

% For human to do his play
playHuman(PlayerTurn,Direction,Tab,NewTab) :-
    valid_moves(Board, Player, ListOfMoves),
    repeat,
    playerMessage(PlayerTurn),nl,
        (
        write('Write your command: '),
        readPlay(Chars),
        Chars = [DirectionCode|Aux],
        char_code(Direction, DirectionCode),
        interpret(Direction,Aux,Num),
        checkMove(Direction,Num,ListOfMoves),!;fail),
        move([PlayerTurn,Direction,Num],Tab,NewTab).


% Checks if play is valid      
checkMove('q',Num,ListOfMoves):- true.
checkMove(Direction,Num,ListOfMoves):- member([Direction,Num],ListOfMoves);fail.

% For computer to do its play when level of intelligence is 1
playBot(PlayerTurn,1,Direction,Tab,NewTab):-
    choose_move(Tab,1, PlayerTurn,Move),
    Move = [_|Rest],
    Rest = [MoveDir|Rest2],
    Rest2 = [MoveIndex|_],
    format("Computer Move: ~w~w", [MoveDir, MoveIndex]), nl,
    move(Move,Tab,NewTab).

% For computer to do its play when level of intelligence is 2
playBot(PlayerTurn,2,Direction,Tab,NewTab):-
    choose_move(Tab,2, PlayerTurn, Move),
    Move = [_|Rest],
    Rest = [MoveDir|Rest2],
    Rest2 = [MoveIndex|_],
    format("Computer Move: ~w~w", [MoveDir, MoveIndex]), nl,
    move(Move,Tab,NewTab).

% Gets the range of columns possible
getXcoords([], Xvalues, FinalList) :- FinalList = Xvalues.
getXcoords([H|Rest], Xvalues, FinalList) :-
    H = [Y|Aux],
    Aux = [X|_],
    append(Xvalues, [X], NewList),
    getXcoords(Rest, NewList, FinalList).

% Gets the range of columns possible
getYcoords([], Yvalues, FinalList) :- FinalList = Yvalues.
getYcoords([H|Rest], Yvalues, FinalList) :-
    H = [Y|Aux],
    Aux = [X|_],
    append(Yvalues, [Y], NewList),
    getYcoords(Rest, NewList, FinalList).

% Gets a list of all pieces in the board
currentPieces(Tab,Moves) :-
    b_pieces(Lb),
    w_pieces(Lw),
    append(Lb,Lw,Moves).
    
% Interprets the values of the human input
interpret('l',List,Num) :- interpretAux(List,Num).
interpret('r',List,Num) :- interpretAux(List,Num).
interpret('u',List,Num) :- charToIndex(List,Num).
interpret('d',List,Num) :- charToIndex(List,Num).
interpret('q',List,Num) :- true.
interpret(_,List,Num) :- write('Invalid Direction. You can only choose u(up), d(down), l(left) or r(right).'),nl,fail.

% Writes the message of the winning player
playerMessage(player1):- write('Player 1 Turn. You are the white stones').
playerMessage(player2):- write('Player 2 Turn. You are the black stones').

% Auxiliates the interpret predicate when player is playing in a line
interpretAux(X,Num):-
    length(X,L),
    checkLength(L),
    checkCharList(X),
    number_codes(N,X),
    Num is N,
    ifElse(N > 19,(write('Invalid Input: You have to select one position between 1 and 19'),nl,fail),true).

% Checks the length of the human input
checkLength(0) :- write('You have to select one position between 1 and 19'),nl,fail.
checkLength(_).
    

% updates the game state
update(PlayerTurn,'l',Coord,Tab,NewTab):- playLeft(PlayerTurn,Coord,Tab,NewTab).
update(PlayerTurn,'r',Coord,Tab,NewTab):- playRight(PlayerTurn,Coord,Tab,NewTab).
update(PlayerTurn,'u',Coord,Tab,NewTab):- playUp(PlayerTurn,Coord,Tab,NewTab).
update(PlayerTurn,'d',Coord,Tab,NewTab):- playDown(PlayerTurn,Coord,Tab,NewTab).
update(PlayerTurn,'q',Coord,Tab,NewTab):- true.
update(PlayerTurn,_,Coord,Tab,NewTab):- write('Invalid Direction. You can only choose u(up), d(down), l(left) or r(right).'),nl,fail.

% Makes a move in the Board
move(Move,Board,NewBoard):- 
    Move = [PlayerTurn|Rest],
    Rest = [Direction|Aux],
    Aux = [Coord|_],
    update(PlayerTurn,Direction,Coord,Board,NewBoard).


% Converts a char code to a index of the board columns
charToIndex([Code|_],Index) :-
    char_code(Char,Code),
    char_index(Char,Index).


% Terminates the game or calls the next game loop
terminate(GameMode,'q',Player,_) :- true.
terminate(GameMode,_,Player,Tab) :- game_over(Tab,Winner), continueGame(Winner, GameMode,Player, Tab).

% Validates a horizontal line of black pieces
validate_hor_b(X,Y,L) :-
Xmax is X+4,
between(X,Xmax,N),
\+member([N,Y], L), !, fail; true.

% Validates a vertical line of black pieces
validate_vert_b(X,Y,L) :-
Ymax is Y+4,
between(Y,Ymax,N),
\+member([X,N], L), !, fail; true.

% Validates the first diagonal line of black pieces
validate_dia1_b(X,Y,L) :-
between(0,4,N),
Xnew is X + N,
Ynew is Y + N,
\+member([Xnew,Ynew], L), !, fail; true.

% Validates the second diagonal line of black pieces
validate_dia2_b(X,Y,L) :-
between(0,4,N),
Xnew is X + N,
Ynew is Y - N,
\+member([Xnew,Ynew], L), !, fail; true.

% Validates a horizontal line of white pieces
validate_hor_w(X,Y,L) :-
Xmax is X+4,
between(X,Xmax,N),
\+member([N,Y], L), !, fail; true.

% Validates a vertical line of white pieces
validate_vert_w(X,Y,L) :-
Ymax is Y+4,
between(Y,Ymax,N),
\+member([X,N], L), !, fail; true.

% Validates the first diagonal line of white pieces
validate_dia1_w(X,Y,L) :-
between(0,4,N),
Xnew is X + N,
Ynew is Y + N,
\+member([Xnew,Ynew], L), !, fail; true.

% Validates the second diagonal line of white pieces
validate_dia2_w(X,Y,L) :-
between(0,4,N),
Xnew is X + N,
Ynew is Y - N,
\+member([Xnew,Ynew], L), !, fail; true.


% Validates all sequences of black pieces
validate_b(X,Y) :-
b_pieces(L),
validate_hor_b(X,Y,L), !;
b_pieces(L),
validate_vert_b(X,Y,L), !;
b_pieces(L),
validate_dia1_b(X,Y,L), !;
b_pieces(L),
validate_dia2_b(X,Y,L).

% Validates all sequences of white pieces
validate_w(X,Y) :- 
w_pieces(L),    
validate_hor_w(X,Y,L), !;
w_pieces(L), 
validate_vert_w(X,Y,L), !;
w_pieces(L), 
validate_dia1_w(X,Y,L), !;
w_pieces(L), 
validate_dia2_w(X,Y,L).



% Checks if game is over and what player is the winner
game_over(Board,Winner) :-

b_pieces(Lb),
w_pieces(Lw),
ifElse(checkBlack(Lb),(Winner = player2),ifElse(checkWhite(Lw),(Winner = player1),(Winner = none))).

% Iterates all black pieces to validate all sequences
checkBlack([H|Rest]) :-
    H = [X|Aux],
    Aux = [Y|_],
    validate_b(X,Y), !;
    checkBlack(Rest).

% Iterates all white pieces to validate all sequences
checkWhite([H|Rest]) :-
    H = [X|Aux],
    Aux = [Y|_],
    validate_w(X,Y), !;
    checkWhite(Rest).

% If the game has no winner continue to the next game loop, otherwise writes a congratulations message to the winner
continueGame(none, GameMode,Player, Tab) :-
    changeTurn(Player,NextPlayer),
    gameLoop(GameMode,NextPlayer,Tab).

continueGame(player1, GameMode,Player, Tab) :-
    display_game(Tab),
    format("Congratulations Player 1, you win!", []), nl,
    pressEnterToContinue.

continueGame(player2, GameMode,Player, Tab) :-
    display_game(Tab),
    format("Congratulations Player 2, you win!", []), nl,
    pressEnterToContinue.