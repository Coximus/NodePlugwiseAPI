var assert = require('assert'),
    app = require('../../index.js'),
    sinon = require('sinon'),
    Plugwise = require('NodePlugwise');

describe('Integration - Plugwise - Connect', function() {

    var plugwiseInstance; 

    beforeEach(function() {
        plugwiseInstance = Plugwise.getInstance();
    });

    afterEach(function() {
        var instance = Plugwise.getInstance();
        if(instance.connect.restore) {
            instance.connect.restore();
        }
    });

    stubConnect = function(callbackValue) {
        return sinon.stub(plugwiseInstance, 'connect', function(serial, callback) {
            callback(callbackValue);
        });
    }

    it('should call connect with the correct serial port', function() {
        var serial = 'some-serial',
            connectStub = stubConnect();

        app.connect(serial);
        assert.equal(1, connectStub.callCount);
        assert.equal(serial, connectStub.firstCall.args[0]);
    });

    it('should call the callback with an error if Plugwise.connect returned an error', function(done) {
        var serial = 'some-serial',
            connectStub = stubConnect('some error');

        app.connect(serial, function(error) {
            assert(error);
            done();
        });
    });

    it('should call the callback with an instance of Plugwise if connected successfully', function(done) {
        var serial = 'some-serial',
            connectStub = stubConnect();

        app.connect(serial, function(error, plugwise) {
            assert.deepEqual(plugwise, plugwiseInstance);
            done();
        });
    });
});