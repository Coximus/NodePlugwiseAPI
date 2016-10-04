var express = require('express');

process.on('uncaughtException', function(err) {
    if (err.errno === 'EACCES') {
        console.error('Cannot listen on the given port');
        process.exit(1);
    }
    throw err;
});

var services = [];

var start = function(port, callback) {
    port = port ? port : 3000;
    this.app = this.app ? this.app : express();

    this.app.listen(port, callback);
}

var getServices = function() {
    return services;
}

var handleServiceRegistration = function(error, service) {
    services.push(service);
}

var setupServices = function(services, callback) {
    services.forEach(function(service) {
        var instance = require(service.module);
        instance.setup(service.setup, handleServiceRegistration);
        // instance.connect('/dev/tty.usbserial-A700drEa', function(error, plugwise) { 
        //     if (error) {
        //         return console.error(error);
        //     }

        //     this.app.get('/switch-plugwise/:address/:state', function(request, response) {
        //         return routes.switchController.handler(request, response);
        //     });
        // }.bind(this));
    }.bind(this));
}

module.exports = {
    start: start,
    setupServices: setupServices,
    app: null,
    getServices: getServices
}