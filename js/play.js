var clickIndex = $("#gameLevel li").length - 1;
var betNum = 0;  // 投注数
var initLevel = clickIndex; // 初始关数
var guessVal; // 猜测按钮对应值
var anyNum = 1;// 任意值
var UserBeans; // 用户金豆数
var recordPage = 1;//页数
var pagecount = 1;// 总页数
var isGameGo = false; // 判断游戏是否开始
var isGuess = false; // 判断用户猜未猜测

var isMaxBeanShow = false;  // 最大金豆限制窗口
// 初始化话调用
var strImgSrc = $("#shareToWechat .share-icon img").attr("src");
var urlStr; // 资源库地址
if (isAndroidIOS()) {
    urlStr = "http:" + strImgSrc.substring(0, strImgSrc.lastIndexOf("/"));
} else {
    urlStr = "https:" + strImgSrc.substring(0, strImgSrc.lastIndexOf("/"));
}
// 初始化
function init() { 
    // 游戏初始化中继续按钮不可点击  游戏初始立即执行
    $("#goNext,#guess button").attr("disabled", "disabled");
    if (isAndroidIOS()) {
        app.pokerGameInit(anyNum);
    } else {
        window.webkit.messageHandlers.pokerGameInit.postMessage(anyNum);
    }
};
init();
// var isCreate = false;
(function () {
    var $htmlChildren = $("html").children();
    for (var i = 0; i < $htmlChildren.length; i++) {
        if ($htmlChildren[i].innerHTML === "广告") {
            $htmlChildren[i].parents("div").remove();
            $htmlChildren[i].parents("iframe").remove();
        }
    }
})();
// 投注点击
$("#wager #chips").on("click", ".bet", function () {  // 利用事件冒泡到父元素代理事件
    var betVal = parseInt($(this).attr("val"));
    betNum = betVal;
    $(this).find("img").transition({
        width: "100%"
    }, 200, "in-out");
    $(this).siblings(".bet").find("img").transition({
        width: "85%"
    }, 200, "in-out");
    var firstListBeans = betNum;
    $("#gameLevel li").eq(initLevel).find(".level-item .beansNum").html(showBeans(firstListBeans, false) + "豆");
    $("#letGo").removeAttr("disabled");
});
// 大小红黑点击
$("#guess button").click(function () {
    // prevent(event);
    $(this).css({
        background: "rgba(98, 82, 144, 0.6)"
    }).siblings("button").css({
        background: "#342857"
    }).find(".guessBtn div").css({
        color: "#9e85e7"
    });
    $(this).find(".guessBtn div").css({
        color: "#fff"
    });
    if ($("#toBig").attr("isBan") === "ban") {
        $("#toBig").find(".guessBtn div").css({
            color: "#50476a"
        });
    }else if($("#toSmall").attr("isBan") === "ban"){
        $("#toSmall").find(".guessBtn div").css({
            color: "#50476a"
        });
    }
    // 如果大，小不能点击而且其他的点击后样式不变
    isGuess = true;
    $("#goNext").removeAttr("disabled");
    // 判断当前点击按钮
    if (this.id === "toBig") {
        guessVal = 1;
    } else if (this.id === "toSmall") {
        guessVal = 2;
    } else if (this.id === "toRed") {
        guessVal = 3;
    } else if (this.id === "toBlack") {
        guessVal = 4;
    }
});
// 继续按钮点击事件
$("#goNext").click(function () {
    $("#guess button").removeAttr("style").removeAttr("isBan").attr("disabled", "disabled");
    $("#closeGame").removeAttr("disabled");
    $(this).attr("disabled", "disabled");
    // 将关数减少
    initLevel--;
    $("#guess button").css({
        background: "#342857"
    }).find(".guessBtn div").css({
        color: "#9e85e7"
    });
    if (isAndroidIOS()) {
        app.pokerGameContinue(guessVal);
    } else {
        window.webkit.messageHandlers.pokerGameContinue.postMessage(guessVal);
    }
    isGuess = false;
});
// 结算按钮点击事件
$("#closeGame").click(function () {
    $("#guess button,#goNext").attr("disabled", "disabled");
    $(this).attr("disabled", "disabled");
    Play.bingoGame = false;
    if (initLevel === clickIndex) {
        $("#notStart").show();
    }
    if (isAndroidIOS()) {  // 调用app的结算
        app.pokerGameOver(anyNum);
    } else {
        window.webkit.messageHandlers.pokerGameOver.postMessage(anyNum);
    }
});
// 返回窗口弹出中的结算
$("#backHome #quitGame").bind("click", function () {
    $(this).attr("disabled", "disabled");
    $("#backHome").hide(); //隐藏返回窗口
    Play.bingoGame = false;
    if (isAndroidIOS()) {   // 调用app的结算
        app.pokerGameOver(anyNum);
    } else {
        window.webkit.messageHandlers.pokerGameOver.postMessage(anyNum);
    }
});
//用户到达最大金额弹窗结算
$("#maxGoldBean #maxGoldBeanClose").bind("click", function () {
    $(this).attr("disabled", "disabled");
    $("#maxGoldBean").hide(); //隐藏返回窗口
    Play.bingoGame = false;
    if (isAndroidIOS()) {   // 调用app的结算
        app.pokerGameOver(anyNum);
    } else {
        window.webkit.messageHandlers.pokerGameOver.postMessage(anyNum);
    }
});
// 返回弹窗的继续按钮
$("#backHome #returnGame").click(function () {
    $("#goNext,#guessNext #closeGame").removeAttr("disabled");//移除按钮禁用
    $("#backHome").hide(); //隐藏返回窗口
    if ($("#toBig").attr("isBan") === "ban") {
        $("#toBig").find(".guessBtn div").css({
            color: "#50476a"
        });
        $("#toSmall,#toRed,#toBlack").removeAttr("disabled");
    }else if($("#toSmall").attr("isBan") === "ban"){
        $("#toSmall").find(".guessBtn div").css({
            color: "#50476a"
        });
        $("#toBig,#toRed,#toBlack").removeAttr("disabled");
    }else {
        $("#guess button").removeAttr("disabled");
    }
})
// 第一关结算中弹窗的继续返回游戏
$("#notStart .backGame").bind("click", function () {
    $("#notStart").hide();
    $("#letGo,#guessNext #closeGame,#guess button").removeAttr("disabled");
    if (isGuess) {
        $("#goNext").removeAttr("disabled");
    }
    if ($("#toBig").attr("isBan") === "ban") {
        $("#toBig").find(".guessBtn div").css({
            color: "#50476a"
        });
        $("#toSmall,#toRed,#toBlack").removeAttr("disabled");
    }else if($("#toSmall").attr("isBan") === "ban"){
        $("#toSmall").find(".guessBtn div").css({
            color: "#50476a"
        });
        $("#toBig,#toRed,#toBlack").removeAttr("disabled");
    }else {
        $("#guess button").removeAttr("disabled");
    }
});
// 弹窗再来一局按钮
$("#settlgame .settlgame-btn .reStartGame").click(function () {
    if (isAndroidIOS()) {
        app.OneMoreHand(anyNum);
    } else {
        window.webkit.messageHandlers.OneMoreHand.postMessage(anyNum);
    }
});
// 猜错再来一局按钮
$("#reStart-btn").click(function () {
    if (isAndroidIOS()) {
        app.OneMoreHand(anyNum);
    } else {
        window.webkit.messageHandlers.OneMoreHand.postMessage(anyNum);
    }
});
// 事件代理获取点击的ID
$("#recordList").on("click", ".record-item .recordList-btn", function () {
    var isRoundShow;
    var itemID = $(this).parent(".record-item").attr("id");//取当前条的ID
    var ID = "#" + itemID;
    var IdLen = itemID.length;
    itemID = itemID.substring(7, IdLen);
    var roundId = parseInt(itemID);
    var $roundContent = $(ID).find(".round-content");
    var $recordListBtn = $(ID).find(".recordList-btn");
    var isHaveData = $roundContent.attr("isHaveData"); // 判断当前的记录详情有无数据
    // 如果$recordListBtn点击中有向下的class:"toDown"的话，让isRoundShow =true可以显示
    // 如果$recordListBtn点击中有向上的class:"toUp"的话，让isRoundShow = false可以隐藏
    if ($recordListBtn.hasClass("toDown")) {
        isRoundShow = true;
    }
    if ($recordListBtn.hasClass("toUp")) {
        isRoundShow = false;
    }
    if (isRoundShow) {
        $roundContent.show();
        $recordListBtn.toggleClass("toUp").toggleClass("toDown");
    } else {
        $roundContent.hide();
        $recordListBtn.toggleClass("toUp").toggleClass("toDown");
    }
    if (!isHaveData) {
        $roundContent.attr("isHaveData", true);
        if (isAndroidIOS()) {
            app.pokerGameRecordInfo(roundId);
        } else {
            window.webkit.messageHandlers.pokerGameRecordInfo.postMessage(roundId);
        }
    }
});
// 跳转app的分享窗口
$(".share-btn").click(function () {
    // 分享图片地址
    var shareImgUrl = urlStr + "/share-poker.jpg";
    if (isAndroidIOS()) {
        app.jumpSharePopupWindow(shareImgUrl);
    } else {
        window.webkit.messageHandlers.jumpSharePopupWindow.postMessage(anyNum);
    }
});
// 跳转app的充值接口
$("#addBeans").click(function () {
    if (isAndroidIOS()) {
        app.jumpRecharge(UserBeans);
    } else {
        window.webkit.messageHandlers.jumpRecharge.postMessage(UserBeans);
    }
});
// 跳转到app的兑奖窗口
$("#conversion").click(function () {
    if (isAndroidIOS()) {
        app.jumpGiftCenter(anyNum);
    } else {
        window.webkit.messageHandlers.jumpGiftCenter.postMessage(anyNum);
    }
});
// 暂时离开
$(".stepOutGame").click(function () {
    if (isAndroidIOS()) {
        app.temporaryExit(anyNum);
    } else {
        window.webkit.messageHandlers.temporaryExit.postMessage(anyNum);
    }
});
// 余额不足充值窗口的暂不需要
$("#recharge #goBackGame").click(function () {
    $("#recharge").hide();// 隐藏弹窗
    $("#letGo").removeAttr("disabled");
});
// 余额不足充值窗口的充值按钮
$("#recharge #forRecharge").click(function () {
    $("#recharge").hide();// 隐藏弹窗
    $("#letGo").removeAttr("disabled");
    // 调用充值
    if (isAndroidIOS()) {
        app.jumpRecharge(UserBeans);
    } else {
        window.webkit.messageHandlers.jumpRecharge.postMessage(UserBeans);
    }
});
// 游戏逻辑部分
var Play = {
    outBeans: null,  // 用户获得金豆
    putBeans: null,   // 用户投入金豆
    bingoGame: true,
    initGame: function (data) {
        if (data.success) {
            var initGoldBeans = data.goldAllBean;
            var chipArr = data.vpbeltchip;
            var chipLen = chipArr.length;
            var defaultBet = data.beltNum;  // 默认投注值
            function forCreateChips(arr, len) {
                for (var i = 0; i < len; i++) {
                    createChip(arr[i]);
                    $("#chips .bet").css({
                        background: "#272139"
                    });
                    $("#chips .bet").eq(0).css({
                        marginLeft: "0.50rem"
                    }).siblings(".bet").css({
                        marginLeft: "0.20rem"
                    })
                    if (i === defaultBet) {  // 默认投注 状态
                        $("#chips .bet").eq(i).find("img").css({
                            width: "100%"
                        });
                        betNum = arr[i];
                        createList($("#gameLevel li").eq(initLevel), "投", urlStr + "/JackBack.png", arr[i]);
                    } else {
                        $("#chips .bet").eq(i).find("img").css({
                            width: "85%"
                        });
                    }
                }
                $("#wager").show();
                $("#guessNext").hide();
            }

            addAward(data.vpexreward);  //显示加奖关数
            if (initGoldBeans === undefined) {  // 如果当前用户未登陆
                forCreateChips(chipArr, chipLen);
                $("#addBeans").unbind("click");
                $("#BeansNum").html("未登录").click(function () {
                    if (isAndroidIOS()) {
                        app.toLoginBackRefresh();
                    } else {
                        window.webkit.messageHandlers.toLoginBackRefresh.postMessage(anyNum);
                    }
                });
                $("#letGo,#chips .bet").click(function () {
                    if (isAndroidIOS()) {
                        app.toLoginBackRefresh();
                    } else {
                        window.webkit.messageHandlers.toLoginBackRefresh.postMessage(anyNum);
                    }
                });
            } else {
                // 登录状态下点击
                UserBeans = initGoldBeans;
                userGoldAll(initGoldBeans);
                $("#letGo").click(function () {   // 开始闯关按钮点击
                    if (isAndroidIOS()) {
                        app.pokerGameBegin(betNum);
                    } else {
                        window.webkit.messageHandlers.pokerGameBegin.postMessage(betNum);
                    }
                });
                if (isAndroidIOS()) {
                    app.pokerGameRecord(recordPage);
                } else {
                    window.webkit.messageHandlers.pokerGameRecord.postMessage(recordPage);
                }
                if (data.guessHistory === null) {
                    forCreateChips(chipArr, chipLen);

                } else {
                    isGameGo = true; // 游戏已经开始
                    // 如果用户的初始关数不为0的话根据初始值描画页面
                    $("#guess button").removeAttr("disabled");//数据返回成功后，移除按钮的禁用
                    var initJackArr = data.guessHistory;
                    var len = initJackArr.length;
                    var oddsArr = initJackArr[len - 1].odds;
                    var oddLen = oddsArr.length;
                    initLevel = clickIndex - len + 1; // 重新设置初始关数
                    $("#wager").hide();// 隐藏投注页面
                    $("#guessNext").show(); // 出现猜测页面
                    // 将历史记录描画到页面上去
                    $(".guessWarn").hide();
                    for (var i = 0; i < len; i++) {
                        var createNum = clickIndex - i; // 创建列表值
                        var ImgSrc = urlStr + "/Jack/" + initJackArr[i].mark + " (" + initJackArr[i].point + ").png";
                        var smallImgSrc = urlStr + "/Jack/" + initJackArr[i].mark + "s (" + initJackArr[i].point + ").png";
                        var getType = i === 0 ? "投" : "得";
                        createList($("#gameLevel li").eq(createNum), getType, smallImgSrc, initJackArr[i].goldBean);
                        if (i === 0) {
                            $("#warnText").show();
                            Play.putBeans = initJackArr[0].goldBean;   // 用户初始投注数
                        } else {
                            $("#warnText").show().html("恭喜获得" + initJackArr[len - 1].goldBean + "豆").css({
                                color: "#fecb02"
                            });
                            this.outBeans = initJackArr[len - 1].goldBean;  // 用户在历史记录的最后投注数
                            addDisabled(initJackArr[len - 1].point);
                        }
                    }
                    for (var i = 0; i < oddLen; i++) {
                        $(".odds").eq(i).html(oddsArr[i]);
                    }
                    $("#smallJack").show().find("img").attr("src", ImgSrc);
                }
            }
        }
    },
    getRoundContent: function (data) {  // 每一局的记录详细
        if (data.success) {
            var detailList = data.detailList;
            var roundId = "#roundId" + data.roundId;
            var $roundContent = $(roundId).find(".round-content");
            var len = detailList.length;
            var str, chapterNum, mark, point, odds, isEnd, beltOn;
            for (var i = 0; i < len; i++) {
                chapterNum = detailList[i].chapterNum;
                mark = detailList[i].mark;
                point = detailList[i].point;
                odds = detailList[i].odds;
                beltOn = detailList[i].beltOn;
                isEnd = detailList[i].isEnd;
                if (chapterNum === 0) {
                    str = "【首发牌】 " + pokerName(mark, point); //首发牌的情况
                } else {
                    if (odds === 0 || isEnd === 0) {
                        odds = " 猜错";
                        str = LevelContent(chapterNum) + pokerName(mark, point) + odds; // 猜错的情况
                    }
                    if (odds > 0 && isEnd !== 0) {
                        odds = "奖励: " + odds + "倍";
                        str = LevelContent(chapterNum) + pokerName(mark, point) + belt(beltOn) + odds; // 猜对的情况
                    }
                }
                createRoundContent(str, $roundContent);// 创建记录详情
                if (odds !== 0 && isEnd === 1) { //结算情况在后添加一个list
                    var lastItem = LevelContent(chapterNum + 1) + "结算";
                    lastItem = "<li>" + lastItem + "</li>";
                    $roundContent.find("li").eq(len - 1).after(lastItem);
                }
            }
        }
    },
    getRecordList: function (data) {  //获取当前记录
        if (data.success) {
            pagecount = data.page.pagecount; // 总的纪录页数
            if (pagecount > 0) {
                $(".recordSeat").remove();
                var recordList = data.logList;
                var pageon = data.page.pageon;  // 当前记录页
                var len = recordList.length;
                var id, date, second, beltCount, recordName, obtainCount;
                for (var i = 0; i < len; i++) {
                    //id
                    id = "roundId" + recordList[i].roundId; //给li一个Id
                    // date 日期
                    date = recordList[i].roundDate;
                    date = date.toString();
                    date = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);// 日期格式转换
                    //second 时间
                    second = new Date(recordList[i].roundTime);
                    var minute = second.getMinutes(); //分钟
                    if (minute < 10) {
                        minute = "0" + minute;
                    }
                    var hour = second.getHours(); // 小时
                    var time = hour + ":" + minute; // 时间格式转换
                    //recordContent
                    beltCount = recordList[i].beltCount;
                    beltCount = "共投" + beltCount + "金豆";        //用户投的金豆数
                    //recordName
                    recordName = "欢乐扑克"; // 名字
                    //obtainCount
                    obtainCount = recordList[i].obtainCount;   // 获得的金豆数
                    createRecordList(id, date, time, beltCount, recordName, obtainCount);
                    if (obtainCount > 0) {
                        $("#recordList .record-item").eq(i + (pageon - 1) * 10).find(".recordGet").css({
                            color: "#ffcc00"
                        });
                        $("#recordList .record-item").eq(i + (pageon - 1) * 10).find(".record-icon").addClass("win-icon");
                    } else {
                        continue;
                    }
                }
            }
        }
    },
    postBetNum: function (data) {  // 开始闯关
        if (data.success) {
            isGameGo = true; // 数据正确返回 游戏开始
            $("#wager").hide();// 隐藏投注画面
            $("#guessNext").show(); //显示猜测画面
            var ImgSrc = urlStr + "/Jack/" + data.poker.mark + " (" + data.poker.point + ").png";// 给一个初始扑克
            var smallImgSrc = urlStr + "/Jack/" + data.poker.mark + "s (" + data.poker.point + ").png";
            addDisabled(data.poker.point);
            var oddArr = data.poker.odds;
            var goldAllBean = data.goldAllBean;
            UserBeans = goldAllBean;
            userGoldAll(goldAllBean);
            var oddLen = oddArr.length;
            for (var i = 0; i < oddLen; i++) {
                $(".odds").eq(i).html(oddArr[i]);  // 为每个大小红黑按钮 传递
            }
            nextLevel(ImgSrc, smallImgSrc, initLevel, data.poker.point);
        } else {
            $("#letGo").attr("disabled", "disabled");
            if (data.balnotenough) {
                $("#recharge").show();// 显示余额不足充值窗口
            }
        }

    },
    guessNextJack: function (data) {
        if (data.success) {
            // 猜下一张
            var ImgSrc = urlStr + "/Jack/" + data.nextPoker.mark + " (" + data.nextPoker.point + ").png";
            var oddsArr = data.nextPoker.odds; //赔率列表
            var oddsLen = oddsArr.length;
            addDisabled(data.nextPoker.point);
            // 更改，当前赔率
            for (var i = 0; i < oddsLen; i++) {
                $(".odds").eq(i).html(oddsArr[i]);
            }
            var getGoldBean = data.nextPoker.goldBean;
            var smallImgSrc = urlStr + "/Jack/" + data.nextPoker.mark + "s (" + data.nextPoker.point + ").png";
            var beltBean = data.beltBean;// 用户投注数
            this.outBeans = getGoldBean;
            Play.putBeans = beltBean; // 用户投注数
            if (data.perfect) {
                RotateJack(ImgSrc);
                createList($("#gameLevel li").eq(initLevel), "得", smallImgSrc, getGoldBean);
                $("#settlgame").show();
                $("#putIn-beans span").html(beltBean);
                $("#output-beans span").html(getGoldBean);
                $(".userLevel").html("人品爆发,闯关成功!");
                $("#goNext,#guess button").attr("disabled", "disabled");
                this.bingoGame = false;   // 通关后可以正常返回竞猜
            } else {
                if (data.bingo) {
                    createList($("#gameLevel li").eq(initLevel), "得", smallImgSrc, getGoldBean);
                    nextLevel(ImgSrc, smallImgSrc, initLevel, data.nextPoker.point);
                    setTimeout(function () {
                        $("#warnText").html("恭喜获得" + getGoldBean + "豆").css({
                            color: "#fecb02"
                        });
                    }, 1200);
                    this.bingoGame = true;  // 每一局通关的情况下不返回竞猜
                } else {
                    RotateJack(ImgSrc);
                    setTimeout(function () {
                        $(".guessWarn,#warnText").hide();
                        $(".loseWarn").show();
                    }, 1600);
                    $("#goNext,#guess button,#closeGame").attr("disabled", "disabled");
                    this.bingoGame = false;  // 失败后可正常返回竞猜
                }
            }
        } else {
            if (data.onMaxGoldBean) {
                //TODO:用户赢到最大金额
                $("#maxGoldBean").show();
                isMaxBeanShow = true;
                $("#goNext").css({
                    backgroundColor: "#6e6e6e"
                })
                $("#goNext,#guessNext #closeGame,#guess button,#goNext").attr("disabled", "disabled");// 禁用所有的按钮
            }
        }
    },
    settlgame: function (data) {  // 游戏结算
        if (data.success) {
            var level = data.level;
            if (data.success && level !== 0) {
                $("#settlgame").show();
                var putInBeans = data.beltBean;
                var outputBeans = data.goldBean;
                var goldAllBean = data.goldAllBean;
                $("#putIn-beans span").html(putInBeans);
                $("#output-beans span").html(outputBeans);
                if (level === clickIndex) {
                    $(".userLevel").html("人品爆发,闯关成功！");
                } else {
                    $(".userLevel span").html(data.level);
                }
            }
            UserBeans = goldAllBean;
            userGoldAll(goldAllBean);
        }
    },
    quitGame: function () { // topBar的退出
        if (isGameGo === true) {   // 游戏已经开始
            if (initLevel === clickIndex) { // 当前关数等于游戏初始关数
                $("#notStart").show();
                $("#letGo,#guessNext #closeGame,#guess button,#goNext").attr("disabled", "disabled"); // 禁用开始闯关按钮和其他guessNext下的所有按钮
            } else {
                if (this.bingoGame) {  // 如果游戏还在成功进行
                    if (isMaxBeanShow) {
                        $("#maxGoldBean").hide();  //当最大金额弹出情况的话
                        //禁用掉backHome的继续按钮
                        $("#backHome #returnGame").attr("disabled", "disabled").unbind("click").html("已结束").css({
                            backgroundColor: "#6e6e6e"
                        });
                    }
                    $("#backHome").show();    //弹出返回到其他的窗口
                    $("#goNext,#guessNext #closeGame,#guess button,#goNext").attr("disabled", "disabled");// 禁用所有的按钮
                    $("#backHome #putBeans span").html(Play.putBeans);
                    $("#backHome #outBeans span").html(this.outBeans);

                } else {  // 如果游戏进行错误点击退出，调用退出事件
                    if (isAndroidIOS()) {
                        app.temporaryExit(anyNum);
                    } else {
                        window.webkit.messageHandlers.temporaryExit.postMessage(anyNum);
                    }
                }
            }
        } else {  // 开始闯关按钮没有点击，游戏未开始可以直接退出
            if (isAndroidIOS()) {
                app.temporaryExit(anyNum);
            } else {
                window.webkit.messageHandlers.temporaryExit.postMessage(anyNum);
            }
        }
    }
};
//下拉刷新纪录列表
$("#recordWindow").scroll(function () {
    var bodyHeight = document.body.scrollHeight || document.documentElement.scrollHeight > 0 ? 5 : 30;
    if ($(this).scrollTop() + $(this).get(0).offsetHeight >= $(this).get(0).scrollHeight - bodyHeight) {
        if (pagecount > 1) { // 判断纪录页数是不是大于1
            if (recordPage === pagecount) {  // 当刷新的记录页于记录的总页数相等时，停止向下滚动
                $(this).unbind("scroll");
            } else if (recordPage < pagecount) {
                recordPage++; //页数下滑到底部+1 请求接口，加载下一页记录
                if (isAndroidIOS()) {
                    app.pokerGameRecord(recordPage);
                } else {
                    window.webkit.messageHandlers.pokerGameRecord.postMessage(recordPage);
                }
            }
        } else {
            $(this).unbind("scroll");
        }
    }
});
// 创建扑克具体名字
function pokerName(mark, point) {
    var pokerStr, markStr, pointStr;
    switch (mark) {
        case "H":
            markStr = "红桃";
            break;
        case "S":
            markStr = "黑桃";
            break;
        case "C":
            markStr = "梅花";
            break;
        case "D":
            markStr = "方块";
            break;
    }
    switch (point) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            pointStr = "&nbsp;" + point;
            break;
        case 10:
            pointStr = point;
            break;
        case  11:
            pointStr = "&nbsp;J";
            break;
        case 12:
            pointStr = "&nbsp;Q";
            break;
        case 13:
            pointStr = "&nbsp;K";
            break;
    }
    pokerStr = markStr + pointStr;
    return pokerStr;
};
// 创建第几轮字样
function LevelContent(num) {
    var LevelContent;
    switch (num) {
        case 1:
            LevelContent = "【第一轮】 ";
            break;
        case 2:
            LevelContent = "【第二轮】 ";
            break;
        case 3:
            LevelContent = "【第三轮】 ";
            break;
        case 4:
            LevelContent = "【第四轮】 ";
            break;
        case 5:
            LevelContent = "【第五轮】 ";
            break;
        case 6:
            LevelContent = "【第六轮】 ";
            break;
        case 7:
            LevelContent = "【第七轮】 ";
            break;
        case 8:
            LevelContent = "【第八轮】 ";
            break;
        case 9:
            LevelContent = "【第九轮】 ";
            break;
        case 10:
            LevelContent = "【第十轮】 ";
            break;
        case 11:
            LevelContent = "【第十一轮】 ";
            break;
        case 12:
            LevelContent = "【第十二轮】 ";
            break;
    }
    return LevelContent;
};
// 创建beltOn字样
function belt(num) {
    var beltOn;
    switch (num) {
        case 1:
            beltOn = " 大 ";
            break;
        case 2:
            beltOn = " 小 ";
            break;
        case 3:
            beltOn = " 红 ";
            break;
        case 4:
            beltOn = " 黑 ";
            break;
    }
    return beltOn;
};
// 扑克反转动画
function RotateJack(ImgSrc) {
    $("#bgJack").transition({
        transform: "rotateY(360deg)"
    }, 1000, 'in-out');
    setTimeout(function () {
        $("#bgJack").css({
            border: "none"
        }).find("img").attr("src", ImgSrc);
    }, 200);
};
// 表格中小扑克的反转动画
function RotateListImg(ImgSrc, index) {
    $("#gameLevel li").eq(index).find(".level-item .pic").transition({
        transform: "rotateY(360deg)"
    }, 800, 'in-out').find("img").attr("src", ImgSrc);
};
// 大扑克向小扑克移动动画
function JackMove() {
    $("#bgJack").transition({
        transform: "translate(2.44rem,0.44rem) scale(0.763,0.769)"
    }, 1000, "ease");
};
// 移动结束
function MoveEnd() {
    $("#bgJack").hide().find("img").css({
        opacity: 0
    }).attr("src", urlStr + "/JackBack.png");
};
// 大扑克图片重新出现
function ImgOpacity() {
    $("#bgJack").removeAttr("style");
    $("#bgJack img").transition({
        opacity: 1
    }, 200, "in-out");
};
// 继续按钮及开始闯关按钮动画效果
function nextLevel(ImgSrc, SmallImgSrc, initLevel, pokerPoint) {
    $(".guessWarn").hide();
    $("#warnText").show();
    RotateListImg(SmallImgSrc, initLevel);
    RotateJack(ImgSrc);
    $("#guessNext").attr("disabled", "disabled");
    setTimeout(JackMove(), 1100);
    setTimeout(function () {
        $("#smallJack").show().find("img").attr("src", ImgSrc);
        MoveEnd();
        ImgOpacity();
        if (pokerPoint === 13) {
            $("#toBig").attr("disabled", "disabled").attr("isBan","ban").find(".guessBtn div").css({
                color: "#50476a"
            });
            if($("#toSmall").attr("isBan") === "ban"){
                $("#toSmall").removeAttr("isBan")
            }
            $("#toSmall,#toRed,#toBlack").removeAttr("disabled");
        } else if (pokerPoint === 1) {
            $("#toSmall").attr("disabled", "disabled").attr("isBan","ban").find(".guessBtn div").css({
                color: "#50476a"
            });
            if($("#toBig").attr("isBan") === "ban"){
                $("#toBig").removeAttr("isBan")
            }
            $("#toBig,#toRed,#toBlack").removeAttr("disabled");
        } else {
            $("#guess button").removeAttr("disabled");
        }
    }, 2200);
};
// 创建关数列表
function createList(el, getType, ImgSrc, beansNum) {
    var createList = $("#list").html();
    createList = createList.replace("{{getType}}", getType);
    createList = createList.replace("{{src}}", ImgSrc);
    createList = createList.replace("{{beansNum}}", showBeans(beansNum, false));
    var $createList = createList;
    el.html("");
    el.append($createList);
};
// 根据用户返回创建投注
function createChip(data) {
    var createChip = $("#betList").html();
    createChip = createChip.replace("{{val}}", data);
    createChip = createChip.replace("{{src}}", urlStr + "/chip" + data + ".png");
    var $createChip = createChip;
    $("#chips").append($createChip);
};
// 用户金豆显示
function userGoldAll(data) {
    $("#BeansNum").html(showBeans(data, true));
};
// 记录表生成
function createRecordList(id, date, second, recordContent, recordName, recordGet) {
    var createRecordList = $("#forRecordList").html();
    createRecordList = createRecordList.replace("{{id}}", id);
    createRecordList = createRecordList.replace("{{date}}", date);
    createRecordList = createRecordList.replace("{{second}}", second);
    createRecordList = createRecordList.replace("{{recordContent}}", recordContent);
    createRecordList = createRecordList.replace("{{recordName}}", recordName);
    if (recordGet > 0) {
        recordGet = "共中" + recordGet + "金豆";
    } else if (recordGet <= 0) {
        recordGet = "未中奖";
    }
    createRecordList = createRecordList.replace("{{recordGet}}", recordGet);
    var $createRecordList = createRecordList;
    $("#recordList").append($createRecordList);
};
// 记录详情
function createRoundContent(content, el) {
    var createRoundContent = $("#forRoundContent").html();
    createRoundContent = createRoundContent.replace("{{content}}", content);
    var $createRoundContent = createRoundContent;
    el.append($createRoundContent);
};
// 判断用户的客户端
function isAndroidIOS() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 || u.indexOf("Linux") > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf("iPad") > -1 || u.indexOf("iPhone") > -1 || u.indexOf("Mac OS") > -1;
    if (isAndroid) {
        return true;
    }
    if (isIOS) {
        return false;
    }
};
// 金豆显示规则
function showBeans(goldBeans, isUserBeans) {
    if (goldBeans < 1000) {
        goldBeans = goldBeans;
    } else if (goldBeans < 10000) {
        goldBeans = (((Math.floor(goldBeans / 100)) % 10) === 0 ? (Math.floor(goldBeans / 100)) / 10 + ".0" : (Math.floor(goldBeans / 100)) / 10) + "K"
    } else if (goldBeans < 100000) {
        goldBeans = (((Math.floor(goldBeans / 1000)) % 10) === 0 ? (Math.floor(goldBeans / 1000)) / 10 + ".0" : (Math.floor(goldBeans / 1000)) / 10) + "W"
    } else if (goldBeans < 10000000000000000) {
        if (isUserBeans) {
            goldBeans = (((Math.floor(goldBeans / 1000)) % 10) === 0 ? (Math.floor(goldBeans / 1000)) / 10 + ".0" : (Math.floor(goldBeans / 1000)) / 10) + "W"
        } else {
            goldBeans = (Math.floor(goldBeans / 10000)) + "W"
        }
    }
    return goldBeans;
}
/**
 * @function 增加加奖关数
 * @param data  后台返回数据
 */
function addAward(data) {
    var levelArr = [];
    var valueArr = [];
    for (var key in data) {
        levelArr.push(key);
        valueArr.push(data[key]);
    }
    for (var i = 0; i < levelArr.length; i++) {
        $("#gameLevel li").eq(clickIndex - levelArr[i]).html("加奖" + (valueArr[i] * 100) + "%");
    }
}
//加A，13大小不可点击
function addDisabled(value) {
    if (value === 13) {
        $("#toBig").attr("disabled", "disabled").attr("isBan","ban").find(".guessBtn div").css({
            color: "#50476a"
        });
    } else if (value === 1) {
        $("#toSmall").attr("disabled", "disabled").attr("isBan","ban").find(".guessBtn div").css({
            color: "#50476a"
        });
    }
}



