
/**
 * 对方手卡的更新;
 * 场上，墓地，牌组卡片返回手卡;
 * 
 * [包含函数]：
 * updateP2Hand
 * backtoHand
 */

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