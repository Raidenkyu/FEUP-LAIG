json(List, Output):-
    is_list(List),
    list_to_json(List, Output).

json(Number, Number):-
    number(Number).

json(Element, JSONElem):-
  surround(Element, '"', '"', JSONElem).



surround(Element, Left, Right, Surrounded):-
  atom_concat(Left, Element, Temp),
  atom_concat(Temp, Right, Surrounded).


matrix_to_json([], []).
matrix_to_json([List | R], [JsonList | Json]):-
  list_to_json(List, JsonList),
  matrix_to_json(R, Json).

list_to_json([], []).
list_to_json([Element | Rest], [JSONElem | JsonRest]):-
  json(Element, JSONElem),
  list_to_json(Rest, JsonRest).