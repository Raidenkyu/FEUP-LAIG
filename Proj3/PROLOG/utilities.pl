% Asks the user to press enter before continuing
pressEnterToContinue:-
	write('Press <Enter> to continue.'), nl,
	get_char(_), !.

% Clears the console
clearConsole:-
	%%write('\33\[2J').
	clearConsole(40), !.

clearConsole(0).
clearConsole(N):-
	nl,
	N1 is N-1,
	clearConsole(N1).


% Reads a char and saves it in input
readChar(Input):-
	get_char(Input),
	get_char(_).

% Reads a user play
readPlay(Input) :-
	read_line(Input).


% Checks the char list
checkCharList([]).
checkCharList([Code|Rest]) :-
		char_code(Char,Code),
		ifElse(
			(Char @>= '0', Char @=< '9'), 
			(true,checkCharList(Rest)),
			(write('Invalid Input: After the direction you must choose a number between 1 a 19'),nl,fail)
		).

% Sets the randomness of the program
setrandomness :-
	now(Usec),NewSeed is Usec mod 12345,
	getrand(random(X, Y, Z, _)),
	setrand(random(NewSeed, X, Y, Z)).

% Auxiliar function to help with finds
uList(X, [], [X])  :- !.
uList(H, [H|_], _) :- !, fail.
uList(X, [H|T], [H|Rtn]) :- uList(X, T, Rtn).

% Returns the black pieces
b_pieces(L) :- find_b([], L), !.

% Finds all black pieces
find_b(Acc, Loa) :- blackCell(X,Y), uList([X,Y], Acc, AccNew), find_b(AccNew, Loa).
find_b(Acc, Acc).

% Returns the white pieces
w_pieces(L) :- find_w([], L), !.

% Finds all white pieces
find_w(Acc, Loa) :- whiteCell(X,Y), uList([X,Y], Acc, AccNew), find_w(AccNew, Loa).
find_w(Acc, Acc).

% Copies black pieces
findCopyB :- blackCell(X,Y), storeSim(blackStone,X,Y), fail; true.
% Copies white pieces
findCopyW :- whiteCell(X,Y), storeSim(whiteStone,X,Y), fail; true.

% Returns the black simulated pieces
b_piecesSim(L) :- find_bSim([], L), !.

% Finds all black simulated pieces
find_bSim(Acc, Loa) :- bSimCell(X,Y), uList([X,Y], Acc, AccNew), find_bSim(AccNew, Loa).
find_bSim(Acc, Acc).

% Returns the white simulated pieces
w_piecesSim(L) :- find_wSim([], L), !.

% Finds all white simulated pieces
find_wSim(Acc, Loa) :- wSimCell(X,Y), uList([X,Y], Acc, AccNew), find_wSim(AccNew, Loa).
find_wSim(Acc, Acc).


% Copies the database
copyDataBase :-
	findCopyB,
	findCopyW.

% Atributes values of a line
scoreLine(_,1,OutValue) :- OutValue is 0.
scoreLine(_,2,OutValue) :- OutValue is 0.
scoreLine(_,3,OutValue) :- OutValue is 0.
scoreLine(_,4,OutValue) :- OutValue is 0.
scoreLine(1,0,OutValue) :- OutValue is 0.
scoreLine(2,0,OutValue) :- OutValue is 0.
scoreLine(3,0,OutValue) :- OutValue is 100.
scoreLine(4,0,OutValue) :- OutValue is 500.
scoreLine(5,0,OutValue) :- OutValue is 10000.

% If/Else operator
ifElse(C,G,E) :- C, !, G.
ifElse(C,G,E) :- E.

% Setups a test board, not used in the actual project
setupTestTab(Tab) :-
	storeCell(blackStone,4,2),
	storeCell(blackStone,5,2),
	storeCell(blackStone,6,2),
	storeCell(blackStone,7,2),
	storeCell(blackStone,4,3),
	storeCell(whiteStone,3,3),
	storeCell(whiteStone,5,3),
	storeCell(whiteStone,5,4),
	storeCell(blackStone,1,2),
	storeCell(blackStone,2,2),
	storeCell(blackStone,3,18),
	storeCell(blackStone,3,19),
	storeCell(blackStone,2,18),

	Tab = [[emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace],
			[emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace],
			[emptySpace,emptySpace,whiteStone,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace],
			[emptySpace,blackStone,blackStone,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace],
			[emptySpace,blackStone,whiteStone,whiteStone,emptySpace,emptySpace,emptySpace,emptySpace],
			[emptySpace,blackStone,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace],
			[emptySpace,blackStone,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace],
			[emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace,emptySpace]].

% Char to index conversion
char_index('A',1).
char_index('B',2).
char_index('C',3).
char_index('D',4).
char_index('E',5).
char_index('F',6).
char_index('G',7).
char_index('H',8).
char_index('I',9).
char_index('J',10).
char_index('K',11).
char_index('L',12).
char_index('M',13).
char_index('N',14).
char_index('O',15).
char_index('P',16).
char_index('Q',17).
char_index('R',18).
char_index('S',19).
char_index(_,_) :- !,write('Invalid Input: you can only choose a letter between A and S.'),nl,fail.

        
