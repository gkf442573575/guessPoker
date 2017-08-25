$("#guessRule").click(function () {
    $("#ruleWindow").show().transition({
        bottom: "0"
    }, 500, "in-out");
    setTimeout(function () {
        $("#blank-close-rule").show();
        $("#recordWindow").hide();
    }, 500);
    $("body").addClass("over");
    $("#recordWindow").transition({
        bottom: "-13.12rem"
    }, 500, "in-out");
    $("#blank-close-record").hide();
});
$("#guessRecord").click(function () {
    $("#recordWindow").show().transition({
        bottom: "0"
    }, 500, "in-out");
    $("body").addClass("over");
    setTimeout(function () {
        $("#blank-close-record").show();
        $("#ruleWindow").hide();
    }, 500);
    $("#ruleWindow").transition({
        bottom: "-13.12rem"
    }, 500, "in-out");
    $("#blank-close-rule").hide();
});
$("#blank-close-rule").click(function () {
    $("#ruleWindow").transition({
        bottom: "-13.12rem"
    }, 500, "in-out");
    setTimeout(function () {
        $("#ruleWindow").hide();
        $("body").removeClass("over");
    }, 500);
    $(this).hide();

});
$("#blank-close-record").click(function () {
    $("#recordWindow").transition({
        bottom: "-13.12rem"
    }, 500, "in-out");
    setTimeout(function () {
        $("#recordWindow").hide();
        $("body").removeClass("over");
    }, 500);
    $(this).hide();

});
var dpr = parseInt($("html").attr("data-dpr"));
var bodyWidth = document.body.clientWidth;
if (dpr === 1 && bodyWidth >= 600) {
    $("#guess").css({
        width: bodyWidth - 296 + "px"
    })
}


