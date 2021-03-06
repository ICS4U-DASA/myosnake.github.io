$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");


	function resize() {
		canvas.width = window.innerWidth - 50;
		canvas.height = window.innerHeight - 150;
	}
	window.addEventListener('resize', resize, false); resize();

	var w = canvas.width
	var h = canvas.height


	//Lets save the cell width in a variable for easy control
	var cw = 25;
	var d;
	var food;
	var score;
	//import sound
	var eat_sound = new Audio('sound/apple.wav');
	var whoosh = new Audio('sound/whoosh.wav');
	var gameover = new Audio('sound/gameover.wav');

	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake

	apple = new Image;
	apple.src = "img/apple.png";

	function init()
	{
		d = "right"; //default direction
		create_snake();
		create_food(); //Now we can see the food particle
		//finally lets display the score
		score = 0;
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();

	function create_snake()
	{
		var length = 12; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}

	//Lets create the food now
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}

	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx=nx+0.5;
		else if(d == "left") nx=nx-0.5;
		else if(d == "up") ny=ny-0.5;
		else if(d == "down") ny=ny+0.5;

		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//restart game
			init();
			gameover.play();
			//Lets organize the code a bit now.
			return;
		}


		
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			eat_sound.play();
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.

		snake_array.unshift(tail); //puts back the tail as the first cell

		paint_head(snake_array[0].x, snake_array[0].y);

		function paint_head(x, y)
		{
			//var eye = new Path2D();
	    //eye.moveTo(x*cw, y*cw);
	    // eye.arc(50, 35, 25, 0, 2 * Math.PI);
			// ctx.fillStyle = "#ffffff";
	    // ctx.fill(eye);
			ctx.fillStyle = "#FF2500";
			ctx.fillRect(x*cw, y*cw, cw, cw);
			ctx.strokeStyle = "#FF2500";
			ctx.strokeRect(x*cw, y*cw, cw, cw);
		}

		for(var i = 1; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}

		//Lets paint the food
		//paint_cell(food.x, food.y);
		ctx.drawImage(apple,food.x*cw - 25, food.y*cw - 30);
		//Lets paint the score
		var score_text = "Score: " + score;
		document.getElementById('score').innerHTML = score_text;
	}

	//Lets first create a generic function to paint cells
	function paint_cell(x, y)
	{
		ctx.fillStyle = "#73F300";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "#73F300";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}



	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	$(function() {
	  $('.fa-play').click(function() {
	    var wasPlay = $(this).hasClass('fa-play');
	    $(this).removeClass('fa-play fa-pause');
	    var klass = wasPlay ? 'fa-pause' : 'fa-play';
	    $(this).addClass(klass)
	  });
	});

	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right"){
			d = "left";
			whoosh.play()
		}
		else if(key == "38" && d != "down"){
			d = "up";
			whoosh.play()
		}
		else if(key == "39" && d != "left"){
			d = "right";
			whoosh.play()
		}
		else if(key == "40" && d != "up"){
			d = "down";
			whoosh.play()
		}
		else if(key == "32"){
			d = "pause";
			whoosh.play()
		}
		//The snake is now keyboard controllable
	})
})
