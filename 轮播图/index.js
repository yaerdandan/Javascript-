var index = 0;
var box = id("all");
//获取最外层div
var inner = box.children[0];
//获取img的宽度
var imgWidth = inner.offsetWidth;
//获取ul
var ul = inner.children[0];
//获取ul中所有的li
var li = ul.children;
//获取焦点
var btn = id("btn");
//获取ol
var ol = inner.children[1];
for(var i=0;i<li.length;i++){
    var olli = document.createElement("li");
    ol.appendChild(olli);
    olli.innerHTML = (i+1);
    //在ol的li中添加自定义属性，添加索引值
    olli.setAttribute("index",i);
    //鼠标点击事件
    olli.onclick = function() {
        //先去掉所有的颜色
        for(var j=0;j<ol.children.length;j++){
            ol.children[j].removeAttribute("class");
        }
        //设置鼠标点击进来的样式
        this.className="current";
        //获取ol中li的索引值
        index = this.getAttribute("index");
        ul.style.left = -index*imgWidth+'px';
    }
}
//设置第一个ol中li的背景颜色
ol.children[0].className = "current";
//无缝轮播 复制第一张图片
ul.appendChild(ul.children[0].cloneNode(true));
// 自动轮播
var timeId=setInterval(clickHandle,3000);
//点击左侧
id("left").onclick = function() {
    if(index == 0){
        index = li.length-1;
        ul.style.left = -index*imgWidth+'px';
    }
    index--;
    ul.style.left = -index*imgWidth + 'px';
    for(var i=0;i<ol.children.length;i++){
        ol.children[i].className="";
    }
    ol.children[index].className="current";
}
// 点击右侧
id("right").onclick = clickHandle;
function clickHandle(){
    if(index == ul.children.length-1){
        ul.style.left = 0 + "px";
        index = 0;
    }
    index++;
    ul.style.left = -index*imgWidth + 'px';
    if(index ==li.length-1){
        ol.children[0].className="current";
        ol.children[ol.children.length-1].className = "";
    }else{
        for(var i=0;i<ol.children.length;i++){
            ol.children[i].className="";
        }
        ol.children[index].className="current";
    }
}
//鼠标移入轮播图
id("all").onmouseover = function (){
    clearInterval(timeId);
    btn.style.display = "block";
}
//鼠标移出轮播图
id("all").onmouseout = function (){
    btn.style.display = "none";
    timeId = setInterval(clickHandle,3000);
}
// 获取id
function id(id){
    return document.getElementById(id);
}