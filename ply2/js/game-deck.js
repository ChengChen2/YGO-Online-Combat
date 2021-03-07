
/**
 * 卡组的切洗;
 * 抽卡;
 * 卡片返回卡组;
 * 
 * [包含函数]：
 * drawCard
 * getRandom
 * cloneArr
 * shuffle
 * shuffleDeck
 * backtoDeck
 * 
 */

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
