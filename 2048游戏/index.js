var board = new Array();  //所有的格子
var added = new Array(); //所有格子之间的合并关系
var score = 0;   //分数

//打开页面完成的动作
$(document).ready(function() {
    newGame();
})

//初始化游戏
function newGame() {
    init();
    createOneNumber();
    createOneNumber();
}

//初始化操作
function init(){
    score = 0;
    document.getElementById("score").innerHTML = score;
    $("#gameOver").css("display","none");
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var grildCell = $("#grid-cell-"+i+"-"+j);
            grildCell.css("top",getTop(i,j));
            grildCell.css("left",getLeft(i,j));
        }
    }
    //初始化格子数组
    for(var i =0;i<4;i++){
        board[i] = new Array();
        for(var j =0;j<4;j++){
            board[i][j] = 0;
        }
    }
    //初始化判定合并的数组
    for(var i =0;i<4;i++){
        added[i] = new Array();
        for(var j =0;j<4;j++){
            added[i][j] = 0;
        }
    }
    updateBoardView();
}

//生成number-cell覆盖在gril-cell上 更新数组的前端样式
function updateBoardView(){
    $(".number-cell").remove();
    for(var i = 0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $("#number-cell-"+i+"-"+j);
            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getTop(i,j));
                theNumberCell.css('left',getLeft(i,j));
            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getTop(i,j));
                theNumberCell.css('left',getLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
       
    }
}

//随机产生格子
function createOneNumber() {
    //判断是否有空位 
    if(nospace(board)) return false;

    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy] == 0){
            break;
        }
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
    }
    var randNumber = Math.random()<0.5 ? 2 : 4;
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

//随机数字的样式
function showNumberWithAnimation(i,j,randNumber){
    var numberCell = $("#number-cell-"+i+"-"+j);
    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css("color",getNumberColor(randNumber));
    numberCell.text(randNumber);
    numberCell.animate({
        width:'100px',
        height:'100px',
        top:getTop(i,j),
        left:getLeft(i,j)
    },50);
}

//top值
function getTop(i,j){
    return 20+i*120;
}
//left值
function getLeft(i,j){
    return 20+j*120;
}

//判断数字的大小 给定背景颜色
function getNumberBackgroundColor(number) {
    switch (number) {
    case 2:
        return "#eee4da";
        break;
    case 4:
        return "#eee4da";
        break;
    case 8:
        return "#f26179";
        break;
    case 16:
        return "#f59563";
        break;
    case 32:
        return "#f67c5f";
        break;
    case 64:
        return "#f65e36";
        break;
    case 128:
        return "#edcf72";
        break;
    case 256:
        return "#edcc61";
        break;
    case 512:
        return "#9c0";
        break;
    case 1024:
        return "#3365a5";
        break;
    case 2048:
        return "#09c";
        break;
    case 4096:
        return "#a6bc";
        break;
    case 8192:
        return "#93c";
        break;
    }
    return "black";
}
//判断数字大小给定数字颜色
function getNumberColor(number) {
    if (number <= 4){
        return "#776e65";
    }
    return "white";
}

//分数变更
function getScore(){
    document.getElementById("score").innerHTML = score;
}
//在随机生成数字的时候判断16宫格中是否还有空间
function nospace(board) {
    for ( var i = 0; i < 4; i++){
        for ( var j = 0; j < 4; j++){
            if (board[i][j] == 0){
                return false;
            }
        }
    }  
    console.log(1);
    return true;
}
//没法移动
function nomove(board){
    if(canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)){
        return false;
    }
    console.log(1)
    return true;
}

//游戏结束
function isGameOver(){
    if(nospace(board) && nomove(board)){
        gameOver();
    }
}
function gameOver(){
    $("#gameOver").css("display","block");
}
