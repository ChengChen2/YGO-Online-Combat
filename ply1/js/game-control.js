
var P1DeckName = "Deck_KaiMa";  //我方牌组名
var P1DeckNum = 41;  //我方牌组卡片数量

var P1Deck = [];  //储存我方牌组所有卡片src

var SelectedCard = {  //被选中的卡对象
    type: "none",  //卡的来源类型（手牌，场上）
    cardsrc: "none"  //卡的src
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

/* 显示卡片信息*/
function showCardInfo(cardsrc, ply) {
    element = document.getElementById('card-info');
    if (ply == 'player1' && cardsrc != emptysrc) {  //显示我方卡牌信息（卡槽不为空）
        element.src = cardsrc;
    } else if (ply == 'player2' && cardsrc != emptysrc) {  //显示对方卡牌信息（卡槽不为空）

        /*注意卡的状态，是否为手卡 */
    }
}

/*（游戏中始终只有一张卡牌处于选中状态）*/
function selectCard(type, cardsrc) {
    SelectedCard.type = type;
    SelectedCard.cardsrc = cardsrc;
}
