

/*--------------------------全局变量-------------------------- */

var P1DeckName = "Deck_KaiMa";  //我方牌组名
var P1DeckNum = 41;  //我方牌组卡片数量
var CardBackSrc = "image/cards/cardback.jpg";  //卡片背面图片的src

var P1Deck = [];  //储存我方牌组所有卡片src

var SelectedCard = {  //被选中的卡对象
    type: "none",  //卡的来源类型（手牌，场上）
    cardNo: -1,  //卡片的序号
    player: "none"  //玩家号
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

var fieldArrayPly2 = { 
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

//fieldArrayPly1.FieldCards[0].imgsrc = "aa";

/*---------------------游戏控制逻辑部分------------------------*/

//储存P1卡组所有卡片路径
for (var i=0; i<P1DeckNum; i++) {
    var cardsrc = "image/cards/" + P1DeckName + "/" + i + ".jpg"
    P1Deck.push(cardsrc);
}

// 洗牌
P1Deck = shuffle(cloneArr(P1Deck));
//console.log(P1Deck);

// 获取空的img src路径，方便其他函数判断卡槽是否为空
// window.onload 使函数在html完全加载后执行
var emptysrc;
window.onload = function() {
  var handID = 'p1-field0';
  element = document.getElementById(handID);
  emptysrc = element.src;
}


//----------------------------------------------------------------
/*抽取牌组最上方一张卡至手卡 */
function drawCard() {
    for (var i=0; i<8; i++) {
        var handID = 'p1-hand' + i.toString();
        element = document.getElementById(handID);
        if (element.src == emptysrc) {  //如果该卡槽为空
          element.src = P1Deck.pop();
          break;
        }
    }

    /**
     * 告知对手哪张手卡卡槽添加了一张卡
     * 
     */
}

/*生成随机数 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/*克隆数组 */
function cloneArr(arr) {
    // 从第一个字符就开始 copy
    // slice(start,end) 方法可从已有的数组中返回选定的元素。
    return arr.slice(0)
}

/*数组洗牌 */
function shuffle(arr) {
    let newArr = [];
    newArr = arr;
    for (let i = 0; i < newArr.length; i++) {
        let j = getRandom(0, i)
        let temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp
    }
    return newArr
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

        switch(ply) {
            /*我方卡片一律显示 */
            case 'player1':
                if (type == 'hand') {  //手卡均显示
                    element.src = cardsrc;
                } else {  //场上卡片按数组记录的img的src显示（若直接取img容器的src则无法看到我方盖卡）
                    element.src = fieldArrayPly1.FieldCards[cardNo].imgsrc;
                }
                break;
            /*对方卡片视情况显示 */
            case 'player2':
                if (type == 'hand') {  //手卡均不显示
                    element.src = CardBackSrc;
                } else {  //场上卡片直接按容器的img值显示
                    element.src = cardsrc;
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

        if (type == 'hand') {
            element = document.getElementById(id);
            element.setAttribute("class", "card-selected");
        } else {
            element = document.getElementById(id);
            element.setAttribute("class", "item-selected");
        }
    }
}

/**
 * 清除所有卡片被选中的状态
 * 注意这里手牌和场上用于显示被选中状态的容器不同
 * 手牌的是img容器而场上用的是item容器
 */
function cleanSelected() {
    for (var i=0; i<8; i++) {
        var handIDPly1 = 'p1-hand' + i.toString();
        element = document.getElementById(handIDPly1);
        element.setAttribute("class", "card");
    }
    for (var i=0; i<10; i++) {
        var fieldIDPly1 = 'p1field' + i.toString();
        var fieldIDPly2 = 'p2field' + i.toString();
        element = document.getElementById(fieldIDPly1);
        element2 = document.getElementById(fieldIDPly2);
        element.setAttribute("class", "item");
        element2.setAttribute("class", "item");
    }

    /*重置被选中的卡片信息 */
    SelectedCard.type = "null";
    SelectedCard.cardNo = -1;
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
            var handID = "p1-hand" + (SelectedCard.cardNo).toString();
            element = document.getElementById(handID);
            cardsrc = element.src;
            element.src = "";  //手牌该卡消失
            cleanSelected();  //取消所有选中状态

            /*更新战场信息 */
            fieldArrayPly1.FieldCards[cardslot].imgsrc = cardsrc;
            fieldArrayPly1.FieldCards[cardslot].state = placetype;

            /*发出指令，执行更新战场卡片的函数 */
            var fieldID = "p1-field" + cardslot.toString();
            updateField(fieldID, placetype, cardsrc);

            /**
             * 放置后告知对手执行战场更新函数;
             * 放置完成后记得告诉对手哪张手卡消失了;
             */
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

    if (cardstate == 'none') {  //若卡片移出场外则img容器的class回到默认的card
        stateclass = "card";
    } else {
        stateclass = "card-" + cardstate;
    }

    element = document.getElementById(fieldID);
    element.setAttribute("class", stateclass);  //更新对应img容器的class

    /**
     * 如果是盖卡或背盖召唤直接显示卡片背面
     * 检查showCardInfo函数可知对于我方来说，即使卡片是背面图片仍可以显示卡片信息
     */
    if (cardstate == 'back' || cardstate == 'off') {  
        element.src = CardBackSrc;
    } else {
        element.src = cardsrc;
    }
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
        updateField(fieldID, cardstate, cardsrc);  //更新指定卡槽

        /**
         * 告知对手某一卡槽的表示形式发生变化，执行战场更新函数
         */
    }
}


//----------------------------------------------------------------

function backtoHand() {
    if (SelectedCard.type == 'field') {  //卡片必须来源于场上
        
        var cardslot = findEmptySlot('hand');  //寻找我方空的手牌卡槽 
        var cardNo = SelectedCard.cardNo;  //被选中卡牌的序号
        var fieldID;

        if (cardslot == -1) {
            alert("手牌已满");
        } else {
            var handID = "p1-hand" + (cardslot).toString();
            element = document.getElementById(handID);

            /*我方场上卡牌从记录场上信息的数组中获取卡片 */
            if (SelectedCard.player == 'player1') {  
                fieldID = "p1-field" + cardNo.toString();
                element.src = fieldArrayPly1.FieldCards[cardNo].imgsrc;  //手牌获取被选中的卡片
                fieldArrayPly1.FieldCards[cardNo].imgsrc = "null";  //场上该卡的记录清空
                fieldArrayPly1.FieldCards[cardNo].state = "null";

            /*对方场上卡牌直接从容器中获取卡片（必须是正面表示的卡片） */
            } else {  
                fieldID = "p2-field" + cardNo.toString();
                element.src = document.getElementById(fieldID).src;
            }
            
            /*更新战场并通知对方玩家也执行战场更新函数 */
            updateField(fieldID, "null", "");

            /*清空所有选中状态 */
            cleanSelected();
        }

    }
}