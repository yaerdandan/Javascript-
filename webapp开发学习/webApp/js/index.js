
document.addEventListener("touchstart", function (e) {
    e.preventDefault();
})
navShow();
newSwiper();
scrollPic();


function navShow() {
    var btn = document.querySelector("#menuBtn");
    var nav = document.querySelector("#nav");
    btn.addEventListener(
        "touchstart",
        function (e) {
            if (btn.className == "menuBtnClose") {
                btn.className = "menuBtnShow";
                nav.style.display = "block";
            } else {
                btn.className = "menuBtnClose";
                nav.style.display = "none";
            }
            e.stopPropagation();
        }
    );
    nav.addEventListener("touchstart", function (e) {
        e.stopPropagation();
    });
    document.addEventListener(
        "touchstart",
        function () {
            if (btn.className == "menuBtnShow") {
                btn.className = "menuBtnClose";
                nav.style.display = "none";
            }
        }
    );
}
tab();

function tab() {
    var tabList = document.querySelectorAll(".tabList");
    var tabNav = document.querySelectorAll(".tabNav");
    var width = tabNav[0].offsetWidth;
    for (var i = 0; i < tabNav.length; i++) {
        swipe(tabNav[i], tabList[i]);
    }

    function swipe(nav, list) {
        cssTransform(list, "translateX", -width);
        var startPoint = 0;
        var startX = 0;
        var now = 0;
        var isMove = true;
        var isFirst = true;
        var next = document.querySelectorAll(".tabNext");
        var isLoad = false;
        var navA = nav.getElementsByTagName("a");
        var navActive = nav.getElementsByTagName('span')[0];
        list.addEventListener(
            "touchstart",
            function (e) {
                list.style.transition = "none";
                startPoint = e.changedTouches[0];
                startX = cssTransform(list, "translateX");
                isMove = true;
                isFirst = true;
            }
        );
        list.addEventListener(
            "touchmove",
            function (e) {
                if (isLoad) {
                    return;
                }
                if (!isMove) {
                    return;
                }
                var nowPoint = e.changedTouches[0];
                var disX = nowPoint.pageX - startPoint.pageX;
                var disY = nowPoint.pageY - startPoint.pageY;
                if (isFirst) {
                    isFirst = false;
                    if (Math.abs(disY) > Math.abs(disX)) {
                        isMove = false;
                    }
                }
                if (isMove) {
                    cssTransform(list, "translateX", startX + disX);
                }
                if (Math.abs(disX) > width / 2) {
                    end(disX);
                }
            }
        );
        list.addEventListener(
            "touchend",
            function () {
                if (isLoad) {
                    return;
                }
                list.style.transition = ".25s";
                cssTransform(list, "translateX", -width);
            }
        )

        function end(disX) {
            isLoad = true;
            var dir = disX / Math.abs(disX); //正 右侧  负左侧
            var target = dir > 0 ? 0 : -2 * width;
            now -= dir;
            if (now < 0) {
                now = navA.length - 1;
            }
            if (now >= navA.length) {
                now = 0;
            }
            list.style.transition = "300ms";
            cssTransform(list, "translateX", target);
            // list.addEventListener(
            //     'WebkitTransformEnd',
            //     trandEnd()
            // );
            list.addEventListener(
                'transformEnd',
                trandEnd()
            )
        }

        function trandEnd() {
            var left = navA[now].offsetLeft;
            cssTransform(navActive, "translateX", left);
            list.removeEventListener(
                "webkitTransitionEnd",
                function () {

                }
            );
            list.removeEventListener(
                "transitionend",
                function () {

                }
            );
            for (var i = 0; i < next.length; i++) {
                next[i].style.opacity = 1;
            }
            setTimeout(
                function () {
                        var tabShow = document.querySelector(".tabShow");
                        tabShow.innerHTML ="";
                        $.ajax({
                            type: "GET",
                            url: "https://api.bzqll.com/music/netease/songList?key=579621905&id=3778678&limit=10&offset=0",
                            success: function (res) {
                                var data = res.data.songs;
                                for (var i = 0; i < 6; i++) {
                                    tabShow.innerHTML += "<li><a href=details.html?id=" + data[i]["id"] + "><img src=" + data[i]["pic"] + "><span>" + data[i]["name"] + "</span></a></li>";
                                }
                            }
                        });
                    list.style.transition = "none";
                    cssTransform(list, "translateX", -width);
                    isLoad = false;
                    for (var i = 0; i < next.length; i++) {
                        next[i].style.opacity = 0;
                    }
                }, 1000
            )
        }
    }
}

function newSwiper() {
    var navScroll = document.querySelector("#navScroll");
    var navs = document.querySelector("#navs");
    var startPoint = 0; //初始点击X轴位置
    var startX = 0; //初始滑动的距离
    var minX = navScroll.clientWidth - navs.offsetWidth; //navScroll的可视实际内容的宽度减去navs的宽度
    var step = 1;
    var lastX = 0; //上次距离
    var lastTime = 0; //上次时间戳
    var lastDis = 0;
    var lastTimeDis = 0;
    navScroll.addEventListener(
        "touchstart",
        function (e) {
            navs.style.transition = "none";
            startPoint = e.changedTouches[0].pageX;
            startX = cssTransform(navs, "translateX");
            step = 1;
            lastX = lastX;
            lastTime = new Date().getTime();
            lastDis = 0;
            lastTimeDis = 0;
        }
    );
    navScroll.addEventListener(
        "touchmove",
        function (e) {
            var nowPoint = e.changedTouches[0].pageX;
            var dis = nowPoint - startPoint;
            var left = startX + dis;
            var nowTime = new Date().getTime();
            if (left > 0) {
                step = 1 - left / navScroll.clientWidth; //根据超出的长度计算系数的大小，超出的越大 系数越小
                left = parseInt(left * step);
            }
            if (left < minX) {
                var over = minX - left;
                step = 1 - over / navScroll.clientWidth;
                over = parseInt(over * step);
                left = minX - over;
            }
            lastDis = left - lastX;
            lastTimeDis = nowTime - lastTime;
            lastX = left;
            lastTime = nowTime;
            cssTransform(navs, "translateX", left);
        }
    );
    navScroll.addEventListener(
        "touchend",
        function () {
            var speed = (lastDis / lastTimeDis) * 300; //用距离差值/时间差值 = 速度  速度*系数 = 缓冲距离；
            var left = cssTransform(navs, "translateX");
            var target = left + speed;
            var type = "cubic-bezier(.34,.92,.58,.9)";
            var time = Math.abs(speed * .9);
            time = time < 300 ? 300 : time;
            if (target > 0) {
                target = 0;
                type = "cubic-bezier(.08,1.44,.6,1.46)";
            }
            if (target < minX) {
                target = minX;
                type = "cubic-bezier(.08,1.44,.6,1.46)";
            }
            navs.style.transition = time + "ms " + type;
            cssTransform(navs, "translateX", target);
        }
    )
};
//滑屏轮播
function scrollPic() {
    var wrap = document.querySelector("#picTab");
    var list = document.querySelector("#picList");
    list.innerHTML += list.innerHTML;
    var lis = document.querySelectorAll("#picList li");
    var css = document.createElement("style");
    var nav = document.querySelectorAll("#picNav span");
    var style = "#wrap{height:" + lis[0].offsetHeight + "px}";
    var timer = 0;
    style += "#picList{width:" + lis.length + "00%}";
    style += "#picList li{width:" + (1 / lis.length * 100) + "%}";
    css.innerHTML += style;
    document.head.appendChild(css);
    var startPoint = 0;
    var startX = 0;
    var now = 0;
    var isMove = true;
    var isFirst = true;
    cssTransform(list, "translateX", 0);
    auto();
    wrap.addEventListener(
        "touchstart",
        function (e) {
            clearInterval(timer);
            list.style.transition = "none";
            var translateX = cssTransform(list, "translateX");
            now = Math.round(-translateX / wrap.offsetWidth);
            if (now == 0) {
                now = nav.length;
            }
            if (now == lis.length - 1) {
                now = nav.length - 1;
            }
            cssTransform(list, "translateX", -now * wrap.offsetWidth);
            startPoint = e.changedTouches[0];
            startX = cssTransform(list, "translateX");
            isMove = true;
            isFirst = true;
        }
    );
    wrap.addEventListener(
        "touchmove",
        function (e) {
            if (!isMove) {
                return;
            }
            var nowPoint = e.changedTouches[0];
            var disX = nowPoint.pageX - startPoint.pageX;
            var disY = nowPoint.pageY - startPoint.pageY;
            if (isFirst) {
                isFirst = false;
                if (Math.abs(disY) > Math.abs(disX)) {
                    isMove = false;
                }
            }
            if (isMove) {
                cssTransform(list, "translateX", startX + disX);
            }
        }
    );
    wrap.addEventListener(
        "touchend",
        function () {
            var translateX = cssTransform(list, 'translateX');
            now = Math.round(-translateX / wrap.offsetWidth);
            tab();
        }
    );

    function auto() {
        clearInterval(timer);
        timer = setInterval(
            function () {
                if (now == lis.length - 1) {
                    now = nav.length;
                }
                list.style.transition = "none";
                cssTransform(list, "translateX", -now * wrap.offsetWidth);
                setTimeout(
                    function () {
                        now++;
                        tab();
                    }, 30
                )
            }, 2000
        )
    };

    function tab() {
        list.style.transition = ".5s";
        cssTransform(list, "translateX", -now * wrap.offsetWidth);
        for (var i = 0; i < nav.length; i++) {
            nav[i].className = "";
        }
        nav[now % nav.length].className = "active";
    }
}