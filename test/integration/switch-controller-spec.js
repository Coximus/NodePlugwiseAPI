var assert = require('assert');
var SwitchController = require('../../src/SwitchController');
var sinon = require('sinon');
var Plugwise = require('NodePlugwise');

describe('Switch Controller', function() {

    var plugAddress = '0123456789ABCDEF',
        getRequest = function(address, state) {
            return {
                params: {
                    address: address ? address : plugAddress,
                    state: state ? state : '1'
                }
            }
        },
        request = getRequest(),
        response = { json: function(){}, status: function(){} };

    afterEach(function() {
        if (Plugwise.switchPlug && Plugwise.switchPlug.restore) {
            Plugwise.switchPlug.restore();
        }
        if (response.json && response.json.restore) {
            response.json.restore();
        }
        if (response.status && response.status.restore) {
            response.status.restore();
        }
    });

    it('should call response with an status code of 500 if the address is invalid', function() {
        var plugAddress = 'invalid-address',
            request = getRequest(plugAddress);
            statusCodeSpy = sinon.spy(response, 'status');

        SwitchController.handler(request, response);
        
        assert.equal(1, statusCodeSpy.callCount);
        assert.equal(500, statusCodeSpy.firstCall.args[0]);
    });

    it('should call response with a json error if the address is invalid', function() {
        var plugAddress = 'invalid-address',
            request = getRequest(plugAddress);
            jsonSpy = sinon.spy(response, 'json');

        SwitchController.handler(request, response);
        
        assert.equal(1, statusCodeSpy.callCount);
        assert.equal('Invalid plug address', jsonSpy.firstCall.args[0].error);
    });

    it('should call response with an status code of 500 if the state is invalid', function() {
        var state = 'invalid-state',
            request = getRequest(plugAddress, state);
            statusCodeSpy = sinon.spy(response, 'status');

        SwitchController.handler(request, response);
        
        assert.equal(1, statusCodeSpy.callCount);
        assert.equal(500, statusCodeSpy.firstCall.args[0]);
    });

    it('should call response with a json error if the address is invalid', function() {
        var state = 'invalid-state',
            request = getRequest(plugAddress, state);
            jsonSpy = sinon.spy(response, 'json');

        SwitchController.handler(request, response);
        
        assert.equal(1, statusCodeSpy.callCount);
        assert.equal('Invalid state requested', jsonSpy.firstCall.args[0].error);
    });

    it('should call switchPlug', function() {
        var switchPlugStub = sinon.stub(Plugwise, 'switchPlug').callsArgWith(2, 'my error', 'my response');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal(1, switchPlugStub.callCount);
    });

    it('should call switchPlug with the plug address from the request', function() {
        var switchPlugStub = sinon.stub(Plugwise, 'switchPlug').callsArgWith(2, 'my error', 'my response');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal(plugAddress, switchPlugStub.firstCall.args[0]);
    });

    it('should call switchPlug with the plug state from the request', function() {
        var switchPlugStub = sinon.stub(Plugwise, 'switchPlug').callsArgWith(2, 'my error', 'my response');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal(1, switchPlugStub.firstCall.args[1]);
    });

    it('should call status with a value of 500 if swithcPlug returns an error', function() {
        var switchPlugStub = sinon.stub(Plugwise, 'switchPlug').callsArgWith(2, 'some error');
            statusSpy = sinon.spy(response, 'status');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal(1, statusSpy.callCount);
        assert.equal(500, statusSpy.firstCall.args[0]);
    });

    it('should call response.json with an error if swithcPlug returns an error', function() {
        var switchPlugStub = sinon.stub(Plugwise, 'switchPlug').callsArgWith(2, 'some error');
            jsonSpy = sinon.spy(response, 'json');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal('some error', jsonSpy.firstCall.args[0].error);
    });

    it('should call status with a value of 200 if swithcPlug does not return an error', function() {
        var switchPlugStub = sinon.stub(Plugwise, 'switchPlug').callsArgWith(2, null, 'success');
            statusSpy = sinon.spy(response, 'status');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal(1, statusSpy.callCount);
        assert.equal(200, statusSpy.firstCall.args[0]);
    });

    it('should call response.json with the plugwise response if there is no error', function() {
        var switchPlugStub = sinon.stub(Plugwise, 'switchPlug').callsArgWith(2, null, 'success');
            jsonSpy = sinon.spy(response, 'json');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal('success', jsonSpy.firstCall.args[0]);
    });
});