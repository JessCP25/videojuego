const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize;
let elementSize;

function setCanvasSize(){
    if(window.innerHeight>window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }else{
        canvasSize = window.innerHeight * 0.8;
    }
    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);
    elementSize = (canvasSize/10)-1;
    startGame();
}

function startGame(){
    game.font = elementSize + 'px Verdana';
    game.textAlign = '';
    for(let i=0;i<10;i++){
        for(let j=1;j<11;j++){
            game.fillText(emojis['X'],elementSize*i,elementSize*j);
        }
    }
}