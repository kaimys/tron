var express         = require('express'),
    socket_io       = require('socket.io'),
    IndexController = require('./lib/index_controller');

var app = express.createServer();
app.use(express.logger());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.get('/service/index', IndexController.index);
var server = app.listen(7777);

io = socket_io.listen(server)
io.sockets.on('connection', function (socket) {
    console.log("incomming connection");
    socket.on('motion', function (data) {
        console.log(data);
        socket.broadcast.emit('motion', data);
    });
    socket.on('orientation', function (data) {
        console.log(data);
        socket.broadcast.emit('orientation', data);
    });
});
