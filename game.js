const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const up = document.querySelector('#up');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const down = document.querySelector('#down');
const livesSpan = document.querySelector('#lives');
const timeSpan = document.querySelector ('#time');
const recordSpan = document.querySelector('#record');

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
let lives = 3;

let timeStart;
let timePlayer={
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
    cenSeconds: undefined,
};
let timeInterval;

let mapa = maps[level];
let rowMap = mapa.trim().split('\n');
let colRowMap = rowMap.map(row => row.trim().split(''));

function startGame(){
    
    game.font = elementSize + 'px Verdana';
    game.textAlign = '';
    
    game.clearRect(0,0, canvasSize,canvasSize);

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
    }
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
    if(localStorage.length != 0){
        getObject =  JSON.parse(localStorage.getItem('Record'));
        recordSpan.textContent=`0${getObject.hours}`.slice(-2)+':' + `0${getObject.minutes}`.slice(-2) + ':'+`0${getObject.seconds}`.slice(-2)+':'+`0${getObject.cenSeconds}`.slice(-2);;
    }
    showLives();
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
        failLevel();
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
        positionPlayer.x = undefined;
        positionPlayer.y = undefined;
        finishGame();
        return;
    }else{
        rowMap = mapa.trim().split('\n');
        colRowMap = rowMap.map(row => row.trim().split(''));
    }

}

let i=0;
let getObject;

function finishGame(){
    console.log("Finalizaste el juego.");
    clearInterval(timeInterval);
    showRecord();
    return;
}

function showRecord(){
    if(localStorage.length == 0 &&timePlayer.cenSeconds!=undefined){
        // let re = `0${timePlayer.hours}`.slice(-2)+':' + `0${timePlayer.minutes}`.slice(-2) + ':'+`0${timePlayer.seconds}`.slice(-2)+':'+`0${timePlayer.cenSeconds}`.slice(-2);
        localStorage.setItem('Record',JSON.stringify(timePlayer));
    }else{
        getObject = JSON.parse(localStorage.getItem('Record'));
        if(timePlayer.hours<getObject.hours){
            localStorage.setItem('Record',JSON.stringify(timePlayer));
        }else if(timePlayer.hours==getObject.hours){
            if(timePlayer.minutes<getObject.minutes){
                localStorage.setItem('Record',JSON.stringify(timePlayer));
            }else if(timePlayer.minutes==getObject.minutes){
                if(timePlayer.seconds<getObject.seconds&&timePlayer.cenSeconds<=getObject.cenSeconds){
                    localStorage.setItem('Record',JSON.stringify(timePlayer));
                }else if(timePlayer.seconds==getObject.seconds){
                    if(timePlayer.cenSeconds<getObject.cenSeconds){
                        localStorage.setItem('Record',JSON.stringify(timePlayer));
                    }else if(timePlayer.cenSeconds==getObject.cenSeconds){
                        console.log('No superaste el record.')
                    }
                }
            }
        }
    };
    getObject = JSON.parse(localStorage.getItem('Record'));
    recordSpan.textContent=`0${getObject.hours}`.slice(-2)+':' + `0${getObject.minutes}`.slice(-2) + ':'+`0${getObject.seconds}`.slice(-2)+':'+`0${getObject.cenSeconds}`.slice(-2);
}
    

function failLevel(){
    lives--;
    if(lives<=0){
        level = 0;
        mapa = maps[level];
        rowMap = mapa.trim().split('\n');
        colRowMap = rowMap.map(row => row.trim().split(''));
        lives = 3;
        timeStart = undefined;
    }
    positionPlayer.x = undefined;
    positionPlayer.y = undefined;
}

function showLives(){
    livesSpan.textContent = emojis['HEART'].repeat(lives);
}

function showTime(){
    const ms = Date.now() - timeStart;
    const cs = Math.trunc(ms/10) % 100;
    const s = Math.trunc(ms/1000) % 60;
    const m = Math.trunc(ms/60000) % 60;
    const h = Math.trunc(ms/3600000) % 24;
    timeSpan.textContent = `0${h}`.slice(-2)+':' + `0${m}`.slice(-2) + ':'+`0${s}`.slice(-2)+':'+`0${cs}`.slice(-2);
    timePlayer.hours = h;
    timePlayer.minutes = m;
    timePlayer.seconds = s;
    timePlayer.cenSeconds = cs;
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