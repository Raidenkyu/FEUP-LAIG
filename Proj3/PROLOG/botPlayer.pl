:- dynamic botInt/1.

% Sets bot intelligence level
setBotInt(Num):- assert(botInt(Num)).
% Destroys current bot level
deactivateBot :- retractall(botInt(Num)).


% Chooses a move for the bot to make
choose_move(Board, 1, PlayerTurn,Move) :-
    valid_moves(Board, PlayerTurn, ListOfMoves),
    length(ListOfMoves,ListSize),
    random(0,ListSize,Aux),
    iterateList(Aux, ListOfMoves, Out1, Out2),
    Move = [PlayerTurn,Out1,Out2].
choose_move(Board, 2, PlayerTurn,Move) :-
    valid_moves(Board, PlayerTurn, ListOfMoves),
    simAllMoves(PlayerTurn,Board,ListOfMoves,Out1,Out2),
    Move = [PlayerTurn,Out1,Out2].


% Simulates all moves for a level 2 bot
simAllMoves(PlayerTurn,Tab,ListOfMoves,MoveDir,MoveIndex) :- 
    simMovesAux(PlayerTurn,ListOfMoves, [], Lout,Tab),
    getBestMoves(Lout, -1000000, [], OutList, 0, SizeOut),
    selAMove(OutList,SizeOut,Out1,Out2),
    MoveDir = Out1,
    MoveIndex = Out2.


% Simulate all moves and create list with value
simMovesAux(PlayerTurn,[], Lin, Lout,Tab) :- Lout = Lin.
simMovesAux(PlayerTurn,ListMovesIn, Lin, Lout,Tab) :- 
    startSim,
    ListMovesIn = [Pair|Rest],
    Pair = [Dir|Temp],
    Temp = [Index|_],
    updateSim(PlayerTurn,Dir,Index,Tab),
    value(_,PlayerTurn,Value),
    append(Lin, [[Value, Dir, Index]], Aux),
    endSim,
    simMovesAux(PlayerTurn,Rest, Aux, Lout,Tab).

 
% Equivalent to update, but works inside a simulation
updateSim(PlayerTurn,'l',MoveIndex,Tab) :- playLeftSim(PlayerTurn,MoveIndex,Tab).
updateSim(PlayerTurn,'r',MoveIndex,Tab) :- playRightSim(PlayerTurn,MoveIndex,Tab).
updateSim(PlayerTurn,'u',MoveIndex,Tab) :- playUpSim(PlayerTurn,MoveIndex,Tab).
updateSim(PlayerTurn,'d',MoveIndex,Tab) :- playDownSim(PlayerTurn,MoveIndex,Tab).


% Gives a value to a board
value(Board, player1, Value) :- 
    b_piecesSim(Lb),
    valueBlack(Lb,0,OutVal1),
    w_piecesSim(Lw),
    valueWhite(Lw,0,OutVal2),
    Value is OutVal2 - OutVal1.
value(Board, player2, Value) :-
    b_piecesSim(Lb),
    valueBlack(Lb,0,OutVal1),
    w_piecesSim(Lw),
    valueWhite(Lw,0,OutVal2),
    Value is OutVal1 - OutVal2.


% Gets the best moves out of the possible moves list
getBestMoves([], _, Aux, OutList, SizeAux, SizeOut) :- OutList = Aux, SizeOut = SizeAux.
getBestMoves(List, CurrMax, Aux, OutList, SizeAux, SizeOut) :-
    % OutList format will be [MoveDir, MoveIndex]
    List = [H|RestAux],
    H = [NewMax|CoordsPair],
    ifElse((NewMax > CurrMax), (NewAux = [CoordsPair],
                                NewSize = 1,
                                getBestMoves(RestAux, NewMax, NewAux, OutList, NewSize, SizeOut)),
                (ifElse(NewMax == CurrMax, (append(Aux, [CoordsPair], NewAux),
                                            NewSize is SizeAux+1,
                                            getBestMoves(RestAux, CurrMax, NewAux, OutList, NewSize, SizeOut)),
                                                    getBestMoves(RestAux, CurrMax, Aux, OutList, SizeAux, SizeOut)))).
    

% Selects one move from the list of moves calculated by getBestMoves
selAMove(BestMoves,SizeList,MoveDir,MoveIndex) :-
    random(0, SizeList, Index),
    iterateList(Index, BestMoves, Out1, Out2),
    MoveDir = Out1,
    MoveIndex = Out2.


% Returns the MoveDir and MoveIndex of the move in position Index of the List
iterateList(0, [H|Rest], MoveDir, MoveIndex) :-
    H = [MoveDir|Aux],
    Aux = [MoveIndex|_].
iterateList(Index, [H|Rest], MoveDir, MoveIndex) :-
    NewIndex is Index-1,
    iterateList(NewIndex, Rest, MoveDir, MoveIndex).


% Gives a Value for the board for a player with black stones
valueBlack([],AuxSum,OutVal) :- OutVal = AuxSum.
valueBlack([H|Rest],AuxSum,OutVal) :-
    H = [X|Aux],
    Aux = [Y|_],
    avaliate_b(X,Y,AuxSum,Out1),
    valueBlack(Rest,Out1,OutVal).

% Gives a Value for the board for a player with white stones
valueWhite([],AuxSum,OutVal) :- OutVal = AuxSum.
valueWhite([H|Rest],AuxSum,OutVal) :-
    H = [X|Aux],
    Aux = [Y|_],
    avaliate_w(X,Y,AuxSum,Out1),
    valueWhite(Rest,Out1,OutVal).


% Avaliates a black piece and returns a value
avaliate_b(X,Y,Aux1,OutVal) :-
    b_piecesSim(Lb),
    w_piecesSim(Lw),

    avaliate_hor_b(X,Y,Lw,Lb,Aux1,Aux2),
    avaliate_vert_b(X,Y,Lw,Lb,Aux2,Aux3),
    avaliate_dia1_b(X,Y,Lw,Lb,Aux3,Aux4),
    avaliate_dia2_b(X,Y,Lw,Lb,Aux4,Aux5),
    avaliate_hor_rev_b(X,Y,Lw,Lb,Aux5,Aux6),
    avaliate_vert_rev_b(X,Y,Lw,Lb,Aux6,Aux7),
    avaliate_dia1_rev_b(X,Y,Lw,Lb,Aux7,Aux8),
    avaliate_dia2_rev_b(X,Y,Lw,Lb,Aux8,Aux9),
    OutVal is Aux9.

% Avaliates a white piece and returns a value
avaliate_w(X,Y,Aux1,OutVal) :-
    b_piecesSim(Lb),
    w_piecesSim(Lw),
    avaliate_hor_w(X,Y,Lw,Lb,Aux1,Aux2),
    avaliate_vert_w(X,Y,Lw,Lb,Aux2,Aux3),
    avaliate_dia1_w(X,Y,Lw,Lb,Aux3,Aux4),
    avaliate_dia2_w(X,Y,Lw,Lb,Aux4,Aux5),
    avaliate_hor_rev_w(X,Y,Lw,Lb,Aux5,Aux6),
    avaliate_vert_rev_w(X,Y,Lw,Lb,Aux6,Aux7),
    avaliate_dia1_rev_w(X,Y,Lw,Lb,Aux7,Aux8),
    avaliate_dia2_rev_w(X,Y,Lw,Lb,Aux8,Aux9),
    OutVal is Aux9.


% Counts the number of pieces of a given color in a horizontal line
countHor(Xmax,Y,L,OldN,NewN,Xmax) :- NewN = OldN.
countHor(X,Y,L,OldN,NewN,Xmax) :-
    ifElse(member([X,Y], L),Aux is OldN+1,Aux is OldN),
    NewX is X+1,
    countHor(NewX,Y,L,Aux,NewN,Xmax).

% Counts the number of pieces of a given color in a vertical line
countVert(X,Ymax,L,OldN,NewN,Ymax) :- NewN = OldN.
countVert(X,Y,L,OldN,NewN,Ymax) :-
    ifElse(member([X,Y], L),Aux is OldN+1,Aux is OldN),
    NewY is Y+1,
    countVert(X,NewY,L,Aux,NewN,Ymax).

% Counts the number of pieces of a given color in a diagonal line (quadrant 3 to 1)
countDia1(Nmax,_,L,OldN,NewN,Nmax) :- NewN = OldN.
countDia1(X,Y,L,OldN,NewN,Nmax) :-
    ifElse(member([X,Y], L),Aux is OldN+1,Aux is OldN),
    NewX is X+1,
    NewY is Y+1,
    countDia1(NewX,NewY,L,Aux,NewN,Nmax).

% Counts the number of pieces of a given color in a diagonal line (quadrant 2 to 4)
countDia2(Nmax,_,L,OldN,NewN,Nmax) :- NewN = OldN.
countDia2(X,Y,L,OldN,NewN,Nmax) :-
    ifElse(member([X,Y], L),Aux is OldN+1,Aux is OldN),
    NewX is X+1,
    NewY is Y-1,
    countDia2(NewX,NewY,L,Aux,NewN,Nmax).


% Avaliates a horizontal line for black pieces
avaliate_hor_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Xmax is X+5,
    OldNb is 0,
    OldNw is 0,
    countHor(X,Y,Lw,OldNw,NewNw,Xmax),
    countHor(X,Y,Lb,OldNb,NewNb,Xmax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed horizontal line for black pieces
avaliate_hor_rev_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Xmin is X-4,
    Xmax is X+1,
    OldNb is 0,
    OldNw is 0,
    countHor(Xmin,Y,Lw,OldNw,NewNw,Xmax),
    countHor(Xmin,Y,Lb,OldNb,NewNb,Xmax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.    
    
% Avaliates a horizontal line for white pieces
avaliate_hor_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Xmax is X+5,
    OldNb is 0,
    OldNw is 0,
    countHor(X,Y,Lw,OldNw,NewNw,Xmax),
    countHor(X,Y,Lb,OldNb,NewNb,Xmax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed horizontal line for white pieces
avaliate_hor_rev_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Xmin is X-4,
    Xmax is X+1,
    OldNb is 0,
    OldNw is 0,
    countHor(Xmin,Y,Lw,OldNw,NewNw,Xmax),
    countHor(Xmin,Y,Lb,OldNb,NewNb,Xmax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.        

% Avaliates a vertical line for black pieces
avaliate_vert_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Ymax is Y+5,
    OldNb is 0,
    OldNw is 0,
    countVert(X,Y,Lw,OldNw,NewNw,Ymax),
    countVert(X,Y,Lb,OldNb,NewNb,Ymax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed vertical line for black pieces
avaliate_vert_rev_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Ymax is Y+1,
    Ymin is Y-4,
    OldNb is 0,
    OldNw is 0,
    countVert(X,Ymin,Lw,OldNw,NewNw,Ymax),
    countVert(X,Ymin,Lb,OldNb,NewNb,Ymax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.    

% Avaliates a vertical line for white pieces
avaliate_vert_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Ymax is Y+5,
    OldNb is 0,
    OldNw is 0,
    countVert(X,Y,Lw,OldNw,NewNw,Ymax),
    countVert(X,Y,Lb,OldNb,NewNb,Ymax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed vertical line for white pieces
avaliate_vert_rev_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Ymax is Y+1,
    Ymin is Y-4,
    OldNb is 0,
    OldNw is 0,
    countVert(X,Ymin,Lw,OldNw,NewNw,Ymax),
    countVert(X,Ymin,Lb,OldNb,NewNb,Ymax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.    

% Avaliates a diagonal 1 line for black pieces
avaliate_dia1_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+5,
    OldNb is 0,
    OldNw is 0,
    countDia1(X,Y,Lw,OldNw,NewNw,Nmax),
    countDia1(X,Y,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed diagonal 1 line for black pieces
avaliate_dia1_rev_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+1,
    Xmin is X-4,
    Ymin is Y-4,
    OldNb is 0,
    OldNw is 0,
    countDia1(Xmin,Ymin,Lw,OldNw,NewNw,Nmax),
    countDia1(Xmin,Ymin,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.    

% Avaliates a diagonal 1 line for white pieces
avaliate_dia1_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+5,
    OldNb is 0,
    OldNw is 0,
    countDia1(X,Y,Lw,OldNw,NewNw,Nmax),
    countDia1(X,Y,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed diagonal 1 line for white pieces
avaliate_dia1_rev_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+1,
    Xmin is X-4,
    Ymin is Y-4,
    OldNb is 0,
    OldNw is 0,
    countDia1(Xmin,Ymin,Lw,OldNw,NewNw,Nmax),
    countDia1(Xmin,Ymin,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.    

% Avaliates a diagonal 2 line for black pieces
avaliate_dia2_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+5,
    OldNb is 0,
    OldNw is 0,
    countDia2(X,Y,Lw,OldNw,NewNw,Nmax),
    countDia2(X,Y,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed diagonal 2 line for black pieces
avaliate_dia2_rev_b(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+1,
    Xmin is X-4,
    Ymin is Y+4,
    OldNb is 0,
    OldNw is 0,
    countDia2(Xmin,Ymin,Lw,OldNw,NewNw,Nmax),
    countDia2(Xmin,Ymin,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNb,NewNw,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a diagonal 2 line for white pieces
avaliate_dia2_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+5,
    OldNb is 0,
    OldNw is 0,
    countDia2(X,Y,Lw,OldNw,NewNw,Nmax),
    countDia2(X,Y,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.

% Avaliates a reversed diagonal 2 line for white pieces
avaliate_dia2_rev_w(X,Y,Lw,Lb,Aux1,Aux2) :-
    Nmax is X+1,
    Xmin is X-4,
    Ymin is Y+4,
    OldNb is 0,
    OldNw is 0,
    countDia2(Xmin,Ymin,Lw,OldNw,NewNw,Nmax),
    countDia2(Xmin,Ymin,Lb,OldNb,NewNb,Nmax),
    scoreLine(NewNw,NewNb,Aval),
    Aux2 is Aux1 + Aval.