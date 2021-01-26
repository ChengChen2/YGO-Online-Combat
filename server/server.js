//Chat Server

//引入websocket ws模块
var WebSocketServer = require('ws').Server,

//初始化websocket
wss = new WebSocketServer({ port: 9999 });

wss.on('connection', function (ws) {
	
    console.log('client connected');
	
    ws.on('message', function (message) {
        console.log(message);
		if(message == 'client1_msg') {
			ws.send("收到client1");
		} else {
			ws.send("收到client2");
		}
		
    });
	
	//SIGINT这个信号是系统默认信号，代表信号中断，就是ctrl+c
    process.on('SIGINT', function () {
        console.log("Closing things");
        process.exit();
    });

	
});