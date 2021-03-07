
/**
 * 我方/对方墓地的更新;
 * （我方）手牌，场上的卡片送入墓地;
 * 
 * [包含函数]：
 * updateTomb
 * sendtoTomb
 */


/**
 * 更新我方/对方墓地
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