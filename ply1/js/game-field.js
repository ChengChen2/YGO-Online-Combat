
/**
 * 卡片的放置;
 * 卡片形式更变;
 * 战场卡片更新;
 * 
 * [包含函数]:
 * placeCard
 * updateField
 * findEmptySlot
 * changeState
 */

/**
 * 我方从手牌向场上放置卡片，并发出放置指令 (攻击，防御，背盖防御，发动，盖卡)
 * @param {string} placetype - place type (attack/defence/back/on/off)
 * @param {string} cardtype - card type (monster/magic)
 */
function placeCard(placetype, cardtype) {

    var cardslot = findEmptySlot(cardtype); //寻找空的卡槽
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