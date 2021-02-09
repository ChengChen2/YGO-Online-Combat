

//引入ws模块，初始化websocket服务端
var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
wss = new WebSocketServer({port: 9999});

//客户端数组，储存客户端基本信息
var players = [];
var playerIndex = -1;

//每一个客户端和服务端建立连接时触发
wss.on('connection', function (ws) {
	players.push({"pid": "null", "ws": ws});  //记录连接上的玩家信息，客户端发送的pid不可相同（待优化）
	playerIndex += 1;

    //收到客户端发送的消息时触发
    ws.on('message', function (message) {
        var msg = JSON.parse(message.data);
        var type = msg.type;

        switch(type) {
            case "connection": //如果有玩家首次建立连接
                var pid = msg.pid;
                players[playerIndex].pid = pid;
                break;
        }
    });
	
	//SIGINT这个信号是系统默认信号，代表信号中断，就是ctrl+c
    process.on('SIGINT', function () {
        console.log("Closing things");
        process.exit();
    });

	
});
