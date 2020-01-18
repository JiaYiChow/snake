var cvs = document.getElementById("snake");
var ctx = cvs.getContext("2d");

/* TO-DO
1. implement gamestates
2. create the snake by drawing squares on the canvas (done)
3. make the snake move direction every second (done)
4. make the snake grow after it eats the snack (done, ok why i cannot eat from the right side)
5. make the snake move by adding keyboard controls (done) */


//import the image 
const gameoverimg = new Image();
gameoverimg.src = "img/game over black and white.png";
//gamestate
const state = {
    current: 0, 
    getready: 0, 
    game: 1, 
    over: 2
}

//put all my states here 
//direction of snake 
var direction = "right"; 
var eaten = true; 

//draw the snake 
const snake = {
    length: 10, 
    x: cvs.clientWidth/2, 
    y: cvs.clientHeight/2,
    path: [],
    start: function(){
        this.x = cvs.clientWidth/2; 
        this.y = cvs.clientHeight/2; 
        this.length = 10; 

        this.path.push([this.x, this.y, "right"]);
    },
    
    //at every second, snake moves right
    right: function(){
        var lastCoor = this.path[this.path.length - 1];
        this.x = lastCoor[0];
        this.y = lastCoor[1];

        this.path.push([this.x + 10, this.y, direction]);
        ctx.clearRect(this.path[0][0], this.path[0][1], 10, 10); //remove first square
        this.path.shift(); //remove first set of coordinates from path array
    },

    left: function(){
        var lastCoor = this.path[this.path.length - 1];
        this.x = lastCoor[0];
        this.y = lastCoor[1];

        this.path.push([this.x - 10, this.y, direction]);
        ctx.clearRect(this.path[0][0], this.path[0][1], 10, 10); //remove first square
        this.path.shift(); //remove first set of coordinates from path array
    },

    //snake moves up 
    up: function(){
        var lastCoor = this.path[this.path.length - 1];
        this.x = lastCoor[0];
        this.y = lastCoor[1];

        this.path.push([this.x, this.y - 10, direction]);
        ctx.clearRect(this.path[0][0], this.path[0][1], 10, 10); //remove first square
        this.path.shift(); //remove first set of coordinates from path array
    },

    //snake moves down 
    down: function(){
        var lastCoor = this.path[this.path.length - 1];
        this.x = lastCoor[0];
        this.y = lastCoor[1];

        this.path.push([this.x, this.y + 10, direction]);
        ctx.clearRect(this.path[0][0], this.path[0][1], 10, 10); //remove first square
        this.path.shift(); //remove first set of coordinates from path array
    },
    
    //grow snake by one square when it eats a snack
    grow: function(){
        let extension = snake.path[0][2];
        switch(extension){
            case "right": 
                this.path.unshift([this.path[0][0] - 10, this.path[0][1], "right"]);
                break; 
            case "left":
                this.path.unshift([this.path[0][0] + 10, this.path[0][1], "left"]);
                break; 
            case "up":
                this.path.unshift([this.path[0][0], this.path[0][1] + 10, "up"]);
                break; 
            case "down":
                this.path.unshift([this.path[0][0], this.path[0][1] - 10, "down"]);
                break; 
            
        }
    },

    draw: function(){
        for (i = 0; i < this.path.length; i++){
            ctx.fillStyle = "#000";
            ctx.fillRect(this.path[i][0], this.path[i][1], 10, 10);
        }
    },

};

const snack = {
    x: 0, 
    y: 0,
    
    generate: function(){
        if (eaten){
            this.x = round(Math.floor(Math.random() * cvs.clientWidth));
            this.y = round(Math.floor(Math.random() * cvs.clientHeight));
            ctx.fillStyle = "#0FF";
            ctx.fillRect(this.x, this.y, 10, 10);
            eaten = false; //you only want to generate one snack at a time
        }

        isEaten();
    }
}

//check if snake has eaten snack
function isEaten(){
    if (snake.path[snake.path.length-1][0] == snack.x && snake.path[snake.path.length-1][1] == snack.y){
        eaten = true; 
        snake.grow();
    }
}
//make sure that snake eats snack nicely
function round(number){
    let smaller = Math.floor(number/10) * 10; 
    let larger = smaller + 10; 
    return (number - smaller > larger - number)? larger : smaller; 
}

//check that game is over (i also need to add when the snake eats itself)
function gameover(){
    //if snake goes out of the bounds of the canvas 
    if (snake.x < 0 || snake.x > cvs.clientWidth || 
        snake.y < 0 || snake.y > cvs.clientHeight){
        state.current = state.over;
    }

    //if the snake eats itself 
    for (i = 0; i < snake.path.length -2 ; i++){
        if (snake.path[i][0] === snake.x && snake.path[i][1] === snake.y && snake.path.length > 2){
            state.current = state.over; 
        }
    }

    if (state.current == state.over){
        ctx.clearRect(0,0, cvs.clientWidth,cvs.clientHeight);
        ctx.drawImage(gameoverimg, cvs.clientWidth/2 - 225/2, cvs.clientHeight/2 - 225/2);
    }
}

//adding keyboard control to change the direction of the snake 
document.addEventListener("keydown", keyDownHandler);
function keyDownHandler(e) {
    if (e.code == "ArrowDown"){
        direction = "down";
        snake.down();
    }
    else if (e.code == "ArrowUp"){
        direction = "up";
        snake.up();
    }
    else if (e.code == "ArrowLeft"){
        direction = "left";
        snake.left();
    }
    else if (e.code == "ArrowRight"){
        direction = "right";
        snake.right();
    }
}

function moveInBackground(){
    if (direction == "down"){
        snake.down();
    }
    else if (direction == "up"){
        snake.up();
    }
    if (direction == "left"){
        snake.left();
    }
    if (direction == "right"){
        snake.right();
    }
}

function loop(){
    moveInBackground();
    snake.draw();  
    snack.generate();
    gameover();
}

snake.start();
setInterval(() => {
    loop();
}, 100);



