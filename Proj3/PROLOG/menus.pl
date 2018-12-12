% Calls the main menu
mainMenu :-
    clearConsole,
	write('================================='), nl,
	write('=        ..:: ZURERO ::..       ='), nl,
	write('================================='), nl,
	write('=                               ='), nl,
	write('=   1. Start Game               ='), nl,
	write('=   2. Tutorial                 ='), nl,
	write('=   3. Credits                  ='), nl,
	write('=   4. Exit                     ='), nl,
	write('=                               ='), nl,
	write('================================='), nl,
	write('Choose an option:'), nl,
    readChar(Input),
    menuOptions(Input).

% Menu options logic
menuOptions('1') :- gameModeMenu, mainMenu.
menuOptions('2') :- gameTutorial,mainMenu.
menuOptions('3') :- credits,mainMenu.
menuOptions('4').
menuOptions(_) :- 
    nl,
    write('Error: invalid input.'), nl,
    pressEnterToContinue, nl,
    mainMenu.

% Calls the Gamemode Menu
gameModeMenu :-
        clearConsole,
        write('================================='), nl,
        write('=        ..:: ZURERO ::..       ='), nl,
        write('================================='), nl,
        write('=                               ='), nl,
        write('=   1. Human vs Human           ='), nl,
        write('=   2. Human vs Computer        ='), nl,
        write('=   3. Computer vs Computer     ='), nl,
        write('=   4. Return to Main Menu      ='), nl,
        write('=                               ='), nl,
        write('================================='), nl,
        write('Choose an option:'), nl,
        readChar(Input),
        gameModeOptions(Input).

% Gamemode menu options
gameModeOptions('1') :- startGame(pvp).
gameModeOptions('2') :- botMenu,startGame(pvb).
gameModeOptions('3') :- botMenu,startGame(bvb).
gameModeOptions('4').
gameModeOptions(_) :- 
    nl,
    write('Error: invalid input.'), nl,
    pressEnterToContinue, nl,
    gameModeMenu.

% Calls the bot menu
botMenu :-
    clearConsole,
    write('========================================'), nl,
    write('= Choose Bot Player Intelligence Level ='), nl,
    write('========================================'), nl,
    write('=                                      ='), nl,
    write('=   1. Easy                            ='), nl,
    write('=   2. Smart                           ='), nl,
    write('=                                      ='), nl,
    write('========================================'), nl,
    write('Choose an option:'), nl,
    readChar(Input),
    botOptions(Input). 

% Bot menu options
botOptions('1') :- deactivateBot,setBotInt(1).
botOptions('2') :- deactivateBot,setBotInt(2).
botOptions(_) :- 
    write('Error: Invalid Level of Intelligence'),nl,
    pressEnterToContinue, nl,
    botMenu.

% Calls the game tutorial interface
gameTutorial :-
    clearConsole,
	write('==================================================================='), nl,
	write('=                       ..:: Tutorial ::..                        ='), nl,
	write('==================================================================='), nl,
	write('=                                                                 ='), nl,
	write('=   In Zurero, the winner is the player that puts 5 stones of     ='), nl,
	write('=   his color in line. It can be horizontal,vertical or diagonal. ='), nl,
	write('=   To play, you need to slide your stone from one of the sides,  ='), nl,
	write('=   until it colides with one of the stones in the board.         ='), nl,
	write('=   If there is only one stone in that line/column, your stone    ='), nl,
	write('=   will push the previous one and will ocupy its position.       ='), nl,
	write('=   Your play commands should be in a specific format, where      ='), nl,
	write('=   the first char represents the side of the board from where    ='), nl,
	write('=   you play. Possible sides are:u(up), l(left), r(right) and     ='), nl,
	write('=   d(down)                                                       ='), nl,
	write('=   If you are playing from up or down, then you write the letter ='), nl,
	write('=   of the corresponding column, from A to S                      ='), nl,
	write('=   If you are playing from left or right, you will write the     ='), nl,
    write('=   number of the corresponding line, which is from 1 to 19       ='), nl,
    write('=   To quit from the game, write just q.                          ='), nl,
	write('=                                                                 ='), nl,
	write('==================================================================='), nl,
	pressEnterToContinue, nl.

% Calls the game credits interface
credits :-
    clearConsole,
	write('================================='), nl,
	write('=       ..:: Credits ::..       ='), nl,
	write('================================='), nl,
	write('=                               ='), nl,
	write('=   Developed by:               ='), nl,
	write('=    - Fernando Jorge Alves     ='), nl,
	write('=    - Joao Carlos Maduro       ='), nl,
	write('=                               ='), nl,
	write('=                               ='), nl,
	write('================================='), nl,
	pressEnterToContinue, nl.