/**
 * Connection class, representing a connection to the PROLOG Server.
 */
class Connection {

    /**
     * @constructor
     */
    constructor(port) {
        this.port = port || 8081;
    }
    
    createRequest(command, args, onSuccess, onError) {
        let request = {
            command: command,
            args: args,
            onSuccess: onSuccess,
            onError: onError
        };
        return request;
    }

    prologRequest(request) {
        // Get Parameter Values
        let requestString = request.command.toString();
        if (request.args != null)
            requestString += '(' + request.args.toString().replace(/"/g, '') + ')';
    
        // Make Request
        this.getPrologRequest(requestString, request.onSuccess, request.onError);
    }
    

    getPrologRequest(requestString, onSuccess, onError, port, tries) {
        var request = new XMLHttpRequest();
        if (!tries) {
            tries = 0;
        }
        request.open('GET', 'http://localhost:' + this.port + '/' + requestString, true);
    
        request.onload = function(data) {
            tries = 0;
            let reply;
            try {
                reply = JSON.parse(data.target.response);
            } catch (e) {
                return console.log("JSON Parse ERROR");
            }
            if (onSuccess && data.target.status == 200)
                onSuccess(reply);
            else
                console.log("Reply Message: ", reply.msg, "; Return Value: ", reply.return);
        };
        request.onerror = onError || function() {
            console.log("Error waiting for response");
            if (tries < 2) {
                tries++;
                getPrologRequest(requestString, onSuccess, onError, port, tries);
            }
        };
    
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
    

    closeServer() {
        this.getPrologRequest('quit');
    }

    testConnection() {
        this.getPrologRequest('testConnection');
    }

    

}