var sinon = require('sinon');
var assert = require('assert');
var RestAPI = require('../../../src/RestAPI');
var Plugwise = require('NodePlugwise');

describe('RestAPI', function() {
    afterEach(function() {
        if(RestAPI.app && RestAPI.app.start && RestAPI.app.start.restore) {
             RestAPI.app.listen.restore();
        }
        if(RestAPI.plugwise && RestAPI.plugwise.connect && RestAPI.plugwise.connect.restore) {
             RestAPI.plugwise.connect.restore();
        }
    });

    var spyOnListen = function() {
        RestAPI.app = { listen: sinon.spy() };
    }

    var spyOnPlugwise = function() {
        sinon.spy(Plugwise, 'connect');
    }

    describe('start', function() {
        describe('express', function() {
            it('should call express.listen with the correct port and callback', function() {
                spyOnListen();
                var callback = function(){};

                RestAPI.start({expressPort: 20}, callback);
                
                assert.equal(1, RestAPI.app.listen.callCount);
                assert.equal(20, RestAPI.app.listen.firstCall.args[0]);
                assert.equal(callback, RestAPI.app.listen.firstCall.args[1]);
            });

            it('should call express.listen with the correct port and no callback when a callback is not passed', function() {
                spyOnListen();
                var callback = function(){};

                RestAPI.start({expressPort: 21});
                
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
        describe('Plugwise', function() {
            it('should call Plugwise.connect', function() {
                spyOnListen();
                spyOnPlugwise();

                RestAPI.start();

                assert.equal(1, RestAPI.plugwise.connect.callCount);
            });

            it('should call Plugwise.connect with the path to the serial port', function() {
                spyOnListen();
                spyOnPlugwise();

                RestAPI.start({serialPath: 'some-serial'});

                assert.equal('some-serial', RestAPI.plugwise.connect.firstCall.args[0]);
            });
        });
    });
});