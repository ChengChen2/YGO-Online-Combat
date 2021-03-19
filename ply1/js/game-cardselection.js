
/**
 * 卡片的选中;
 * 清除被选中的卡片;
 * 
 * [包含函数]：
 * selectCard
 * cleanSelected
 * 
 */

/**
 * 选择卡片（游戏中始终只有一张卡牌处于选中状态）,并记录当前卡片信息
 * @param {string} id - container id
 * @param {string} type - card source type (hand/field)
 * @param {string} cardsrc - card image url
 * @param {int} cardNo - card No
 * @param {string} ply - player tag
 */
function selectCard(id, type, cardsrc, cardNo, ply) {
    if (cardsrc != emptysrc) {
        cleanSelected();  //选择卡片之前首先清空场上已选中的卡片样式再更新

        /*储存被选中卡片的信息 */
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
    for (var i=0; i<10; i++) {  // 清除场上选中
        var fieldIDPly1 = 'p1field' + i.toString();
        var fieldIDPly2 = 'p2field' + i.toString();
        element = document.getElementById(fieldIDPly1);
        element2 = document.getElementById(fieldIDPly2);
        element.setAttribute("class", "item");
        element2.setAttribute("class", "item");
    }
    for (var i=0; i<sf_Card.size; i++) {  //清除副控制面板选中
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
