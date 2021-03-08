
/**
 * [游戏主要控制]
 * 
 * 全局变量
 * 游戏客户端设置;
 * 游戏初始化;
 * 客户端与服务端的通讯;
 * 卡片信息显示;
 * 副控制面板;
 *  
 */



/*--------------------------全局变量-------------------------- */

var P1DeckName = "Deck_KaiMa";  //我方牌组名
var P1DeckNum = 50;  //我方牌组卡片数量
var CardBackSrc = "image/cards/cardback.jpg";  //卡片背面图片的src

var P1Deck = [];  //我方牌组（储存我方所有卡片src）
var P1Tomb = [];  //我方墓地（卡片src）
var P2Tomb = [];  //对方墓地

var SelectedCard = {  //被选中的卡对象
    type: "null",  //卡的来源类型（手牌，场上）
    cardNo: -1,  //卡片的序号
    cardSrc: "null",
    player: "null"  //玩家号
};

var sf_Card = {
    type: "null",  //卡的来源类型（我方卡组，我方墓地，对方墓地）
    player: "null",  //记录副面板显示卡片的玩家类型
    size: 0  //记录副面板显示卡片的数量
};

// 储存场上卡片信息（10张卡的图片src，状态）
var fieldArrayPly1 = { 
    FieldCards: [
        { "imgsrc": "null", "state": "null"}, 
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
        { "imgsrc": "null", "state": "null"},
    ] 
};

/*---------------------游戏对战连接部分----------------------- */

//建立连接
var playerID = "player1";  //独立玩家ID
var ws = new WebSocket("ws://192.168.31.170:9999");
//var ws = new WebSocket("ws://192.168.14.1:9999");

function wsSend(content) {  //由于传输的message类型多样，由各函数自行编码后传递
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(content);
        console.log("message sent");
    }
}

//初次与服务端建立连接时触发
ws.onopen = function() {
    /*初次与服务端建立连接时告知玩家的pid让服务器存下来 */
    var message = JSON.stringify({
        "type": "connection",  //向服务器告知的消息类型
        "pid": playerID,  //向服务器告知的本玩家ID
    });
    wsSend(message);  
}

//接收服务器消息后触发
ws.onmessage = function(message) {
    var msg = JSON.parse(message.data);
    var msgtype = msg.msgtype;

    switch(msgtype) {
        case 'updateHand':
            var handNo = msg.handNo;
            var updateType = msg.updateType;
            updateP2Hand(handNo, updateType);
            break;
        case 'updateField':
            var fieldID = msg.fieldID;
            var state = msg.state;
            var cardsrc = msg.cardsrc;
            updateField(fieldID, state, cardsrc);
            break;
        case 'updateTomb':
            var updateType = msg.updateType;
            var ply = msg.ply;
            var cardNo = msg.cardNo;
            var cardsrc = msg.cardsrc;
            updateTomb(updateType, ply, cardNo, cardsrc);
            break;
        default:
            alert("error message!");
            break;
    }
}

/**
 * 编码令对方更新手卡的message并发送
 * @param {string} updateType - updating type
 * @param {*} handNo - hand slot number
 */
function messageHand(updateType, handNo) {
    var message_hand = JSON.stringify({
        "type": "message",  //向服务器告知的消息类型
        "pid": playerID,  //向服务器告知的本玩家ID
        "msgtype": "updateHand",  //向对方玩家告知的更新类型
        "updateType": updateType,  //向对方玩家告知增/减手卡
        "handNo": handNo  //向对方玩家告知被更新的卡槽
    });
    wsSend(message_hand);
}

/**
 * 编码令对方更新（我方/对方）战场的message并发送
 * @param {string} state - card state
 * @param {string} fieldID - updated card slot ID
 * @param {string} cardsrc - card img src
 */
function messageField(state, fieldID, cardsrc) {
    var message_field = JSON.stringify({
        "type": "message",  //向服务器告知的消息类型
        "pid": playerID,  //向服务器告知的本玩家ID
        "msgtype": "updateField",  //向对方玩家告知的更新类型
        "state": state,  //卡片放置状态
        "fieldID": fieldID,  //需更新的卡槽ID
        "cardsrc": cardsrc  //放置的卡片src
    });
    wsSend(message_field);
}

/**
 * 编码令对方更新（我方/对方）墓地message并发送
 * @param {string} updateType - updating type (add/reduce) 
 * @param {string} ply - who's tomb should be updated (send p1 means your component, send p2 means yourself)
 * @param {*} cardNo - card number in tomb
 * @param {string} cardsrc - card img src
 */
function messageTomb(updateType, ply, cardNo, cardsrc) {
    var message_tomb = JSON.stringify({
        "type": "message",  //向服务器告知的消息类型
        "pid": playerID,  //向服务器告知的本玩家ID
        "msgtype": "updateTomb",  //向对方玩家告知的更新类型
        "updateType": updateType,  //向对方玩家告知增/减墓地卡片
        "ply": ply,  //定义谁的墓地需被更新, player1表示你的对手，player2表示你自己
        "cardNo": cardNo,  //卡片序号，剔出墓地卡片时需要用到
        "cardsrc": cardsrc  //卡片的src，新增墓地卡片时需要用到
    });
    wsSend(message_tomb);
}


/*---------------------游戏初始化------------------------*/

//储存P1卡组所有卡片路径
for (var i=0; i<P1DeckNum; i++) {
    var cardsrc = "image/cards/" + P1DeckName + "/" + i + ".jpg"
    P1Deck.push(cardsrc);
}

//获取空的img src路径，方便其他函数判断卡槽是否为空
//window.onload 使函数在html完全加载后执行
var emptysrc;
window.onload = function() {
  var handID = 'p1-field0';
  element = document.getElementById(handID);
  emptysrc = element.src;
  P1Deck = shuffle(cloneArr(P1Deck));  //洗牌
}


//----------------------------------------------------------------
/**
 * 显示卡片信息
 * show card info
 * @param {string} type - card source type (hand/field)
 * @param {string} cardsrc - card url
 * @param {int} cardNo - card No 
 * @param {string} ply - player tag 
 */
function showCardInfo(type, cardsrc, cardNo, ply) {
    if (cardsrc != emptysrc) {
        element = document.getElementById('card-info');
        var CardSrc = "image" + cardsrc.split('image')[1];  //把带盘符的绝对路径改为相对路径

        switch(ply) {
            /*我方卡片一律显示 */
            case 'player1':
                if (type == 'hand') {  //手卡均显示
                    element.src = CardSrc;
                } else {  //场上卡片按数组记录的img的src显示（若直接取img容器的src则无法看到我方盖卡）
                    element.src = fieldArrayPly1.FieldCards[cardNo].imgsrc;
                }
                break;
            /*对方卡片视情况显示 */
            case 'player2':
                if (type == 'hand') {  //手卡均不显示
                    element.src = CardBackSrc;
                } else {  //场上卡片直接按容器的img值显示
                    element.src = CardSrc;
                }
                break;
            default: break;
        }
    }
}


/*---------------------副控制面板------------------------*/
/**
 * 副控制面板
 * 从卡组中选择及从墓地中选择这块函数独立处理
 * 目前这块区域命名为selection-field（暂时没有更好的名字）
 */

/**
 * 选择副面板显示的内容（我方卡组/我方墓地/对方卡组）
 * @param {string} type - button type (P1 deck/P1 tomb/ P2 deck)
 */
function sf_buttons(type) {
    var selectArea = document.getElementById("select-area");
    selectArea.innerHTML = "";  //清空副面板显示框

    var cardset = [];

    switch (type) {
        case "deck":
            cardset = P1Deck;
            sf_Card.player = "player1";
            sf_Card.type = "deck";
            break;
        case "p1tomb":
            cardset = P1Tomb;
            sf_Card.player = "player1";
            sf_Card.type = "p1tomb";
            break;
        case "p2tomb":
            cardset = P2Tomb;
            sf_Card.player = "player2";
            sf_Card.type = "p2tomb";
            break;
        default: break;
    }

    /*副面板显示需显示的内容（我方卡组/墓地/对方墓地的全部卡片） */
    sf_Card.size = cardset.length;
    for (i=0; i<sf_Card.size; i++) {
        var cardImg = document.createElement("img");  //创建一个img容器
        cardImg.id = "sf-card" + i.toString();  //设置容器id
        cardImg.setAttribute("class", "card");  //设置style与相关函数
        cardImg.setAttribute("onmouseover", "sf_showInfo(this.src)");
        cardImg.setAttribute("onclick", "sf_selectCard(this.id, this.src)");
        cardImg.src = cardset[i];  //赋予对应image
        selectArea.appendChild(cardImg);  //添加该img容器到父容器
    }
}

/**
 * 显示副面板中被鼠标指到的卡片
 * @param {string} cardsrc - card img source 
 */
function sf_showInfo(cardsrc) {
    if (cardsrc != emptysrc) {
        element = document.getElementById('card-info');
        element.src = cardsrc;
    }
}

/**
 * 在副面板中选中卡片
 * @param {int} id - selection field img container id 
 * @param {string} cardsrc - selected card img source
 */
function sf_selectCard(id, cardsrc) {
    if (cardsrc != emptysrc) {
        var CardSrc = "image" + cardsrc.split('image')[1];
        cleanSelected();  //选择卡片之前首先清空场上已选中的卡片样式再更新
        element = document.getElementById(id);
        element.setAttribute("class", "card-selected");

        SelectedCard.player = sf_Card.player;
        SelectedCard.type = sf_Card.type;  //我方卡组/我方墓地/对方墓地
        SelectedCard.cardNo = parseInt(id.replace("sf-card", ""));  //用replace去掉id中的英文字符来获取数字字符
        SelectedCard.cardSrc = CardSrc;  //直接从img容器获取src
    }
}