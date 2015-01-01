var express = require('express'),
    Plugwise = require('NodePlugwise');

process.on('uncaughtException', function(err) {
    if (err.errno === 'EACCES') {
        console.error('Cannot listen on the given port');
        process.exit(1);
    }
    throw err;
});

var setupRoutes = function(routes, app) {
    if (!routes) {
        return;
    }
    routes.forEach(function(route) {
        var controller = require(route.controller);
        app.get(route.path, controller.handler);
    });
    console.log('Routes Setup');
}

var start = function(config, callback) {
    var port = config && config.expressPort ? config.expressPort : 3000;
    var serialPath = config && config.serialPath ? config.serialPath : null;
    this.app = this.app ? this.app : express();
    this.plugwise = this.plugwise ? this.plugwise : Plugwise;

    this.app.listen(port, function(err, response) {
        console.log('Listening on port : ' + port);
    });
    this.plugwise.connect(serialPath, function(err, plugwise) {
        if(err) {
            return callback ? callback(err) : null;
        }
        console.log('Plugwise now connected');
        setupRoutes(config.routes, this.app);
        callback ? callback(null, plugwise) : null;
    }.bind(this));
}


module.exports = {
    start: start
}