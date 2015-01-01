var app = require('./app');

var config = {
    expressPort: 3000,
    serialPath: '/dev/cu.usbserial-A700drEa',
    routes: [{
        path: '/switch/:address/:state',
        controller: './switchController'
    }]
};
app.restAPI.start(config, function(err, response) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});