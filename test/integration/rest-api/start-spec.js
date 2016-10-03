var sinon = require('sinon');
var assert = require('assert');
var RestAPI = require('../../../src/RestAPI');

describe('RestAPI', function() {
    afterEach(function() {
        if(RestAPI.app && RestAPI.app.start && RestAPI.app.start.restore) {
             RestAPI.app.listen.restore();
        }
    });

    var spyOnListen = function() {
        RestAPI.app = { listen: sinon.spy() };
    }

    describe('start', function() {
        it('should call express.listen with the correct port and callback', function() {
            spyOnListen();
            var callback = function(){};

            RestAPI.start(20, callback);
            
            assert.equal(1, RestAPI.app.listen.callCount);
            assert.equal(20, RestAPI.app.listen.firstCall.args[0]);
            assert.equal(callback, RestAPI.app.listen.firstCall.args[1]);
        });

        it('should call express.listen with the correct port and no callback when a callback is not passed', function() {
            spyOnListen();
            var callback = function(){};

            RestAPI.start(21);
            
            assert.equal(1, RestAPI.app.listen.callCount);
            assert.equal(21, RestAPI.app.listen.firstCall.args[0]);
            assert.deepEqual(undefined, RestAPI.app.listen.firstCall.args[1]);
        });

        it('should default to listen on port 3000', function() {
            spyOnListen();

            RestAPI.start();
            
            assert.equal(3000, RestAPI.app.listen.firstCall.args[0]);
        });
    });
});