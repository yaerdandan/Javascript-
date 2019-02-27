$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37: //left
            if (moveLeft()) {
                getScore();
                createOneNumber();
                setTimeout("isGameOver()",400);
            }
            break;
        case 38: //up
            if (moveUp()) {
                getScore();
                createOneNumber();
                setTimeout("isGameOver()",400);
            } break;
        case 39: //right
            if (moveRight()) {
                getScore();
                createOneNumber();
                setTimeout("isGameOver()",400);
            } break;
        case 40: //down
            if (moveDown()) {
                getScore();
                createOneNumber();
                setTimeout("isGameOver()",400);
            }
    }
})


//判断能否左移
function canMoveLeft(board){
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            if(board[i][j] != 0 && j!=0){
                if(board[i][j-1] == 0 || board[i][j-1] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//判断能否右移
function canMoveRight(board){
    for(var i =0;i<4;i++){
        for(var j =0;j<4;j++){
            if(board[i][j] !=0 && j!=3){
                if(board[i][j+1] == 0 || board[i][j+1] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//判断是否上移
function canMoveUp(board){
    for(var i =0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j] !=0 && i!=0){
                if(board[i-1][j] == 0 || board[i-1][j] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}
//判断能否下移
function canMoveDown(board){
    for(var i = 0;i<4;i++){
        for(var j =0;j<4;j++){
            if(board[i][j] !=0 && i!=3){
                if(board[i+1][j] ==0 || board[i+1][j] == board[i][j]){
                    return true;
                }
            }
        }
    }return false;
}
//判断水平是否有障碍物
function noBlockHorizontal(row,col1,col2,board){
    for(var i = col1+1;i<col2;i++){
        if(board[row][i]!=0){
            return false;
        }
    }
    return true;
}
//判断竖直方向是否有障碍物
function noBlockVertical(col,row1,row2,board){
    for(var i =row1+1;i<row2;i++){
        if(board[i][col]!=0){
            return false;
        }
    }
    return true;
}

//实现移动格子的样式变动
function showMoveAnimate(fromx,fromy,tox,toy){
    var numberCell = $("#number-cell-"+fromx+"-"+fromy);
    numberCell.animate({
        top:getTop(tox,toy),
        left:getLeft(tox,toy)
    },200);
}

//判断能否合并的数组织置为0
function isaddedArray(){
    for(var i = 0;i<4;i++){
        for(var j=0;j<4;j++){
            added[i][j] = 0;
        }
    }
}


//左移
function moveLeft(){
    //判断能否左移
    if(!canMoveLeft(board)){return false};
    //每次循环判断前调用
    isaddedArray();
    //开始移动
    for(var i = 0;i<4;i++){
        for(var j =1;j<4;j++){ //第一列数字不能左移
            if(board[i][j] != 0){
                //(i,j)左侧的元素
                for(var k =0;k<j;k++){
                    //落脚的位置是否为空 &&中间没有障碍物
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        showMoveAnimate(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置数字和本身数字相等 && 中间没有障碍物
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board)){
                        showMoveAnimate(i,j,i,k);
                        if(added[i][k] != 0){ //目标落脚点是否完成过合并
                            board[i][k+1] = board[i][j];
                            board[i][j] = 0;
                        }else{
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score += board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
//右移
function moveRight(){
    if(!canMoveRight(board)) return false;

    isaddedArray();
    for(var i=0;i<4;i++){
        for(var j =2;j>=0;j--){
            for(var k = 3;k>j;k--){
                //(i,j)右边的元素
                if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                    showMoveAnimate(i,j,i,k);
                    board[i][k] = board[i][j];
                    board[i][j] = 0;
                    continue;
                }
                //落脚的位置和本来的数字相等 && 中间没有障碍物
                else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board)){
                    showMoveAnimate(i,j,i,k);
                    if(added[i][k]!=0){
                        board[i][k-1] = board[i][j];
                        board[i][j] = 0;
                    }else{
                        board[i][k] +=board[i][j];
                        board[i][j] = 0;
                        added[i][k] = 1;
                        score += board[i][k];
                    }
                    continue;
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
//上移
function moveUp(){
    if(!canMoveUp(board)) return false;
    isaddedArray();

    for(var j=0;j<4;j++){
        for(var i =1;i<4;i++){
            for(var k =0;k<i;k++){
                //落脚位置的是否为空 && 中间没有障碍物
                if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                    showMoveAnimate(i,j,k,j);
                    board[k][j] = board[i][j];
                    board[i][j] = 0;
                    continue;
                }
                 //落脚的位置和本来的数字相等 && 中间没有障碍物
                 else if(board[k][j] == board[i][j] && noBlockVertical(j,k,i,board)){
                     showMoveAnimate(i,j,k,j);
                     if(added[k][j] !=0){
                         board[k+1][j] = board[i][j];
                         board[i][j] = 0;
                     }else{
                         board[k][j] += board[i][j];
                         board[i][j]= 0;
                         added[k][j] = 1;
                         score +=board[k][j];
                     }
                     continue;
                 }
            }
        }
    }
    setTimeout('updateBoardView()',200);
    return true;
}
//下移
function moveDown(){
    if(!canMoveDown(board)) return false;
    isaddedArray();

    for(var j=0;j<4;j++){
        for(var i =2;i>=0;i--){
            for(var k =3;k>i;k--){
                //落脚位置的是否为空 && 中间没有障碍物
                if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                    showMoveAnimate(i,j,k,j);
                    board[k][j] = board[i][j];
                    board[i][j] = 0;
                    continue;
                }
                 //落脚的位置和本来的数字相等 && 中间没有障碍物
                 else if(board[k][j] == board[i][j] && noBlockVertical(j,i,k,board)){
                     showMoveAnimate(i,j,k,j);
                     if(added[k][j] !=0){
                         board[k+1][j] = board[i][j];
                         board[i][j] = 0;
                     }else{
                         board[k][j] += board[i][j];
                         board[i][j]= 0;
                         added[k][j] = 1;
                         score +=board[k][j];
                     }
                     continue;
                 }
            }
        }
    }
    setTimeout('updateBoardView()',200);
    return true;
}

