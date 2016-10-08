var app = require('./app');

var config = {
    expressPort: 3000,
    serialPath: process.argv[2],
    routes: [{
        path: '/switch/:address/:state',
        controller: './SwitchController'
    }]
};
app.restAPI.start(config, function(err, response) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Listening on port : ' + config.expressPort);
});