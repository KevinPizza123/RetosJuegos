
/*****  GLOBAL VARIABLES  *****/
let canvas
let ctx;
let snake;
let apple;
let score;
let hScore; // high score

const length = 25; // numero filas que se asignaran tambien al numero de columnas
let size; // tamaño que cada cuadrado de la serpiente
let snakeColor = 'black';
let appleColor = 'blue';

let interval_id; // guardara el intervalo para poder iniciarlo o pararlo


// retorna un numero aleatorio entero, entre el minimo(incluido) y maximo(excluido)
const getRandomInt = ( max, min ) => {
    return Math.floor(Math.random() * (max - min)) + min;
}


/*****  CLASSES  *****/

class Square {

    x = 0;
    y = 0;
    size = 0;

    constructor(x = 0, y = 0, size = 10){
        this.x = x;
        this.y = y;
        this.size = size;
    }

    collided(square) {
        if(this.x == square.x && this.y == square.y){
            return true;
        }else{
            return false;
        }
    }
}

class Food extends Square {

    color = 'orange';
    min = 1;
    max = length - 1;

    constructor(x, y, s, color) {
        super(x, y, s);
        this.color = color;
    }

    setRandomPosition() {
        const min = this.min;
        const max = this.max;
        const s = this.size;
        this.x = getRandomInt(min, max) * s;
        this.y = getRandomInt(min, max) * s;
    }

}

class Snake {

    _tails = [];
    dirX = 1;
    dirY = 0;
    size = 10;
    color = 'black';

    constructor(x = 0, y = 0, size = 10, color = 'black') {
        this.size = size;
        this.color = color;
        this._tails.push(new Square(x, y, size));
        console.log('snake created!');
    }

    addTail(){
        const { x, y, size} = this._tails[this._tails.length - 1];
        this._tails.push(new Square(x, y, size));
    }

    move() {
        const { x, y, size} = this._tails[0];
        this._tails.unshift(new Square(x + (this.dirX * size), y + (this.dirY * size), size));

        this._tails.pop();
    }

}


/*****  GAME FUNCTIONS  *****/

const getHighScore = () => {
    const score = localStorage.getItem('high_score');

    if(score){
        console.log(score);
        return score;
    }else{
        console.log('no existe el high score');
        return 0;
    }
}
const setHighScore = ( nScore ) => {
    hScore = nScore;
    localStorage.setItem('high_score', nScore);
}
const addScore = () => {
    score++;
    if(score > hScore){
        setHighScore(score);
    }
}

const canvasPrint = (text, color = 'black', px = 12, x, y, clear = false, aligment) => {
    const w = canvas.width;
    const h = canvas.height;
    if( clear ) ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = color;

    ctx.font = px + 'px Verdana';
    if( aligment ) {
        ctx.textAlign = aligment;
        ctx.fillText(text, w / 2, y);

    }else{
        ctx.textAlign = 'start';
        ctx.fillText(text, x, y);
    }

}

const ShowMenu = () => {
    const px = ( canvas.width * 24 / 500 );
    canvasPrint('Presiona ESPACIO para jugar', 'black', px, 0, canvas.height / 2, true, 'center');
}

const newGame = () => {
    snake = new Snake(80, 80, size);
    apple = new Food(80, 120, size, appleColor);
    hScore = getHighScore();
    score = 0;
    hScore = getHighScore();
    interval_id = setInterval(update, 120);
    addEventListener('keydown', changeDirection, true);
}

const GameOver = () => {
    // paramos el setInterval
    clearInterval(interval_id);
    interval_id = null;
    
    // removemos el evento para cambiar la direccion de la serpiente
    removeEventListener('keydown', changeDirection, true);

    setTimeout(() => {
        // mostramos la pantalla de gameover
        const px = ( canvas.width * 24 / 500 );
        canvasPrint('GAME OVER', 'red', px, 0, canvas.height / 2, true, 'center');

        setTimeout(() => {
            // mostramos la pantalla del menu
            ShowMenu();
        }, 2500)
    }, 120);
}

const drawGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // dibujamos a la serpiente
    let size = snake.size;
    ctx.fillStyle = snake.color;
    snake._tails.forEach( tail => {
        ctx.fillRect(tail.x, tail.y, size, size);
    });

    // dibujamos la comida
    let foodSize = apple.size;
    ctx.fillStyle = apple.color;
    ctx.fillRect(apple.x, apple.y, foodSize, foodSize);

    // dibujamos los limites
    const limit = (length - 1) * size;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(size, size);
    ctx.lineTo(limit, size);
    ctx.moveTo(limit, size);
    ctx.lineTo(limit, limit);
    ctx.moveTo(limit, limit);
    ctx.lineTo(size, limit);
    ctx.moveTo(size, limit);
    ctx.lineTo(size, size);
    ctx.closePath();
    ctx.stroke();

    // dibujamos el score y el high score
    // score
    canvasPrint(`score: ${score}`, 'black', size-2, size / 2, size-3, false);
    // high score
    canvasPrint(`high score: ${hScore}`, 'black', size-2, limit - size*8, size-3, false);

}


const update = () => {

    snake.move();

    snake._tails.forEach( (tail, i) => {
        if( i > 0){
            if(snake._tails[0].collided(tail)){
                // gameover
                GameOver();
            }
        }
    });

    if(snake._tails[0].collided(apple)){
        apple.setRandomPosition();
        snake.addTail();
        addScore();
    }

    const head = snake._tails[0];
    const limit = (length - 2) * size;
    if(head.x < size || head.y > limit || head.x > limit || head.y < size ){
        // gameover
        GameOver();
    }

    drawGame();
    
}


const changeDirection = e => {
    const dx = snake.dirX;
    const dy = snake.dirY;
    switch ( e.code ) {
        case 'ArrowLeft':
            // left
            console.log('left');
            snake.dirX = (dx == 0)? -1:dx;
            snake.dirY = 0;
        break;
        case 'ArrowUp':
            // up
            console.log('up');
            snake.dirY = (dy == 0)? -1:dy;
            snake.dirX = 0;
        break;
        case 'ArrowRight':
            // right
            console.log('right');
            snake.dirX = (dx == 0)? 1:dx;
            snake.dirY = 0;
        break;
        case 'ArrowDown':
            // down
            console.log('down');
            snake.dirY = (dy == 0)? 1:dy;
            snake.dirX = 0;
        break;
    }
}

const getCanvas = async( id = '' ) => {
    try {
        const canvas = document.querySelector('#' + id);
        return canvas;
    } catch( err ) {
        console.log('canvas error');
        throw err;
    }
}
const getContext = async( canvas ) => {
    try {
        const context = canvas.getContext('2d');
        return context;
    } catch( err ) {
        console.log('context error');
        throw err;
    }
}

/*****  GLOBAL VARIABLES  *****/

window.onload = () => {

    console.log('window loaded');

    getCanvas('canvasGame')
        .then( c => {
            canvas = c;
            return getContext( canvas );
        })
        .then( context => {
            
            ctx = context;
            console.log('%ccanvas and context created' , 'background: #222; color: #bada55');
            size = canvas.width / length;

            addEventListener('keydown',(e) => {
                if(e.code == 'Space'){
                    if(!interval_id){
                        // creamos nuevo juego
                        newGame();
                    }
                }
            })
            ShowMenu( canvas, context);
        
        })
        .catch( err => console.log(err));
}