

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


//----------------------------------------------------------------
/**
 * 更新对方手牌区域
 * 对方手牌均为卡片背面图片
 * @param {string} handNo - updated hand slot number 
 * @param {string} updateType - updating type (add/reduce)
 */
function updateP2Hand(handNo, updateType) {
    var handID = 'p2-hand' + handNo;
    element = document.getElementById(handID);

    /*执行增或减手牌 */
    if(updateType == "add") {  
        element.src = CardBackSrc;
    } else {
        element.src = "";
    }
}

/**
 * 根据接收的message更新我方/对方墓地
 * @param {string} updateType - updating type (add/reduce) 
 * @param {string} ply - who's tomb should be updated (receive p1 means yourself, p2 means your component)
 * @param {*} cardNo - card number in tomb
 * @param {string} cardsrc - card img src
 */
function updateTomb(updateType, ply, cardNo, cardsrc) {
    /*向墓地增卡一定是对方将卡牌送入对方墓地（对方无法将卡牌放入我方墓地） */
    if (updateType == 'add') {  
        P2Tomb.push(cardsrc);
        sf_buttons('p2tomb');

    /*向墓地剔出卡片则分情况 */
    } else if (updateType == 'reduce') {  
        if (ply == 'player1') {  //对方拿走我方墓地卡片
            P1Tomb.splice(cardNo, 1);
            sf_buttons('p1tomb');  //刷新副面板显示
        } else {  //对方拿走对方墓地卡片，我方执行同步
            P2Tomb.splice(cardNo, 1);
            sf_buttons('p2tomb');
        }
    }
}


/*---------------------游戏控制逻辑部分------------------------*/

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
/*抽取牌组最上方一张卡至手卡 */
function drawCard() {
    for (var i=0; i<8; i++) {
        var handID = 'p1-hand' + i.toString();
        element = document.getElementById(handID);
        if (element.src == emptysrc) {  //如果该卡槽为空
          element.src = P1Deck.pop();

          /*触发抽卡音效 */
          var snd = new Audio("sound/draw.wav");
          snd.play();

          /**
           * 告知对手哪张手卡卡槽添加了一张卡
           */
          messageHand('add', i);
          break;
        }
    }
}

/*生成随机数 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/*克隆数组 */
function cloneArr(arr) {
    // 从第一个字符就开始 copy
    // slice(start,end) 方法可从已有的数组中返回选定的元素。
    return arr.slice(0);
}

/*数组洗牌 */
function shuffle(arr) {
    let newArr = [];
    newArr = arr;
    for (let i = 0; i < newArr.length; i++) {
        let j = getRandom(0, i);
        let temp = newArr[i];
        newArr[i] = newArr[j];
        newArr[j] = temp;
    }
    return newArr;
}

/**
 * 牌组洗牌
 */
function shuffleDeck() {
    P1Deck = shuffle(cloneArr(P1Deck));
    document.getElementById("select-area").innerHTML = "";  //清空副面板显示框
    /*触发洗牌音效 */
    var snd = new Audio("sound/shuffle.wav");
    snd.play();
    //alert("牌组已洗牌！");
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

/**
 * 选择卡片（游戏中始终只有一张卡牌处于选中状态）,并记录当前卡片信息
 * @param {string} id - container id
 * @param {string} type - card source type (hand/field)
 * @param {string} cardsrc - card url
 * @param {int} cardNo - card No
 * @param {string} ply - player tag
 */
function selectCard(id, type, cardsrc, cardNo, ply) {
    if (cardsrc != emptysrc) {
        cleanSelected();  //选择卡片之前首先清空场上已选中的卡片样式再更新

        SelectedCard.type = type;
        SelectedCard.cardNo = cardNo;
        SelectedCard.player = ply;
        
        //console.log("image" + cardsrc.split('image')[1]);
        var CardSrc = "image" + cardsrc.split('image')[1];  //把带盘符的绝对路径改为相对路径

        if (type == 'hand') {
            element = document.getElementById(id);
            element.setAttribute("class", "card-selected");
            SelectedCard.cardSrc = CardSrc;  //若从手牌选择直接从img容器获取src
        } else {
            element = document.getElementById(id);  
            element.setAttribute("class", "item-selected");
            if (ply == 'player1') {
                SelectedCard.cardSrc = fieldArrayPly1.FieldCards[cardNo].imgsrc;  //若从我方场上选择则由场上状态数组获取卡片src
            } else if (ply == 'player2') {
                SelectedCard.cardSrc = CardSrc;  //若从对方场上选择则直接从img容器获取src
            }
        }
    }
}

/**
 * 清除所有卡片被选中的状态
 * 注意这里手牌和场上用于显示被选中状态的容器不同
 * 手牌的是img容器而场上用的是item容器
 */
function cleanSelected() {
    for (var i=0; i<8; i++) {  //清除手牌选中
        var handIDPly1 = 'p1-hand' + i.toString();
        element = document.getElementById(handIDPly1);
        element.setAttribute("class", "card");
    }
    for (var i=0; i<10; i++) {  // 清楚场上选中
        var fieldIDPly1 = 'p1field' + i.toString();
        var fieldIDPly2 = 'p2field' + i.toString();
        element = document.getElementById(fieldIDPly1);
        element2 = document.getElementById(fieldIDPly2);
        element.setAttribute("class", "item");
        element2.setAttribute("class", "item");
    }
    for (var i=0; i<sf_Card.size; i++) {
        var sf_ID = 'sf-card' + i.toString();
        element = document.getElementById(sf_ID);
        element.setAttribute("class", "card");
    }


    /*重置被选中的卡片信息 */
    SelectedCard.type = "null";
    SelectedCard.cardNo = -1;
    SelectedCard.cardSrc = "null";
    SelectedCard.player = "null";
}


//----------------------------------------------------------------
/**
 * 我方从手牌向场上放置卡片，并发出放置指令 (攻击，防御，背盖防御，发动，盖卡)
 * @param {string} placetype - place type (attack/defence/back/on/off)
 * @param {string} cardtype - card type (monster/magic)
 */
function placeCard(placetype, cardtype) {

    var cardslot = findEmptySlot(cardtype) //寻找空的卡槽
    var cardsrc;

    if(cardslot == -1) {
        alert("卡槽已满");
    } else {
        if (SelectedCard.type == 'hand') {  //放置卡片必须来源于手牌
            /*获取被选中手卡信息 */
            var handslot = (SelectedCard.cardNo).toString();
            var handID = "p1-hand" + handslot;
            element = document.getElementById(handID);
            cardsrc = SelectedCard.cardSrc;
            element.src = "";  //手牌该卡消失

            /*更新战场信息 */
            fieldArrayPly1.FieldCards[cardslot].imgsrc = cardsrc;
            fieldArrayPly1.FieldCards[cardslot].state = placetype;

            /*发出指令，执行更新战场卡片的函数 */
            var fieldID = "p1-field" + cardslot.toString();
            updateField(fieldID, placetype, cardsrc);

            /**
             * 放置后告知对手执行战场更新函数;
             * 放置完成后记得告诉对手哪张手卡消失了;
             * 注意：我方战场变化对对方来说是P2;
             */
            var updateID = "p2-field" + cardslot.toString();
            messageField(placetype, updateID, cardsrc);
            messageHand('reduce', handslot);

            /*清空所有选中状态 */
            cleanSelected();
        }
    }
}

/**
 * 战场状态更新，单独更新某一个卡槽
 * @param {string} fieldID - field img container id 
 * @param {string} cardstate - state of card (attk/defen/back/on/off)
 * @param {string} cardsrc - card source url
 */
function updateField(fieldID, cardstate, cardsrc) { 
    var stateclass;
    element = document.getElementById(fieldID);

    /**
     * 如果是盖卡或背盖召唤直接显示卡片背面
     * 检查showCardInfo函数可知对于我方来说，即使卡片是背面图片仍可以显示卡片信息
     * 由于音效种类问题修改分类了多种情况
     */
    switch (cardstate) {
        case 'off':
        case 'back':
            element.src = CardBackSrc;
            stateclass = "card-" + cardstate;
            /*触发背盖或盖卡音效 */
            var snd = new Audio("sound/activate.wav");
            snd.play();
            break;
        case 'on':  //正常发动卡片
            element.src = cardsrc;
            stateclass = "card-" + cardstate;
            /*触发发动卡片音效 */
            var snd = new Audio("sound/activate.wav");
            snd.play();
            break;
        case 'change-off':  //通过更变形式覆盖卡片
            element.src = CardBackSrc;
            stateclass = "card-" + cardstate.replace("change-", "");
            break;
        case 'change-back':  //通过更变形式背盖召唤卡片
            element.src = CardBackSrc
            stateclass = "card-" + cardstate.replace("change-", "");
            break;
        case 'change-on':  //通过更变形式实现的打开盖卡
            /*触发打开盖卡音效 */
            element.src = cardsrc;
            stateclass = "card-" + cardstate.replace("change-", "");
            var snd = new Audio("sound/open.wav");
            snd.play();
            break;
        case 'null':
            stateclass = "card";
            element.src = cardsrc;
            break;
        default:
            element.src = cardsrc;
            if (cardstate.search("change-") == -1) {  //正常召唤
                stateclass = "card-" + cardstate;
                /*触发发召唤怪兽音效 */
                var snd = new Audio("sound/summon.wav");
                snd.play();
            } else {                                  //更变形式
                stateclass = "card-" + cardstate.replace("change-", "");
            }
            break;
    }

    element.setAttribute("class", stateclass);  //更新对应img容器的class
}

/**
 * 返回当前我方场上/手牌的空卡槽序号（怪兽卡槽与魔法陷阱卡槽也要区分开）
 * @param {string} slottype - type of wanted empty slot (monster/magic/hand) 
 */
function findEmptySlot(slottype) {
    var emptySlot = -1;

    if (slottype == 'monster') {  //放置怪兽卡搜索0-4卡槽
        for (var i=0; i<5; i++) {
            if (fieldArrayPly1.FieldCards[i].state == "null") {
                emptySlot = i;
                break;
            }
        }
    } else if (slottype == 'magic') {  //放置魔法陷阱卡搜索5-9卡槽
        for (var i=5; i<10; i++) {
            if (fieldArrayPly1.FieldCards[i].state == "null") {
                emptySlot = i;
                break;
            }
        }
    } else if (slottype == 'hand') {
        for (var i=0; i<8; i++) {
            var handID = 'p1-hand' + i.toString();
            element = document.getElementById(handID);
            if (element.src == emptysrc) {  //如果该卡槽为空
              emptySlot = i;
              break;
            }
        }
    }

    return emptySlot;
}


//----------------------------------------------------------------
/**
 * 更变卡片的表示形式
 * 更变顺序为：攻击 -> 防御 -> 背盖 -> 攻击， 盖覆卡 -> 表侧卡 -> 盖覆卡
 * @param {string} cardtype - card type (monster/magic)
 */
function changeState(cardtype) {
    if (SelectedCard.type == 'field' && SelectedCard.player == 'player1') {  //必须是我方场上的卡方可更变表示形式
        var fieldID = "p1-field" + (SelectedCard.cardNo).toString();
        var cardsrc = fieldArrayPly1.FieldCards[SelectedCard.cardNo].imgsrc;
        var cardstate = fieldArrayPly1.FieldCards[SelectedCard.cardNo].state;

        switch (cardtype) {
            case 'monster':
                if (cardstate == 'attk') {
                    cardstate = "defen";
                } else if (cardstate == 'defen') {
                    cardstate = "back";
                } else if (cardstate == 'back') {
                    cardstate = "attk";
                }
                break;
            case 'magic':
                if (cardstate == 'off') {
                    cardstate = "on";
                } else {
                    cardstate = "off";
                }
                break;
            default:
                break;
        }

        fieldArrayPly1.FieldCards[SelectedCard.cardNo].state = cardstate;  //更新场上卡片状态信息
        cardstate = "change-" + cardstate;  //为通过更变形式而导致的战场更新操作添加一个标签方便更新函数识别（因为更变形式不触发音效）
        updateField(fieldID, cardstate, cardsrc);  //更新指定卡槽

        /**
         * 告知对手某一卡槽的表示形式发生变化，执行战场更新函数
         */
        var updateID = "p2-field" + (SelectedCard.cardNo).toString();
        messageField(cardstate, updateID, cardsrc);
    }
}


//----------------------------------------------------------------
/**
 * 将场上选中的卡牌回到手卡槽
 */
function backtoHand() {
    var cardslot = findEmptySlot('hand');  //寻找我方空的手牌卡槽 
    var cardNo = SelectedCard.cardNo;  //被选中卡牌的序号

    if (cardslot == -1) {
        alert("手牌已满");
    } else {
        var handID = "p1-hand" + (cardslot).toString();
        element = document.getElementById(handID);

        /*## 若卡片来源于场上 */
        if (SelectedCard.type == 'field') {  
            var fieldID;
            
            /*我方 卡牌信息从用于存储被选中卡片信息的对象中获取 */
            if (SelectedCard.player == 'player1') {  
                fieldID = "p1-field" + cardNo.toString();
                element.src = SelectedCard.cardSrc;  //手牌获取被选中的卡片
                fieldArrayPly1.FieldCards[cardNo].imgsrc = "null";  //场上该卡的记录清空
                fieldArrayPly1.FieldCards[cardNo].state = "null";

                /**
                 * 通知对方更新战场信息
                 */
                var updateID = "p2-field" + cardNo.toString();
                messageField("null", updateID, "");
                
            /*对方 卡牌信息从用于存储被选中卡片信息的对象中获取（必须是正面表示的卡片） */
            } else if (SelectedCard.cardSrc != CardBackSrc) {
                fieldID = "p2-field" + cardNo.toString();
                element.src = SelectedCard.cardSrc

                /**
                 * 通知对方更新战场信息
                 */
                var updateID = "p1-field" + cardNo.toString();
                messageField("null", updateID, "");
            } 
            
            /*更新战场信息 */
            updateField(fieldID, "null", "");

            /**
              * 通知对方更新手卡数
              */
            messageHand("add", cardslot);

        /*## 若卡片来源于卡组或墓地 */
        } else if (SelectedCard.type != 'hand') {  
            /*我方牌组/墓地的卡片回到我方手牌 */
            if (SelectedCard.player == 'player1') {
                element.src = SelectedCard.cardSrc;  //手牌获取该卡片src

                /*更新 卡组/墓地 列表并刷新副面板显示 */
                if (sf_Card.type == 'deck') {
                    P1Deck.splice(cardNo, 1);  //剔出卡组中的被选中卡片
                    sf_buttons('deck');  //刷新副面板显示
                } else if (sf_Card.type == 'p1tomb') {
                    P1Tomb.splice(cardNo, 1);
                    sf_buttons('p1tomb');

                    /**
                     * 通知对方玩家更新我方墓地（对于对方来说，我方是player2）
                     */
                    messageTomb("reduce", "player2", cardNo, SelectedCard.cardSrc);
                }

                /**
                * 通知对方更新手卡数
                */
                messageHand("add", cardslot);

            /*对方墓地的卡片回到我方手牌 */
            } else if (SelectedCard.player == 'player2') {
                element.src = SelectedCard.cardSrc;  //手牌获取该卡片src
                P2Tomb.splice(cardNo, 1);  //剔出对方墓地中的对应卡片
                sf_buttons('p2tomb');

                /**
                 * 通知对方玩家我方手卡数及对方墓地 （对于对方来说，他自己是player1）
                 */
                messageHand("add", cardslot);
                messageTomb("reduce", "player1", cardNo, SelectedCard.cardSrc);
            }
        }

        /*清空所有选中状态 */
        cleanSelected();
    }
}

/**
 * 将我方被选中的卡片返回卡组
 * 默认回到卡组最上方
 */
function backtoDeck() {
    if (SelectedCard.player == 'player1') {  //只允许将我方的卡片送回牌组
        var cardNo = SelectedCard.cardNo;

        /*手牌卡片回到卡组 */
        if (SelectedCard.type == 'hand') {  
            var handID = "p1-hand" + cardNo.toString();
            element = document.getElementById(handID);
            element.src = ""; //手牌被选中卡片消失
            P1Deck.push(SelectedCard.cardSrc);  //卡片src存回卡组

            /**
             * 告知对手手卡变动
             */
            messageHand("reduce", cardNo);
            alert("卡片已回到卡组最上方！");

        /*场上卡片回到卡组 */
        } else if (SelectedCard.type == 'field') {  
            var fieldID = "p1-field" + cardNo.toString();
            P1Deck.push(SelectedCard.cardSrc);  //卡片src存回卡组
            fieldArrayPly1.FieldCards[cardNo].imgsrc = "null";  //场上该卡的记录清空
            fieldArrayPly1.FieldCards[cardNo].state = "null";

            /*更新战场 */
            updateField(fieldID, "null", "");

            /**
             * 通知对方玩家更新我方战场
             */
            var updateID = "p2-field" + cardNo.toString();
            messageField("null", updateID, "");
            alert("卡片已回到卡组最上方！");

        } else {
            alert("请先将卡片拿到手牌再放回卡组");  //防止直接从卡组或墓地中选卡放回卡组
        }

        /*清空所有选中状态 */
        cleanSelected();
    }
}


//----------------------------------------------------------------
/**
 * 将我方的卡片（场上/手牌）送去墓地
 */
function sendtoTomb() {
    var cardsrc = SelectedCard.cardSrc;
    var cardNo = SelectedCard.cardNo;
    var fieldID; 
    
    if (SelectedCard.player == 'player1') {
        /*若卡片来源于手牌 */
        if (SelectedCard.type == 'hand') {
            var handID = "p1-hand" + cardNo.toString();
            element = document.getElementById(handID);
            element.src = "";  //手牌该卡消失
            P1Tomb.push(cardsrc);  //将选中卡片的src存入墓地数组

            /**
             * 告知对方更新我方手牌数及墓地
             */
            messageHand("reduce", cardNo);
            messageTomb("add", "player2", "null", cardsrc);  //向墓地添加卡片不需要cardNo

        /*若卡片来源于场上 */
        } else if (SelectedCard.type == 'field') {
            fieldID = "p1-field" + cardNo.toString();
            fieldArrayPly1.FieldCards[cardNo].imgsrc = "null";  //场上该卡的记录清空
            fieldArrayPly1.FieldCards[cardNo].state = "null";
            P1Tomb.push(cardsrc);  //将选中卡片的src存入墓地数组
            updateField(fieldID, "null", "");  //更新战场

            /**
             * 告知对方更新我方战场及墓地
             */
            var updateID = "p2-field" + cardNo.toString();
            messageField("null", updateID, "");
            messageTomb("add", "player2", "null", cardsrc);
        } else {
            alert("请先将卡片拿到手牌再放入墓地");  //防止直接从卡组或墓地中选卡放回墓地
        }

        /*清空所有选中状态 */
        cleanSelected();

        sf_buttons('p1tomb');  //刷新副面板显示
    }
}


//----------------------------------------------------------------
/**
 * 从卡组中选择及从墓地中选择这块函数
 * 独立处理
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
        var cardImg = document.createElement("img");
        cardImg.id = "sf-card" + i.toString();
        cardImg.setAttribute("class", "card");
        cardImg.setAttribute("onmouseover", "sf_showInfo(this.src)");
        cardImg.setAttribute("onclick", "sf_selectCard(this.id, this.src)");
        cardImg.src = cardset[i];
        selectArea.appendChild(cardImg);
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