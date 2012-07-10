var express         = require('express'),
    //socket_io       = require('socket.io'),
    IndexController = require('./lib/index_controller');

var app = express.createServer();
//io = socket_io.listen(app)

app.use(express.logger());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.get('/service/index', IndexController.index);
app.listen(7777);

//io.sockets.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});
