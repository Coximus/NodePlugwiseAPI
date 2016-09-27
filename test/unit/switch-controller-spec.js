var assert = require('assert'),
    SwitchController = require('../../src/SwitchController'),
    sinon = require('sinon'),
    Plugwise = require('NodePlugwise');

describe('Switch Controller', function() {

    var response = { json: function(){}, status: function() {} };

    afterEach(function() {
        if (Plugwise.switchPlug && Plugwise.switchPlug.restore) {
            Plugwise.switchPlug.restore();
        }
    });

    it('should not call switchPlug if the request does not contain a plug address', function() {
        var request = {params: {}},
            switchPlugStub = sinon.stub(Plugwise, 'switchPlug');

        SwitchController.Plugwise = Plugwise;
        SwitchController.handler(request, response);
        
        assert.equal(0, switchPlugStub.callCount);
    });

    it('should not call switchPlug if the plug address not valid', function() {
        var invalidVairants = ['invalid-address', 1234567890123456, '123456', '', 'ABCDEFGHIJKLMNOP', '0123456789abcdef'],
            switchPlugStub = sinon.stub(Plugwise, 'switchPlug');

        SwitchController.Plugwise = Plugwise;
        invalidVairants.forEach(function(address) {
            var request = {params: {
                    address: address
                }};
            
            SwitchController.handler(request, response);
            
            assert.equal(0, switchPlugStub.callCount);
        });
    });

    it('should not call switchPlug if the request does not contain a plug state', function() {
        var request = {params: {
                address: '0123456789ABCDEF'
            }},
            switchPlugStub = sinon.stub(Plugwise, 'switchPlug');

        SwitchController.Plugwise = Plugwise;
        
        SwitchController.handler(request, response);
        
        assert.equal(0, switchPlugStub.callCount);
    });

    it('should not call switchPlug if the plug state is not 0 or 1', function() {
        var invalidVairants = ['', true, false, 0, 1, 'something', 0.0, 0.1],
            switchPlugStub = sinon.stub(Plugwise, 'switchPlug');

        SwitchController.Plugwise = Plugwise;
        invalidVairants.forEach(function(state) {
            var request = {params: {
                    address: '0123456789ABCDEF',
                    state: state
                }};
            
            SwitchController.handler(request, response);
            
            assert.equal(0, switchPlugStub.callCount);
        });
    });
});