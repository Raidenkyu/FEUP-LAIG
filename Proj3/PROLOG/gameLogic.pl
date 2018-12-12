:- dynamic blackCell/2.
:- dynamic whiteCell/2.
:- dynamic bSimCell/2.
:- dynamic wSimCell/2.

% Get the piece in a given position
getPeca(Nlinha,Ncoluna,Tab,Peca) :-
    nth1(Nlinha,Tab,Linha),
    nth1(Ncoluna,Linha,Peca).

% Gets the line in a given index
getLinha(1,[Linha|_],Linha).
getLinha(N,[_|Resto],Linha) :-
    N > 1,
    Next is N-1,
    getLinha(Next,Resto,Linha).


% Sets a piece in a given position
setPeca(1, ElemCol, NewElem, [RowAtTheHead|RemainingRows], [NewRowAtTheHead|RemainingRows]):-
	setPecaLinha(ElemCol, NewElem, RowAtTheHead, NewRowAtTheHead).

setPeca(ElemRow, ElemCol, NewElem, [RowAtTheHead|RemainingRows], [RowAtTheHead|ResultRemainingRows]):-
	ElemRow > 1,
	ElemRow1 is ElemRow-1,
	setPeca(ElemRow1, ElemCol, NewElem, RemainingRows, ResultRemainingRows).

% Sets a piece in a line: 1. position; 2. element to use on replacement; 3. current list; 4. resultant list.
setPecaLinha(1, Elem, [_|L], [Elem|L]).
setPecaLinha(I, Elem, [H|L], [H|ResL]):-
	I > 1,
	I1 is I-1,
	setPecaLinha(I1, Elem, L, ResL).

% Get the piece in a line column
getPeca(Linha,Coluna,Peca):-
    cell(Linha,Coluna,Peca).

% Sets a piece in a given line
setPeca(Linha):-
    retract(cell(Linha,Coluna,_)),
    assert(cell(Linha,Coluna,Peca)).

% Plays left
playLeft(PlayerTurn,I,Tab,NewTab) :-
    Index is 20-I,
    nth1(Index,Tab,Linha),
    ifElse((nth1(I2,Linha,Elem),Elem \= emptySpace,!),slideStoneFromLeft(PlayerTurn,Index,I2,Linha,Tab,Elem,NewTab),true).

% Plays right
playRight(PlayerTurn,I,Tab,NewTab) :-
    Index is 20-I,
    nth1(Index,Tab,Linha),
    reverse(Linha,Temp),
    ifElse((nth1(Aux,Temp,Elem),Elem \= emptySpace,!),(I2 is 20-Aux,slideStoneFromRight(PlayerTurn,Index,I2,Linha,Tab,Elem,NewTab)),true).

% Plays up
playUp(PlayerTurn,Index,Tab,NewTab) :-
    ifElse((getPeca(I2,Index,Tab,Elem),Elem \= emptySpace,!),slideStoneFromUp(PlayerTurn,I2,Index,Elem,Tab,NewTab),true).

% Plays down
playDown(PlayerTurn,Index,Tab,NewTab) :-
    reverse(Tab,Temp),
    ifElse((getPeca(Aux,Index,Temp,Elem),Elem \= emptySpace,!),(I2 is 20-Aux,slideStoneFromDown(PlayerTurn,I2,Index,Elem,Tab,NewTab)),true).

% Plays left simulation
playLeftSim(PlayerTurn,I,Tab) :-
    Index is 20-I,
    nth1(Index,Tab,Linha),
    ifElse((nth1(I2,Linha,Elem),Elem \= emptySpace,!),slideStoneFromLeftSim(PlayerTurn,Index,I2,Linha,Tab,Elem),true).

% Plays right simulation
playRightSim(PlayerTurn,I,Tab) :-
    Index is 20-I,
    nth1(Index,Tab,Linha),
    reverse(Linha,Temp),
    ifElse((nth1(Aux,Temp,Elem),Elem \= emptySpace,!),(I2 is 20-Aux,slideStoneFromRightSim(PlayerTurn,Index,I2,Linha,Tab,Elem)),true).

% Plays up simulation
playUpSim(PlayerTurn,Index,Tab) :-
    ifElse((getPeca(I2,Index,Tab,Elem),Elem \= emptySpace,!),slideStoneFromUpSim(PlayerTurn,I2,Index,Elem,Tab),true).

% Plays down simulation
playDownSim(PlayerTurn,Index,Tab) :-
    reverse(Tab,Temp),
    ifElse((getPeca(Aux,Index,Temp,Elem),Elem \= emptySpace,!),(I2 is 20-Aux,slideStoneFromDownSim(PlayerTurn,I2,Index,Elem,Tab)),true).

% Slides a stone from left side
slideStoneFromLeft(PlayerTurn,Index,I2,Linha,Tab,Stone,NewTab) :-
    Num1 is I2+1,
    Num2 is I2-1,
    nth1(Num1,Linha,Elem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (Elem \= emptySpace), (setPeca(Index,Num2,Symbol,Tab,NewTab),storeCell(Symbol,Index,Num2)),
        (setPeca(Index,I2,Symbol,Tab,Tab1),
        setPeca(Index,Num1,Stone,Tab1,NewTab),
        rmCell(Stone,Index,I2),
        storeCell(Symbol,Index,I2),
        storeCell(Stone,Index,Num1))
).

% Slides a stone from right side
slideStoneFromRight(PlayerTurn,Index,I2,Linha,Tab,Stone,NewTab) :-
    Num1 is I2-1,
    Num2 is I2+1,
    nth1(Num1,Linha,Elem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (Elem \= emptySpace), (setPeca(Index,Num2,Symbol,Tab,NewTab),storeCell(Symbol,Index,Num2)),
        (setPeca(Index,I2,Symbol,Tab,Tab1),
        setPeca(Index,Num1,Stone,Tab1,NewTab),
        rmCell(Stone,Index,I2),
        storeCell(Symbol,Index,I2),
        storeCell(Stone,Index,Num1))
).

% Slides a stone from up side
slideStoneFromUp(PlayerTurn,I2,Index,Stone,Tab,NewTab) :-
    Num1 is I2+1,
    Num2 is I2-1,
    getPeca(Num1,Index,Tab,NextElem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (NextElem \= emptySpace),(setPeca(Num2,Index,Symbol,Tab,NewTab),storeCell(Symbol,Num2,Index)),
        (setPeca(I2,Index,Symbol,Tab,Tab1),
        setPeca(Num1,Index,Stone,Tab1,NewTab),
        rmCell(Stone,I2,Index),
        storeCell(Symbol,I2,Index),
        storeCell(Stone,Num1,Index))
).

% Slides a stone from down side
slideStoneFromDown(PlayerTurn,I2,Index,Stone,Tab,NewTab) :-
    Num1 is I2-1,
    Num2 is I2+1,
    getPeca(Num1,Index,Tab,NextElem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (NextElem \= emptySpace), (setPeca(Num2,Index,Symbol,Tab,NewTab),storeCell(Symbol,Num2,Index)),
        (setPeca(I2,Index,Symbol,Tab,Tab1),
        setPeca(Num1,Index,Stone,Tab1,NewTab),
        rmCell(Stone,I2,Index),
        storeCell(Symbol,I2,Index),
        storeCell(Stone,Num1,Index))
).


% Slides a stone from left side simulation
slideStoneFromLeftSim(PlayerTurn,Index,I2,Linha,Tab,Stone) :-
    Num1 is I2+1,
    Num2 is I2-1,
    nth1(Num1,Linha,Elem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (Elem \= emptySpace),storeSim(Symbol,Index,Num2),
        (rmSim(Stone,Index,I2),
        storeSim(Symbol,Index,I2),
        storeSim(Stone,Index,Num1))
).

% Slides a stone from right side simulation
slideStoneFromRightSim(PlayerTurn,Index,I2,Linha,Tab,Stone) :-
    Num1 is I2-1,
    Num2 is I2+1,
    nth1(Num1,Linha,Elem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (Elem \= emptySpace),storeSim(Symbol,Index,Num2),
        (rmSim(Stone,Index,I2),
        storeSim(Symbol,Index,I2),
        storeSim(Stone,Index,Num1))
).

% Slides a stone from up side simulation
slideStoneFromUpSim(PlayerTurn,I2,Index,Stone,Tab) :-
    Num1 is I2+1,
    Num2 is I2-1,
    getPeca(Num1,Index,Tab,NextElem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (NextElem \= emptySpace), storeSim(Symbol,Num2,Index),
        (rmSim(Stone,I2,Index),
        storeSim(Symbol,I2,Index),
        storeSim(Stone,Num1,Index))
).

% Slides a stone from down side simulation
slideStoneFromDownSim(PlayerTurn,I2,Index,Stone,Tab) :-
    Num1 is I2-1,
    Num2 is I2+1,
    getPeca(Num1,Index,Tab,NextElem),
    getPlayerSymbol(PlayerTurn,Symbol),
    ifElse(
        (NextElem \= emptySpace), storeSim(Symbol,Num2,Index),
        (rmSim(Stone,I2,Index),
        storeSim(Symbol,I2,Index),
        storeSim(Stone,Num1,Index))
).

% Gets the player symbol
getPlayerSymbol(player1,whiteStone).
getPlayerSymbol(player2,blackStone).

% Changes the turn
changeTurn(player1,player2).
changeTurn(player2,player1).

% Alternates the symbol
otherSymbol(whiteStone,blackStone).
otherSymbol(blackStone,whiteStone).

% Stores a cell
storeCell(whiteStone,Nlinha,Ncol) :- assert(whiteCell(Nlinha,Ncol)).
storeCell(blackStone,Nlinha,Ncol) :- assert(blackCell(Nlinha,Ncol)).

% Removes a cell
rmCell(whiteStone,Nlinha,Ncol) :- retract(whiteCell(Nlinha,Ncol)).
rmCell(blackStone,Nlinha,Ncol) :- retract(blackCell(Nlinha,Ncol)).

% Gets the min of a list
getMinList(List, Out) :-
    List = [H|Rest],
    getMinList(Rest, H, Out).
getMinList([], Min, Out) :- Out = Min.
getMinList([H|Rest], Min, Out) :-
    Min1 is min(H, Min),
    getMinList(Rest, Min1, Out).

% Gets the max of a list
getMaxList(List, Out) :-
    List = [H|Rest],
    getMaxList(Rest, H, Out).
getMaxList([], Max, Out) :- Out = Max.
getMaxList([H|Rest], Max, Out) :-
    Max1 is max(H, Max),
    getMaxList(Rest, Max1, Out).

% Stores a cell in a simulation
storeSim(whiteStone,Nlinha,Ncol) :- assert(wSimCell(Nlinha,Ncol)).
storeSim(blackStone,Nlinha,Ncol) :- assert(bSimCell(Nlinha,Ncol)).

% Removes a cell from a simulation
rmSim(whiteStone,Nlinha,Ncol) :- retract(wSimCell(Nlinha,Ncol)).
rmSim(blackStone,Nlinha,Ncol) :- retract(bSimCell(Nlinha,Ncol)).

% Starts a simulation
startSim :- 
    copyDataBase.

% Ends a simulation
endSim :-
    retractall(bSimCell(X,Y)),
    retractall(wSimCell(X,Y)).

% Verifies is a cell is an empty cell
isEmptyCell(Y,X) :-
    ifElse(blackCell(Y,X), fail, ifElse(whiteCell(Y,X), fail, true)).

% Returns the valid moves
valid_moves(Board, Player, ListOfMoves) :-
    storeBoard(Board),
    currentPieces(Tab,Pieces),
    getYcoords(Pieces, Aux1, OutList1),
    getMinList(OutList1, MinY),
    getMaxList(OutList1, MaxY),
    getXcoords(Pieces, Aux2, OutList2),
    getMinList(OutList2, MinX),
    getMaxList(OutList2, MaxX),
    NewMaxX is MaxX+1,
    NewMaxY is MaxY+1,

    SizeAux1 = 0,
    validateUp(MinX,NewMaxX,ListAux1,ListAux2,SizeAux1,SizeAux2),
    validateDown(MinX,NewMaxX,ListAux2,ListAux3,SizeAux2,SizeAux3),
    validateLeft(MinY,NewMaxY,ListAux3,ListAux4,SizeAux3,SizeAux4),
    validateRight(MinY,NewMaxY,ListAux4,ListAux5,SizeAux4,SizeAux5),

    ListOfMoves = ListAux5,
    ListSize = SizeAux5.

% Validates up moves
validateUp(MaxX,MaxX,ListAux1,ListAux2,SizeAux1,SizeAux2) :- ListAux2 = ListAux1, SizeAux2 = SizeAux1.
validateUp(MinX,MaxX,ListAux1,ListAux2,SizeAux1,SizeAux2) :-
    NewMinX is MinX+1,
    ifElse((\+ isEmptyCell(1,MinX), \+ isEmptyCell(2,MinX)),(validateUp(NewMinX,MaxX,ListAux1,ListAux2,SizeAux1,SizeAux2)),(append(ListAux1,[['u',MinX]],NewList),
                                                                                                                            NewSize is SizeAux1+1,
                                                                                                        validateUp(NewMinX,MaxX,NewList,ListAux2,NewSize,SizeAux2))).

% Validates down moves
validateDown(MaxX,MaxX,ListAux1,ListAux2,SizeAux1,SizeAux2) :- ListAux2 = ListAux1, SizeAux2 = SizeAux1.
validateDown(MinX,MaxX,ListAux1,ListAux2,SizeAux1,SizeAux2) :-
    NewMinX is MinX+1,
    ifElse((\+ isEmptyCell(19,MinX), \+ isEmptyCell(18,MinX)),(validateDown(NewMinX,MaxX,ListAux1,ListAux2,SizeAux1,SizeAux2)),(append(ListAux1,[['d',MinX]],NewList),
                                                                                                                                NewSize is SizeAux1+1,
                                                                                                                                validateDown(NewMinX,MaxX,NewList,ListAux2,NewSize,SizeAux2))).

% Validates left moves
validateLeft(MaxY,MaxY,ListAux1,ListAux2,SizeAux1,SizeAux2) :- ListAux2 = ListAux1, SizeAux2 = SizeAux1.
validateLeft(MinY,MaxY,ListAux1,ListAux2,SizeAux1,SizeAux2) :-
    NewMinY is MinY+1,
    CoordY is 20-MinY,
    ifElse((\+ isEmptyCell(MinY,1), \+ isEmptyCell(MinY,2)),(validateLeft(NewMinY,MaxY,ListAux1,ListAux2,SizeAux1,SizeAux2)),(append(ListAux1,[['l',CoordY]],NewList),
                                                                                                                                NewSize is SizeAux1+1,
                                                                                                                                validateLeft(NewMinY,MaxY,NewList,ListAux2,NewSize,SizeAux2))).

% Validates right moves
validateRight(MaxY,MaxY,ListAux1,ListAux2,SizeAux1,SizeAux2) :- ListAux2 = ListAux1, SizeAux2 = SizeAux1.
validateRight(MinY,MaxY,ListAux1,ListAux2,SizeAux1,SizeAux2) :-
    NewMinY is MinY+1,
    CoordY is 20-MinY,
    ifElse((\+ isEmptyCell(MinY,19), \+ isEmptyCell(MinY,18)),(validateRight(NewMinY,MaxY,ListAux1,ListAux2,SizeAux1,SizeAux2)),(append(ListAux1,[['r',CoordY]],NewList),
                                                                                                                                NewSize is SizeAux1+1,
                                                                                                                                validateRight(NewMinY,MaxY,NewList,ListAux2,NewSize,SizeAux2))).
storeBoard(Board) :-
    retractall(blackCell(X,Y)),
    retractall(whiteCell(X,Y)),
    storeMatrix(Board,1,1).

storeMatrix([],Nlinha,Ncol).
storeMatrix([H|Rest],Nlinha,Ncol):-
    storeLine(H,Nlinha,1),
    NewLinha is NLinha +1,
    storeMatrix(Rest,NewLinha,Ncol).

storeLine([]).
storeLine([H|Rest],Nlinha,Ncol) :-
    storeCell(H,Nlinha,Ncol),
    NewCol is Ncol +1,
    storeLine(Rest,Nlinha,NewCol).
