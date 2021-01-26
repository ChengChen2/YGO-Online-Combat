
var P1DeckName = "Deck_KaiMa";  //我方牌组名
var P1DeckNum = 41;  //我方牌组卡片数量
var P1Deck = new Array(P1DeckNum);  //储存我方牌组所有卡片src
var CardNum = P1DeckNum;  //实时记录卡组卡片数量
var HandSelected = false;  //是否有手卡被选中
var FieldSelected = false;  //是否有场上卡被选中
var HandCard = "NoCard";  //记录卡片的src(当卡槽为空时,数值默认为"NoCard")
var HandID;  //记录被选中手卡卡槽id
var HandIDBuf;  //记录上一次被选中的手卡卡槽id
var HandNo;  //记录哪一张手卡被选中
var FieldID;  //记录被选中场上卡槽id
var FieldIDBuf;  //记录上一次被选中的场上卡槽id
var FieldNo;  //记录场上哪一张卡被选中
var FieldNoBuf;  //记录上一次被选中的场上卡
var TombNum = 0;  //墓地中卡片数量
var GameoutNum = 0;  //游戏外卡片数量
var MonsterNum = 0;  //场上怪兽数量
var MagicNum = 0;  //场上魔法陷阱数量

var FieldCard = new Array(10);  //记录场上所有卡片的src
for (var i=0; i<10; i++) {  //数组初始化(当场上该卡槽为空时,数值默认为"NoCard")
  FieldCard[i] = "NoCard";
}

var CardState = new Array(10);  //记录怪兽卡的表示形式
for (var i=0; i<10; i++) {  //数组初始化(当场上该卡槽为空时,数值默认为"NoState")
  CardState[i] = "NoState";
}

var CardInDeck = new Array(P1DeckNum);  //记录卡片是否在牌组中
for (var i=0; i<P1DeckNum; i++) {  //数组初始化
  CardInDeck[i] = true;
}

var CardInHand = new Array(8);  //判断单个手牌置卡槽是否为空
for (var i=0; i<8; i++) {  //数组初始化
  CardInHand[i] = false;
}

var Tomb = new Array(P1DeckNum+10);  //墓地(默认大小为卡组数量加10张预留空间)
for (var i=0; i<P1DeckNum+10; i++) {  //数组初始化
  Tomb[i] = "NoCard";
}

var Gameout = new Array(P1DeckNum+10);  //游戏外(默认大小为卡组数量加10张预留空间)
for (var i=0; i<P1DeckNum+10; i++) {  //数组初始化
  Gameout[i] = "NoCard";
}

/* 储存P1卡组所有卡片路径*/
for (var i=0; i<P1DeckNum; i++) {
  P1Deck[i] = "image/cards/" + P1DeckName + "/" + i + ".jpg";
}

/* 生成抽卡随机数(整数)*/
function createRandom(n, m) {
    var c = m-n+1;
    return Math.floor(Math.random() * c + n);
}

/* 抽卡*/
function draw() {
  var CardLimited = false;  //手卡是否已达上限
  var CardNo;  //抽卡随机数
  if (CardNum == 0) {
    alert("卡组中已经没有卡片了!");
    CardLimited = true;
  } else {
    //生成新的抽卡随机数
    while(true) {
      CardNo = createRandom(0, P1DeckNum-1);
      if (CardInDeck[CardNo] == true) {  //如果该卡在卡组内则抽出否则一直生成随机数
        break;
      }
    }
  }
  if (CardInHand[0] == false) {  //哪张手卡槽为空
    element = document.getElementById('p1-hand0');
    CardInHand[0] = true;
  } else if (CardInHand[1] == false) {
    element = document.getElementById('p1-hand1');
    CardInHand[1] = true;
  } else if (CardInHand[2] == false) {
    element = document.getElementById('p1-hand2');
    CardInHand[2] = true;
  } else if (CardInHand[3] == false) {
    element = document.getElementById('p1-hand3');
    CardInHand[3] = true;
  } else if (CardInHand[4] == false) {
    element = document.getElementById('p1-hand4');
    CardInHand[4] = true;
  } else if (CardInHand[5] == false) {
    element = document.getElementById('p1-hand5');
    CardInHand[5] = true;
  } else if (CardInHand[6] == false) {
    element = document.getElementById('p1-hand6');
    CardInHand[6] = true;
  } else if (CardInHand[7] == false) {
    element = document.getElementById('p1-hand7');
    CardInHand[7] = true;
  } else {
    CardLimited = true;
    alert("手卡数量已达到上限");
  }
  if (CardLimited == false) {  //如果手卡未达上限
    element.src = P1Deck[CardNo];
    CardInDeck[CardNo] = false;
    CardNum--;
  }
}

/* 显示场上卡片信息*/
function showInfoField(fn) {
  element = document.getElementById('card-info');
  if (fn == 'NoCard') {
    element.src = '';
  } else if (FieldCard[fn] != "NoCard") {
    element.src = FieldCard[fn];
  }
}

/* 显示手牌的卡片信息*/
function showInfoHand(cardsrc) {
  element = document.getElementById('card-info');
  if (cardsrc != "") {
    element.src = cardsrc;
  }
}

/* 选择手卡*/
function selectHand(hno, hid, hc) {
  HandNo = hno;  //哪一张手牌
  HandID = hid;  //手牌卡槽id
  HandCard = hc;  //手牌卡片src
  if (HandCard == "file:///F:/[NewStudy]/[HTML]/ygo/ygo.html") {  //当cid为空时,该值则为当前页面的url
    alert("选择不能为空");
  } else {
    if (HandSelected == false) {
      HandSelected = true;
      HandIDBuf = HandID;
      element = document.getElementById(HandID);
      element.setAttribute("class", "card-selected");
    } else {
      if (HandIDBuf == HandID) {  //如果选中的卡片再次被选中,取消选中状态
        HandSelected = false;
        element = document.getElementById(HandID);
        element.setAttribute("class", "card");
      } else {  //如果选中其他卡,取消原被选中卡的选中状态
        element = document.getElementById(HandIDBuf);
        element.setAttribute("class", "card");
        element = document.getElementById(HandID);
        element.setAttribute("class", "card-selected");
        HandIDBuf = HandID;  //更新缓存
      }
    }
    if (FieldSelected == true) {  //如果场上有卡片被选中,取消其选中状态(保持选中的卡片永远只有一张)
      FieldSelected = false;
      element = document.getElementById(FieldID);
      if (CardState[FieldNo] == "attk") {
        element.setAttribute("class", "card-attk");
      } else if (CardState[FieldNo] == "defen") {
        element.setAttribute("class", "card-defen");
      } else if (CardState[FieldNo] == "back") {
        element.setAttribute("class", "card-back");
      } else if (CardState[FieldNo] == "on") {
        element.setAttribute("class", "card-on");
      } else if (CardState[FieldNo] == "off") {
        element.setAttribute("class", "card-off");
      }
    }
  }
}

function selectCard(fn, fid) {
  FieldNo = fn;
  FieldID = fid;
  element = document.getElementById(FieldID);
  element.setAttribute("class", "item-selected");
}

/* 选择场上卡片*/
function selectField(fn, fid) {
  FieldNo = fn;
  FieldID = fid;
  if (FieldSelected == false) {
    FieldSelected = true;
    FieldIDBuf = FieldID;
    FieldNoBuf = FieldNo;
    element = document.getElementById(FieldID);
    if (CardState[FieldNo] == "attk") {
      element.setAttribute("class", "card-attk-selected");
    } else if (CardState[FieldNo] == "defen") {
      element.setAttribute("class", "card-defen-selected");
    } else if (CardState[FieldNo] == "back") {
      element.setAttribute("class", "card-back-selected");
    } else if (CardState[FieldNo] == "on") {
      element.setAttribute("class", "card-on-selected");
    } else if (CardState[FieldNo] == "off") {
      element.setAttribute("class", "card-off-selected");
    }
  } else {
    if (FieldIDBuf == FieldID) {  //如果选中的卡片再次被选中,取消选中状态
      FieldSelected = false;
      element = document.getElementById(FieldID);
      if (CardState[FieldNo] == "attk") {
        element.setAttribute("class", "card-attk");
      } else if (CardState[FieldNo] == "defen") {
        element.setAttribute("class", "card-defen");
      } else if (CardState[FieldNo] == "back") {
        element.setAttribute("class", "card-back");
      } else if (CardState[FieldNo] == "on") {
        element.setAttribute("class", "card-on");
      } else if (CardState[FieldNo] == "off") {
        element.setAttribute("class", "card-off");
      }
    } else {  //如果选中其他卡,取消原被选中卡的选中状态
      element = document.getElementById(FieldIDBuf);
      if (CardState[FieldNoBuf] == "attk") {
        element.setAttribute("class", "card-attk");
      } else if (CardState[FieldNoBuf] == "defen") {
        element.setAttribute("class", "card-defen");
      } else if (CardState[FieldNoBuf] == "back") {
        element.setAttribute("class", "card-back");
      } else if (CardState[FieldNoBuf] == "on") {
        element.setAttribute("class", "card-on");
      } else if (CardState[FieldNoBuf] == "off") {
        element.setAttribute("class", "card-off");
      }
      element = document.getElementById(FieldID);  //选中新选择的卡
      if (CardState[FieldNo] == "attk") {
        element.setAttribute("class", "card-attk-selected");
      } else if (CardState[FieldNo] == "defen") {
        element.setAttribute("class", "card-defen-selected");
      } else if (CardState[FieldNo] == "back") {
        element.setAttribute("class", "card-back-selected");
      } else if (CardState[FieldNo] == "on") {
        element.setAttribute("class", "card-on-selected");
      } else if (CardState[FieldNo] == "off") {
        element.setAttribute("class", "card-off-selected");
      }
      FieldIDBuf = FieldID;  //更新缓存
      FieldNoBuf = FieldNo;
    }
  }
  if (HandSelected == true) {  //如果手牌有卡片被选中,取消其选中状态(保持选中的卡片永远只有一张)
    HandSelected = false;
    element = document.getElementById(HandID);
    element.setAttribute("class", "card");
  }
}

/* 攻击表示召唤*/
function attkSummon() {
  if (HandSelected == true) {  //如果有卡被选中
    if (CardState[2] == "NoState") {
      element = document.getElementById('p1-field2');
      element.src = HandCard;
      element.setAttribute("class", "card-attk");
      FieldCard[2] = HandCard;  //记录场上卡片的src
      CardState[2] = "attk";  //表示形式记为"攻击"
    } else if (CardState[1] == "NoState") {
      element = document.getElementById('p1-field1');
      element.src = HandCard;
      element.setAttribute("class", "card-attk");
      FieldCard[1] = HandCard;  //记录场上卡片的src
      CardState[1] = "attk";  //表示形式记为"攻击"
    } else if (CardState[3] == "NoState") {
      element = document.getElementById('p1-field3');
      element.src = HandCard;
      element.setAttribute("class", "card-attk");
      FieldCard[3] = HandCard;  //记录场上卡片的src
      CardState[3] = "attk";  //表示形式记为"攻击"
    } else if (CardState[0] == "NoState") {
      element = document.getElementById('p1-field0');
      element.src = HandCard;
      element.setAttribute("class", "card-attk");
      FieldCard[0] = HandCard;  //记录场上卡片的src
      CardState[0] = "attk";  //表示形式记为"攻击"
    } else if (CardState[4] == "NoState") {
      element = document.getElementById('p1-field4');
      element.src = HandCard;
      element.setAttribute("class", "card-attk");
      FieldCard[4] = HandCard;  //记录场上卡片的src
      CardState[4] = "attk";  //表示形式记为"攻击"
    } else {
      alert("怪兽区域已满");
    }
    if (MonsterNum <= 4) {
      element = document.getElementById(HandID);
      element.src = "";  //被打出的手卡从手牌消失
      element.setAttribute("class", "card");  //取消选中框
      CardInHand[HandNo] = false;
      HandSelected = false;
      MonsterNum++;
    }
  }
}

/* 守备表示召唤*/
function defenSummon() {
  if (HandSelected == true) {  //如果有卡被选中
    if (CardState[2] == "NoState") {
      element = document.getElementById('p1-field2');
      element.src = HandCard;
      element.setAttribute("class", "card-defen");
      FieldCard[2] = HandCard;  //记录场上卡片的src
      CardState[2] = "defen";  //表示形式记为"守备"
    } else if (CardState[1] == "NoState") {
      element = document.getElementById('p1-field1');
      element.src = HandCard;
      element.setAttribute("class", "card-defen");
      FieldCard[1] = HandCard;  //记录场上卡片的src
      CardState[1] = "defen";  //表示形式记为"守备"
    } else if (CardState[3] == "NoState") {
      element = document.getElementById('p1-field3');
      element.src = HandCard;
      element.setAttribute("class", "card-defen");
      FieldCard[3] = HandCard;  //记录场上卡片的src
      CardState[3] = "defen";  //表示形式记为"守备"
    } else if (CardState[0] == "NoState") {
      element = document.getElementById('p1-field0');
      element.src = HandCard;
      element.setAttribute("class", "card-defen");
      FieldCard[0] = HandCard;  //记录场上卡片的src
      CardState[0] = "defen";  //表示形式记为"守备"
    } else if (CardState[4] == "NoState") {
      element = document.getElementById('p1-field4');
      element.src = HandCard;
      element.setAttribute("class", "card-defen");
      FieldCard[4] = HandCard;  //记录场上卡片的src
      CardState[4] = "defen";  //表示形式记为"守备"
    } else {
      alert("怪兽区域已满");
    }
    if (MonsterNum <= 4) {
      element = document.getElementById(HandID);
      element.src = "";  //被打出的手卡从手牌消失
      element.setAttribute("class", "card");  //取消选中框
      CardInHand[HandNo] = false;
      HandSelected = false;
      MonsterNum++;
    }
  }
}

/* 背盖表示召唤*/
function backSummon() {
  if (HandSelected == true) {  //如果有卡被选中
    if (CardState[2] == "NoState") {
      element = document.getElementById('p1-field2');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-back");
      FieldCard[2] = HandCard;  //记录场上卡片的src
      CardState[2] = "back";  //表示形式记为"背盖"
    } else if (CardState[1] == "NoState") {
      element = document.getElementById('p1-field1');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-back");
      FieldCard[1] = HandCard;  //记录场上卡片的src
      CardState[1] = "back";  //表示形式记为"背盖"
    } else if (CardState[3] == "NoState") {
      element = document.getElementById('p1-field3');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-back");
      FieldCard[3] = HandCard;  //记录场上卡片的src
      CardState[3] = "back";  //表示形式记为"背盖"
    } else if (CardState[0] == "NoState") {
      element = document.getElementById('p1-field0');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-back");
      FieldCard[0] = HandCard;  //记录场上卡片的src
      CardState[0] = "back";  //表示形式记为"背盖"
    } else if (CardState[4] == "NoState") {
      element = document.getElementById('p1-field4');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-back");
      FieldCard[4] = HandCard;  //记录场上卡片的src
      CardState[4] = "back";  //表示形式记为"背盖"
    } else {
      alert("怪兽区域已满");
    }
    if (MonsterNum <= 4) {
      element = document.getElementById(HandID);
      element.src = "";  //被打出的手卡从手牌消失
      element.setAttribute("class", "card");  //取消选中框
      CardInHand[HandNo] = false;
      HandSelected = false;
      MonsterNum++;
    }
  }
}

/* 发动手中的卡片*/
function launchCard() {
  if (HandSelected == true) {  //如果有卡被选中
    if (CardState[7] == "NoState") {
      element = document.getElementById('p1-field7');
      element.src = HandCard;
      element.setAttribute("class", "card-on");
      FieldCard[7] = HandCard;  //记录场上卡片的src
      CardState[7] = "on";
    } else if (CardState[6] == "NoState") {
      element = document.getElementById('p1-field6');
      element.src = HandCard;
      element.setAttribute("class", "card-on");
      FieldCard[6] = HandCard;  //记录场上卡片的src
      CardState[6] = "on";
    } else if (CardState[8] == "NoState") {
      element = document.getElementById('p1-field8');
      element.src = HandCard;
      element.setAttribute("class", "card-on");
      FieldCard[8] = HandCard;  //记录场上卡片的src
      CardState[8] = "on";
    } else if (CardState[5] == "NoState") {
      element = document.getElementById('p1-field5');
      element.src = HandCard;
      element.setAttribute("class", "card-on");
      FieldCard[5] = HandCard;  //记录场上卡片的src
      CardState[5] = "on";
    } else if (CardState[9] == "NoState") {
      element = document.getElementById('p1-field9');
      element.src = HandCard;
      element.setAttribute("class", "card-on");
      FieldCard[9] = HandCard;  //记录场上卡片的src
      CardState[9] = "on";
    } else {
      alert("魔法陷阱区域已满");
    }
    if (MagicNum <= 4) {
      element = document.getElementById(HandID);
      element.src = "";  //被打出的手卡从手牌消失
      element.setAttribute("class", "card");  //取消选中框
      CardInHand[HandNo] = false;
      HandSelected = false;
      MagicNum++;
    }
  }
}

/* 盖下手中的卡片*/
function coverCard() {
  if (HandSelected == true) {  //如果有卡被选中
    if (CardState[7] == "NoState") {
      element = document.getElementById('p1-field7');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-off");
      FieldCard[7] = HandCard;  //记录场上卡片的src
      CardState[7] = "off";
    } else if (CardState[6] == "NoState") {
      element = document.getElementById('p1-field6');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-off");
      FieldCard[6] = HandCard;  //记录场上卡片的src
      CardState[6] = "off";
    } else if (CardState[8] == "NoState") {
      element = document.getElementById('p1-field8');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-off");
      FieldCard[8] = HandCard;  //记录场上卡片的src
      CardState[8] = "off";
    } else if (CardState[5] == "NoState") {
      element = document.getElementById('p1-field5');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-off");
      FieldCard[5] = HandCard;  //记录场上卡片的src
      CardState[5] = "off";
    } else if (CardState[9] == "NoState") {
      element = document.getElementById('p1-field9');
      element.src = "image/cards/cardback.jpg";
      element.setAttribute("class", "card-off");
      FieldCard[9] = HandCard;  //记录场上卡片的src
      CardState[9] = "off";
    } else {
      alert("魔法陷阱区域已满");
    }
    if (MagicNum <= 4) {
      element = document.getElementById(HandID);
      element.src = "";  //被打出的手卡从手牌消失
      element.setAttribute("class", "card");  //取消选中框
      CardInHand[HandNo] = false;
      HandSelected = false;
      MagicNum++;
    }
  }
}

/* 更变怪兽卡形式*/
function changeState() {
  if (FieldSelected == true) {
    if (CardState[FieldNo] == "attk") {  //如果是攻击表示就改为防守表示
      element = document.getElementById(FieldID);
      element.setAttribute("class", "card-defen-selected");
      CardState[FieldNo] = "defen";
    } else if (CardState[FieldNo] == "defen") {  //如果是防守表示就改为背盖表示
      element = document.getElementById(FieldID);
      element.setAttribute("class", "card-back-selected");
      element.src = "image/cards/cardback.jpg";
      CardState[FieldNo] = "back";
    } else if (CardState[FieldNo] == "back") {  //如果是背盖表示就改为攻击表示
      element = document.getElementById(FieldID);
      element.setAttribute("class", "card-attk-selected");
      element.src = FieldCard[FieldNo];
      CardState[FieldNo] = "attk";
    }
  }
}

/* 打开盖卡*/
function openCard() {
  if (FieldSelected == true) {  //如果有卡片被选中
    if (CardState[FieldNo] == "off") {  //如果是盖放就打开
      element = document.getElementById(FieldID);
      element.setAttribute("class", "card-on-selected");
      element.src = FieldCard[FieldNo];
      CardState[FieldNo] = "on";
    }
  }
}


/* 回到手卡*/
function backtoHand() {
  if (FieldSelected == true) {  //如果有卡片被选中
    var CardLimited = false;  //手卡是否已达上限
    if (CardInHand[0] == false) {  //哪张手卡槽为空
      element = document.getElementById('p1-hand0');
      CardInHand[0] = true;
    } else if (CardInHand[1] == false) {
      element = document.getElementById('p1-hand1');
      CardInHand[1] = true;
    } else if (CardInHand[2] == false) {
      element = document.getElementById('p1-hand2');
      CardInHand[2] = true;
    } else if (CardInHand[3] == false) {
      element = document.getElementById('p1-hand3');
      CardInHand[3] = true;
    } else if (CardInHand[4] == false) {
      element = document.getElementById('p1-hand4');
      CardInHand[4] = true;
    } else if (CardInHand[5] == false) {
      element = document.getElementById('p1-hand5');
      CardInHand[5] = true;
    } else if (CardInHand[6] == false) {
      element = document.getElementById('p1-hand6');
      CardInHand[6] = true;
    } else if (CardInHand[7] == false) {
      element = document.getElementById('p1-hand7');
      CardInHand[7] = true;
    } else {
      CardLimited = true;
      alert("手卡数量已达到上限");
    }
    if (CardLimited == false) {
      element.src = FieldCard[FieldNo];  //将选中卡片的src返回手牌
      element = document.getElementById(FieldID);
      element.src = "";  //清空被选中的场上卡槽
      element.setAttribute("class", "");  //取消选中状态
      if (CardState[FieldNo] == "on" || CardState[FieldNo] == "off") {
        MagicNum--;  //如果回到手牌的是魔法陷阱卡,魔法陷阱卡区域数量减一
      } else if (CardState[FieldNo] == "attk" || CardState[FieldNo] == "defen" || CardState[FieldNo] == "back") {
        MonsterNum--;  //如果回到手牌的是怪兽卡,怪兽卡区域数量减一
      }
      FieldCard[FieldNo] = "NoCard";  //清空该卡槽所有状态
      CardState[FieldNo] = "NoState";
    }
  }
}

/* 回到卡组*/
function backtoDeck() {
  var cno;  //卡片编号
  if (HandSelected == true) {  //如果从手牌选择
    element = document.getElementById(HandID);
    element.src = "";  //清空被选中的卡槽
    element.setAttribute("class", "card");  //取消选中框
    CardInHand[HandNo] = false;
    HandSelected = false;
    cno = HandCard.replace(/[^0-9]/ig, "");  //用正则表达式提取卡片src中的卡片编号
    CardInDeck[cno] = true;  //卡组中重新记录有该卡片
    CardNum++;  //卡组卡片数量加一
  } else if (FieldSelected == true) {  //如果从场上选择
    element = document.getElementById(FieldID);
    element.src = "";  //清空被选中的场上卡槽
    element.setAttribute("class", "");  //取消选中状态
    if (CardState[FieldNo] == "on" || CardState[FieldNo] == "off") {
      MagicNum--;  //如果回到手牌的是魔法陷阱卡,魔法陷阱卡区域数量减一
    } else if (CardState[FieldNo] == "attk" || CardState[FieldNo] == "defen" || CardState[FieldNo] == "back") {
      MonsterNum--;  //如果回到手牌的是怪兽卡,怪兽卡区域数量减一
    }
    FieldSelected = false;
    cno = FieldCard[FieldNo].replace(/[^0-9]/ig, "");  //用正则表达式提取卡片号码
    CardInDeck[cno] = true;  //卡组中重新记录有该卡片
    FieldCard[FieldNo] = "NoCard";  //清空选中卡槽所有状态
    CardState[FieldNo] = "NoState";
    CardNum++;  //卡组卡片数量加一
  }
}

function sendtoTomb() {
  if (HandSelected == true) {  //如果从手牌选择
    element = document.getElementById(HandID);
    Tomb[TombNum] = element.src;  //墓地记下选中卡片的src
    element.src = "";  //清空被选中的卡槽
    element.setAttribute("class", "card");  //取消选中框
    CardInHand[HandNo] = false;
    HandSelected = false;
    TombNum++;  //墓地卡片数量加一
  } else if (FieldSelected == true) {  //如果从场上选择
    element = document.getElementById(FieldID);
    Tomb[TombNum] = FieldCard[FieldNo];  //墓地记下选中卡片的src
    element.src = "";  //清空被选中的场上卡槽
    element.setAttribute("class", "");  //取消选中状态
    if (CardState[FieldNo] == "on" || CardState[FieldNo] == "off") {
      MagicNum--;  //如果是魔法陷阱卡,魔法陷阱卡区域数量减一
    } else if (CardState[FieldNo] == "attk" || CardState[FieldNo] == "defen" || CardState[FieldNo] == "back") {
      MonsterNum--;  //如果是怪兽卡,怪兽卡区域数量减一
    }
    FieldSelected = false;
    FieldCard[FieldNo] = "NoCard";  //清空选中槽所有状态
    CardState[FieldNo] = "NoState";
    TombNum++;  //墓地卡片数量加一
  }
  /* 墓地卡槽显示最新被送入墓地的卡*/
  element = document.getElementById('p1-tomb');
  element.src = Tomb[TombNum-1];
}

/* 除去游戏外*/
function sendtoGameout() {
  if (HandSelected == true) {  //如果从手牌选择
    element = document.getElementById(HandID);
    Gameout[GameoutNum] = element.src;  //游戏外记下选中卡片的src
    element.src = "";  //清空被选中的卡槽
    element.setAttribute("class", "card");  //取消选中框
    CardInHand[HandNo] = false;
    HandSelected = false;
    GameoutNum++;  //游戏外卡片数量加一
  } else if (FieldSelected == true) {  //如果从场上选择
    element = document.getElementById(FieldID);
    Gameout[GameoutNum] = FieldCard[FieldNo];  //游戏外记下选中卡片的src
    element.src = "";  //清空被选中的场上卡槽
    element.setAttribute("class", "");  //取消选中状态
    if (CardState[FieldNo] == "on" || CardState[FieldNo] == "off") {
      MagicNum--;  //如果回到手牌的是魔法陷阱卡,魔法陷阱卡区域数量减一
    } else if (CardState[FieldNo] == "attk" || CardState[FieldNo] == "defen" || CardState[FieldNo] == "back") {
      MonsterNum--;  //如果回到手牌的是怪兽卡,怪兽卡区域数量减一
    }
    FieldSelected = false;
    FieldCard[FieldNo] = "NoCard";  //清空选中槽所有状态
    CardState[FieldNo] = "NoState";
    GameoutNum++;  //游戏外卡片数量加一
  }
  /* 游戏外卡槽显示最新被除去游戏外的卡*/
  element = document.getElementById('p1-gameout');
  element.src = Gameout[GameoutNum-1];
}
