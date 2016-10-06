var express = require('express'),
    Plugwise = require('NodePlugwise');

process.on('uncaughtException', function(err) {
    if (err.errno === 'EACCES') {
        console.error('Cannot listen on the given port');
        process.exit(1);
    }
    throw err;
});

var start = function(config, callback) {
    var port = config && config.expressPort ? config.expressPort : 3000;
    var serialPath = config && config.serialPath ? config.serialPath : null;
    this.app = this.app ? this.app : express();
    this.plugwise = this.plugwise ? this.plugwise : Plugwise;

    this.app.listen(port, callback);
    this.plugwise.connect(serialPath);
}

module.exports = {
    start: start
}