var sinon = require('sinon');
var assert = require('assert');
var RestAPI = require('../../../src/RestAPI');
var mockServiceInstance = require('../fixtures/rest-api/mockService');

describe('RestAPI', function() {
    afterEach(function() {
        if (mockServiceInstance.setup && mockServiceInstance.setup.restore) {
            mockServiceInstance.setup.restore();
        }
    });

    describe('setupServices', function() {
        it('should call the service setup function', function() {
            var services = [{name: 'mockService', module: '../test/integration/fixtures/rest-api/mockService'}];

            sinon.spy(mockServiceInstance, 'setup');
            RestAPI.setupServices(services);
            
            assert.equal(1, mockServiceInstance.setup.callCount);
        });

        it('should call the service setup function passing the setup parameter object', function() {
            var services = [{
                name: 'mockService', 
                module: '../test/integration/fixtures/rest-api/mockService', 
                setup: {someKey: 'someValue'}
            }];

            sinon.spy(mockServiceInstance, 'setup');
            RestAPI.setupServices(services);
            
            assert.equal('someValue', mockServiceInstance.setup.firstCall.args[0].someKey);
        });

        it('should call the service setup function passing the handler funtion as the second parameter', function() {
            var services = [{
                name: 'mockService', 
                module: '../test/integration/fixtures/rest-api/mockService', 
                setup: {someKey: 'someValue'}
            }];

            sinon.spy(mockServiceInstance, 'setup');
            RestAPI.setupServices(services);
            
            assert.equal('function', typeof mockServiceInstance.setup.firstCall.args[1]);
        });

        it('should add services to the service list if its setup is successful', function() {
            var services = [{
                name: 'mockService', 
                module: '../test/integration/fixtures/rest-api/mockService', 
                setup: {someKey: 'someValue'}
            }];

            sinon.spy(mockServiceInstance, 'setup');
            RestAPI.setupServices(services);
        });
    });
});