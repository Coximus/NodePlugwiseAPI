var sinon = require('sinon');
var assert = require('assert');
var RestAPI = require('../../../src/RestAPI');
var Plugwise = require('NodePlugwise');
var express = require('express');

describe('RestAPI', function() {

    var app = express();

    afterEach(function() {
        if(RestAPI.app && RestAPI.app.listen && RestAPI.app.listen.restore) {
             RestAPI.app.listen.restore();
        }
        if(RestAPI.app && RestAPI.app.get && RestAPI.app.get.restore) {
             RestAPI.app.get.restore();
        }
        if(RestAPI.app && RestAPI.app.start && RestAPI.app.start.restore) {
             RestAPI.app.start.restore();
        }
        if(RestAPI.plugwise && RestAPI.plugwise.connect && RestAPI.plugwise.connect.restore) {
             RestAPI.plugwise.connect.restore();
        }
    });

    var stubListen = function(callbackError, callbackSuccess) {
        sinon.stub(app, 'listen').callsArgWith(1, callbackError, callbackSuccess);
        RestAPI.app = app;
    }

    var spyOnGet = function() {
        sinon.stub(app, 'get');
        RestAPI.app = app;
    }

    var spyOnPlugwise = function() {
        sinon.spy(Plugwise, 'connect');
    }

    var stubPlugwise = function(callbackError, callbackSuccess) {
        sinon.stub(Plugwise, 'connect').callsArgWith(1, callbackError, callbackSuccess);
    }

    describe('start', function() {
        describe('express', function() {
            it('should call express.listen with the correct port', function() {
                stubListen('error');
                var callback = function(){};

                RestAPI.start({expressPort: 20}, callback);
                
                assert.equal(1, RestAPI.app.listen.callCount);
                assert.equal(20, RestAPI.app.listen.firstCall.args[0]);
            });

            it('should call the callback with an error if listen fails', function(done) {
                stubListen('some error');

                RestAPI.start({expressPort: 21}, function(err, success) {
                    assert.equal('some error', err);
                    done();
                });
            });

            it('should default to listen on port 3000', function() {
                stubListen('error');
                stubPlugwise(null, {});

                RestAPI.start({}, function(){});
                
                assert.equal(3000, RestAPI.app.listen.firstCall.args[0]);
            });
        });
        describe('Plugwise', function() {
            it('should call Plugwise.connect', function() {
                stubListen();
                stubPlugwise(null, {});

                RestAPI.start({expressPort: 3000});

                assert.equal(1, RestAPI.plugwise.connect.callCount);
            });

            it('should call Plugwise.connect with the path to the serial port', function() {
                stubListen();
                stubPlugwise(null, {});

                RestAPI.start({serialPath: 'some-serial'});

                assert.equal('some-serial', RestAPI.plugwise.connect.firstCall.args[0]);
            });

            it('should call the callback with an error if plugwise.connect returns an error', function(done) {
                stubListen();
                stubPlugwise('some error');

                RestAPI.start({serialPath: 'some-serial'}, function(err, result) {
                    assert.equal('some error', err);
                    done();
                });
            });

            it('should not call the callback with an error if plugwise.connect does not return an error', function(done) {
                stubListen();
                stubPlugwise(null, {});

                RestAPI.start({serialPath: 'some-serial'}, function(err, result) {
                    assert.deepEqual(null, err);
                    done();
                });
            });
        });

        describe('Routes', function() {
            it('should not set any routes no routes are specified', function() {
                stubListen();
                spyOnGet()
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
                stubListen();
                spyOnGet();
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