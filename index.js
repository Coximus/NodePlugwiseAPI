var Plugwise = require('NodePlugwise'),
    plugwise;

var connectToPlugwise = function(serial, callback) {
    plugwise = Plugwise.getInstance();
    plugwise.connect(serial, function(error) {
        if(error) {
            return callback(error);
        }
        return callback(null, plugwise);
    });
}

module.exports = {
    connect: function(serial, callback) {
        connectToPlugwise(serial, function(error, plugwise) {
            if(callback) {
                callback(error, plugwise);
            }
        });
    } 
};