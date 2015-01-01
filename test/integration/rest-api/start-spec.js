var sinon = require('sinon');
var assert = require('assert');
var RestAPI = require('../../../src/RestAPI');
var Plugwise = require('NodePlugwise');

describe('RestAPI', function() {
    afterEach(function() {
        if(RestAPI.app && RestAPI.app.start && RestAPI.app.start.restore) {
             RestAPI.app.start.restore();
        }
        if(RestAPI.plugwise && RestAPI.plugwise.connect && RestAPI.plugwise.connect.restore) {
             RestAPI.plugwise.connect.restore();
        }
    });

    var spyOnExpress = function() {
        RestAPI.app = { listen: sinon.spy(), get: sinon.spy() };
    }

    var spyOnPlugwise = function() {
        sinon.spy(Plugwise, 'connect');
    }

    var stubPlugwise = function(callbackError, callbackSuccess) {
        sinon.stub(Plugwise, 'connect').callsArgWith(1, callbackError, callbackSuccess);
    }

    describe('start', function() {
        describe('express', function() {
            it('should call express.listen with the correct port and callback', function() {
                spyOnExpress();
                var callback = function(){};

                RestAPI.start({expressPort: 20}, callback);
                
                assert.equal(1, RestAPI.app.listen.callCount);
                assert.equal(20, RestAPI.app.listen.firstCall.args[0]);
                assert.equal(callback, RestAPI.app.listen.firstCall.args[1]);
            });

            it('should call express.listen with the correct port and no callback when a callback is not passed', function() {
                var callback = function(){};
                spyOnExpress();
                stubPlugwise(null, {});

                RestAPI.start({expressPort: 21});
                
                assert.equal(1, RestAPI.app.listen.callCount);
                assert.equal(21, RestAPI.app.listen.firstCall.args[0]);
                assert.deepEqual(undefined, RestAPI.app.listen.firstCall.args[1]);
            });

            it('should default to listen on port 3000', function() {
                spyOnExpress();
                stubPlugwise(null, {});

                RestAPI.start({});
                
                assert.equal(3000, RestAPI.app.listen.firstCall.args[0]);
            });
        });
        describe('Plugwise', function() {
            it('should call Plugwise.connect', function() {
                spyOnExpress();
                stubPlugwise(null, {});

                RestAPI.start({});

                assert.equal(1, RestAPI.plugwise.connect.callCount);
            });

            it('should call Plugwise.connect with the path to the serial port', function() {
                spyOnExpress();
                stubPlugwise(null, {});

                RestAPI.start({serialPath: 'some-serial'});

                assert.equal('some-serial', RestAPI.plugwise.connect.firstCall.args[0]);
            });

            it('should call the callback with an error if plugwise.connect returns an error', function(done) {
                spyOnExpress();
                stubPlugwise('some error');

                RestAPI.start({serialPath: 'some-serial'}, function(err, result) {
                    assert.equal('some error', err);
                    done();
                });
            });

            it('should not call the callback with an error if plugwise.connect does not return an error', function(done) {
                spyOnExpress();
                stubPlugwise(null, {});

                RestAPI.start({serialPath: 'some-serial'}, function(err, result) {
                    assert.deepEqual(null, err);
                    done();
                });
            });
        });

        describe('Routes', function() {
            it('should not set any routes no routes are specified', function() {
                spyOnExpress();
                stubPlugwise(null, {});

                RestAPI.start({serialPath: 'some-serial'});
                assert.equal(0, RestAPI.app.get.callCount);
            });

            it('should pass the routes to express', function() {
                var routes = [{
                        path: '/route1',
                        controller: '../test/integration/fixtures/rest-api/mockController1'
                    }, {
                        path: '/route2',
                        controller: '../test/integration/fixtures/rest-api/mockController2'
                    }],
                    controllers = [require('../fixtures/rest-api/mockController1'),require('../fixtures/rest-api/mockController2')];
                spyOnExpress();
                stubPlugwise(null, {});

                RestAPI.start({serialPath: 'some-serial', routes: routes});
                assert.equal(2, RestAPI.app.get.callCount);
                assert.equal(routes[0].path, RestAPI.app.get.firstCall.args[0]);
                assert.deepEqual(controllers[0].handler, RestAPI.app.get.firstCall.args[1]);
                assert.equal(routes[1].path, RestAPI.app.get.secondCall.args[0]);
                assert.deepEqual(controllers[1].handler, RestAPI.app.get.secondCall.args[1]);
            });
        });
    });
});