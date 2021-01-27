
var P1DeckName = "Deck_KaiMa";  //我方牌组名
var P1DeckNum = 41;  //我方牌组卡片数量
var CardBackSrc = "image/cards/cardback.jpg";  //卡片背面src

var P1Deck = [];  //储存我方牌组所有卡片src

var SelectedCard = {  //被选中的卡对象
    type: "none",  //卡的来源类型（手牌，场上）
    cardsrc: "none"  //卡片的src
};

/*-----------------游戏控制逻辑部分-------------------*/

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


/*-----------------各类控制函数-------------------------*/

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
}

/**
 * 显示卡片信息
 * show card info
 * @param {string} type - card source type (hand/field)
 * @param {string} cardsrc - card url
 * @param {string} ply - player tag 
 */
function showCardInfo(type, cardsrc, ply) {
    if (cardsrc != emptysrc) {
        element = document.getElementById('card-info');

        switch(ply) {
            /*我方卡片一律显示 */
            case 'player1':
                element.src = cardsrc;
                break;
            /*对方卡片视情况显示 */
            case 'player2':
                if (type == 'hand') {  //手卡均不显示
                    element.src = CardBackSrc;
                } else {
                    /*根据卡片状态来判断如何显示 */
                }
            default: break;
        }
    }
}


/**
 * 选择卡片（游戏中始终只有一张卡牌处于选中状态）,并记录当前卡片信息
 * @param {string} id - container id
 * @param {string} type - card source type (hand/field)
 * @param {string} cardsrc - card url
 * @param {string} ply - player tag
 */
function selectCard(id, type, cardsrc, ply) {
    if(cardsrc != emptysrc) {
        SelectedCard.type = type;
        SelectedCard.cardsrc = cardsrc;
        /*选择卡片之前首先清空场上已选中的卡片样式再更新 */
        cleanSelected();

        switch(ply) {
            case 'player1':
                if(type == 'hand') {
                    
                }
                break;
            case 'player2':
                break;
            default: break;
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
}
