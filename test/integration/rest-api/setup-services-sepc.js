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

    describe('setupServices', function() {
        it('should call the service load function', function() {
            var mockServiceInstance = require('../fixtures/rest-api/mockService'),
                services = [{name: 'mockService', module: '../test/integration/fixtures/rest-api/mockService'}];

            RestAPI.setupServices(services);
            
            assert.equal(1, mockServiceInstance.setup.callCount);
        });
    });
});