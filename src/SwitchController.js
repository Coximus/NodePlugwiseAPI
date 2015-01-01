var addressIsValid = function(address) {
    return typeof address === 'string' && address.match(/^[0-9A-F]{16}$/);
}

var stateIsValid = function(state) {
    return typeof state === 'string' && (state === '0' || state === '1');
}

var handler = function(request, response) {
    if (!request.params || !request.params.address || !addressIsValid(request.params.address)) {
        response.status(500);
        return response.json({error: 'Invalid plug address'});
    }

    if (!request.params || !request.params.state || !stateIsValid(request.params.state)) {
        response.status(500);
        return response.json({error: 'Invalid state requested'});
    }

    this.Plugwise = this.Plugwise ? this.Plugwise : require('NodePlugwise');
    this.Plugwise.switchPlug(request.params.address, parseInt(request.params.state), function(error, plugwiseResponse) {
        if (error) {
            response.status(500);
            return response.json({error: error});
        }
        response.status(200);
        return response.json(plugwiseResponse);
    });
}

module.exports = {
    handler: handler
}