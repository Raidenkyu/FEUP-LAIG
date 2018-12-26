toAtom(Element, AtomElement) :-
    write('Here'),nl,
    open('/zurero_cache', write, StreamWrite),
    write(StreamWrite, '\''),
    checkElement(Element, ElementToWrite),
    write(StreamWrite, ElementToWrite),
    write(StreamWrite, '\''),
    write(StreamWrite, '.'),
    close(StreamWrite),
    open('/zurero_cache', read, StreamRead),
    read(StreamRead, AtomElement),
    close(StreamRead),
    atom(AtomElement).

checkElement(Element, ElementToWrite) :-
    var(Element),
    ElementToWrite = 'null'.
checkElement(Element, Element).