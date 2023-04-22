const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const up = document.querySelector('#up');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const down = document.querySelector('#down');

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize', setCanvasSize);
up.addEventListener('click', goUp);
left.addEventListener('click', goLeft);
right.addEventListener('click', goRight);
down.addEventListener('click', goDown);

document.addEventListener('keydown', moveKey);

let canvasSize;
let elementSize;
let positionPlayer = {
    x: undefined,
    y: undefined,
}

function setCanvasSize(){
    if(window.innerHeight>window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }else{
        canvasSize = window.innerHeight * 0.8;
    }
    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);
    elementSize=(canvasSize/10)-1;
    startGame();
}

let level = 0;
let mapa = maps[level];
let rowMap = mapa.trim().split('\n');
let colRowMap = rowMap.map(row => row.trim().split(''));

function startGame(){
    
    game.font = elementSize + 'px Verdana';
    game.textAlign = '';
    
    game.clearRect(0,0, canvasSize,canvasSize);
    
    colRowMap.forEach((row,rowId) => {
        row.forEach((col, colId)=>{
            const emoji = emojis[col];
            const positionX = elementSize*colId;
            const positionY = elementSize*(rowId+1);
            game.fillText(emoji,positionX,positionY);

            if(col == "O" && positionPlayer.x === undefined){
                positionPlayer.x = colId;
                positionPlayer.y = rowId+1;
            }
        })
    });
    movePlayer();
    // for(let i=1;i<11;i++){
    //     for(let j=0;j<10;j++){
    //         game.fillText(emojis[colRowMap[i-1][j]],elementSize*j,elementSize*i);
    //     }
    // }
}

function movePlayer(){
    game.fillText(emojis['PLAYER'],positionPlayer.x*elementSize,positionPlayer.y*elementSize);
    if(positionPlayer.x!=undefined && colRowMap[positionPlayer.y-1][positionPlayer.x]==='X'){
        console.log('explosion!!!');
        gameOver();
        startGame();
    }else if(positionPlayer.x!=undefined && colRowMap[positionPlayer.y-1][positionPlayer.x]==='I'){
        nextLevel();
        startGame();
    }   
}

function nextLevel(){
    level++;
    mapa = maps[level];
    if(!mapa){
        finishGame();
        positionPlayer.x = undefined;
        positionPlayer.y = undefined;
        return;
    }else{
        rowMap = mapa.trim().split('\n');
        colRowMap = rowMap.map(row => row.trim().split(''));
    }

}

function finishGame(){

    console.log("Finalizaste el juego.")

}
    

function gameOver(){
    positionPlayer.x = undefined;
    positionPlayer.y = undefined;
}
// function removePlayer(){
//     game.clearRect(positionPlayer.x,positionPlayer.y,elementSize+7,elementSize+10);
// }

function goUp(){
    if(positionPlayer.y>1){
        positionPlayer.y -=1;
        //removePlayer();
        startGame();
        // movePlayer();
    }

}
function goLeft(){
    if(positionPlayer.x>0){
        // positionPlayer.y -= elementSize;
        // removePlayer();
        // positionPlayer.y += elementSize;
        positionPlayer.x -= 1;
        startGame();
        // movePlayer();
    }
}
function goRight(){
    if(positionPlayer.x<9){
        // positionPlayer.y -= elementSize;
        // removePlayer();
        // positionPlayer.y += elementSize;
        positionPlayer.x += 1;
        startGame();
        // movePlayer(); 
    }
}
function goDown(){
    if(positionPlayer.y<10){
        // positionPlayer.y -= elementSize;
        // removePlayer();
        positionPlayer.y += 1;
        startGame();
        // movePlayer();    
    }
}
function moveKey(event){
    switch(event.key){
        case 'ArrowUp': goUp();
        break;
        case 'ArrowLeft': goLeft();
        break;
        case 'ArrowRight': goRight();
        break;
        case 'ArrowDown': goDown();
        break;
    }
};