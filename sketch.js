/*

The Game Project 6

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectables;
var clouds;
var canyons;
var mountains; 

var flagpole;
var game_score;
var game_over;
var lives;

function setup()
{
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    
    startGame();
}

function draw()
{
    // Fill the sky blue.
	background(100,211,255); 
	noStroke();
    
    // Draw some green ground.
	fill(10,204,38);
	rect(0, floorPos_y, width, height/4); 
    
    // Enable scrolling.
    push();
    translate(scrollPos,0);

	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();

	// Draw canyons.
    for (var i=0 ; i < canyons.length ; i++)
    {
        drawCanyon(canyons[i]);   
        checkCanyon(canyons[i]);
        checkPlayerDie();
    }
    
    // Draw collectable items.
    for(var i = 0; i < collectables.length ; i++)
        {                    
            if(!collectables[i].isFound)
            {
                drawCollectable(collectables[i]);
                checkCollectable(collectables[i]);
            }
        }
    
    renderFlagpole();
    
    pop();

	// Draw game character.	
	drawGameChar();
    
    // Post score & lives.
    fill(0);
    textSize(14);
    textFont('Raleway Medium');
    noStroke();
    text('lives: ', 20,25);
    text('score: ' + game_score, 20,45);
    
    
    // Draw Lives.
    fill(255,18,18);    
    for(var i=0; i<lives; i++){
        var radius = 10;
        drawHeart(65 + i*radius*2.5, 17, radius); 
    }
    
    // Game Over text.
    if (lives < 1 && game_over == true){
        fill(255,255,255,100);
        rect(0, 60, width, 160);
        fill(0);
        textSize(100);
        text('GAME OVER', 230, 150);
        textSize(25);
        text('press SPACE to start again', 390, 200);
        return;
    }
    
    // Level Complete text.
    if (flagpole.isReached == true)
    {
        fill(255,255,255,100);
        rect(0, 60, width, 160);
        fill(0);
        textSize(50);
        text('Level Complete!', 330, 130);
        textSize(25);
        text('press SPACE to continue', 380, 185);
        return;
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
        {
            gameChar_y += 2;
            isFalling = true;
        }
    else
        {
            isFalling = false;        
        }
    
    if(isPlummeting)
        {
            gameChar_y += 5;
        }
    
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}



// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    
    //when pressing "A" or "Left Arrow"
    if (keyCode == 37 || keyCode == 65){
        isLeft = true;
    }
    
    //when pressing "D" or "Right Arrow"
    else if (keyCode == 39 || keyCode == 68){
        isRight = true;
    }
    
    //when pressing "W" or "pace"
    if (keyCode == 32 || keyCode == 87){
        if (flagpole.isReached == true){
            console.log('NEXT LEVEL BEGINS');
        }
        else if (game_over == true){
            startGame();
            lives = 3;
        }
        else if(!isFalling && !isPlummeting){
            gameChar_y -= 150;
        }

    }

}

function keyReleased()
{
    //when pressing "A" or "Left Arrow"
    if (keyCode == 37 || keyCode == 65){
        isLeft = false;
    }
    //when pressing "D" or "Right Arrow"
    else if (keyCode == 39 || keyCode == 68){
        isRight = false;
    }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
	if(isLeft && isFalling)
	{
		// add your jumping-left code

        //Head
        fill(229,209,208);
        ellipse(gameChar_x, gameChar_y - 50, 30, 30);

        //Hair
        fill(218,146,62);
        triangle(gameChar_x - 9, gameChar_y -62,
                 gameChar_x, gameChar_y - 68,
                 gameChar_x + 9, gameChar_y - 62);

        //Eye
        fill(255);
        ellipse(gameChar_x - 9, gameChar_y - 48, 9,9);
        fill(113,184,255);
        ellipse(gameChar_x - 9, gameChar_y - 48, 5,5);
        fill(0);
        ellipse(gameChar_x - 9, gameChar_y - 48, 2,2);
        fill(255);
        stroke(255);
        strokeWeight(1);
        point(gameChar_x - 10, gameChar_y - 48);
        noStroke();

        //Mouth
        fill(246,69,105);
        arc(gameChar_x - 10, gameChar_y - 42, 5, 5, 0, PI, CHORD);

        //Shirt
        fill(246,69,105);
        rect(gameChar_x -5, gameChar_y -35, 10,25);

        //Jeans
        fill(74,116,158);
        rect(gameChar_x -5, gameChar_y -15, 10,5);

        //Feet
        rect(gameChar_x -2.5, gameChar_y-10, 5,10);

        //Shoes
        fill(0);
        rect(gameChar_x -2.5, gameChar_y -2, 5,3);

        //Hands
        strokeWeight(3);

        //hand
        stroke(229,209,208);
        line(gameChar_x + 3, gameChar_y - 33, gameChar_x + 11, gameChar_y -20);
        stroke(246,69,105);
        line(gameChar_x + 3, gameChar_y - 33, gameChar_x + 6, gameChar_y - 28);

        noStroke;    

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code

        //Head
        fill(229,209,208);
        ellipse(gameChar_x, gameChar_y - 50, 30, 30);

        //Hair
        fill(218,146,62);
        triangle(gameChar_x - 9, gameChar_y -62,
                 gameChar_x, gameChar_y - 68,
                 gameChar_x + 9, gameChar_y - 62);

        //Eye
        fill(255);
        ellipse(gameChar_x + 9, gameChar_y - 48, 9,9);
        fill(113,184,255);
        ellipse(gameChar_x + 9, gameChar_y - 48, 5,5);
        fill(0);
        ellipse(gameChar_x + 9, gameChar_y - 48, 2,2);
        fill(255);
        stroke(255);
        strokeWeight(1);
        point(gameChar_x + 10, gameChar_y - 48);
        noStroke();

        //Mouth
        fill(246,69,105);
        arc(gameChar_x + 10, gameChar_y - 42, 5, 5, 0, PI, CHORD);

        //Shirt
        fill(246,69,105);
        rect(gameChar_x -5, gameChar_y -35, 10,25);

        //Jeans
        fill(74,116,158);
        rect(gameChar_x -5, gameChar_y -15, 10,5);


        //Feet
        rect(gameChar_x -2.5, gameChar_y-10, 5,10);

        //Shoes
        fill(0);
        rect(gameChar_x -2.5, gameChar_y -2, 5,3);

        //Hands
        strokeWeight(3);

        //hand
        stroke(229,209,208);
        line(gameChar_x - 3, gameChar_y - 33, gameChar_x - 11, gameChar_y -20);
        stroke(246,69,105);
        line(gameChar_x - 3, gameChar_y - 33, gameChar_x - 6, gameChar_y - 28);

        noStroke;    

	}
	else if(isLeft)
	{
		// add your walking left code        
        
        //Head
        fill(229,209,208);
        ellipse(gameChar_x, gameChar_y - 50, 30, 30);

        //Hair
        fill(218,146,62);
        triangle(gameChar_x - 9, gameChar_y -62,
                 gameChar_x, gameChar_y - 68,
                 gameChar_x + 9, gameChar_y - 62);

        //Eye
        fill(255);
        ellipse(gameChar_x - 9, gameChar_y - 48, 9,9);
        fill(113,184,255);
        ellipse(gameChar_x - 9, gameChar_y - 48, 5,5);
        fill(0);
        ellipse(gameChar_x - 9, gameChar_y - 48, 2,2);
        fill(255);
        stroke(255);
        strokeWeight(1);
        point(gameChar_x - 10, gameChar_y - 48);
        noStroke();

        //Mouth
        fill(246,69,105);
        arc(gameChar_x - 10, gameChar_y - 42, 5, 5, 0, PI, CHORD);

        //Shirt
        fill(246,69,105);
        rect(gameChar_x -5, gameChar_y -35, 10,25);

        //Jeans
        fill(74,116,158);
        rect(gameChar_x -5, gameChar_y -15, 10,5);

        //Feet
        rect(gameChar_x -2.5, gameChar_y-10, 5,10);

        //Shoes
        fill(0);
        rect(gameChar_x -2.5, gameChar_y -2, 5,3);

        //Hands
        strokeWeight(3);

        //hand
        stroke(229,209,208);
        line(gameChar_x - 3, gameChar_y - 33, gameChar_x - 11, gameChar_y -20);
        stroke(246,69,105);
        line(gameChar_x - 3, gameChar_y - 33, gameChar_x - 6, gameChar_y - 28);

        noStroke;    

	}
	else if(isRight)
	{
		// add your walking right code

        //Head
        fill(229,209,208);
        ellipse(gameChar_x, gameChar_y - 50, 30, 30);

        //Hair
        fill(218,146,62);
        triangle(gameChar_x - 9, gameChar_y -62,
                 gameChar_x, gameChar_y - 68,
                 gameChar_x + 9, gameChar_y - 62);

        //Eye
        fill(255);
        ellipse(gameChar_x + 9, gameChar_y - 48, 9,9);
        fill(113,184,255);
        ellipse(gameChar_x + 9, gameChar_y - 48, 5,5);
        fill(0);
        ellipse(gameChar_x + 9, gameChar_y - 48, 2,2);
        fill(255);
        stroke(255);
        strokeWeight(1);
        point(gameChar_x + 10, gameChar_y - 48);
        noStroke();

        //Mouth
        fill(246,69,105);
        arc(gameChar_x + 10, gameChar_y - 42, 5, 5, 0, PI, CHORD);

        //Shirt
        fill(246,69,105);
        rect(gameChar_x -5, gameChar_y -35, 10,25);

        //Jeans
        fill(74,116,158);
        rect(gameChar_x -5, gameChar_y -15, 10,5);


        //Feet
        rect(gameChar_x -2.5, gameChar_y-10, 5,10);

        //Shoes
        fill(0);
        rect(gameChar_x -2.5, gameChar_y -2, 5,3);

        //Hands
        strokeWeight(3);

        //hand
        stroke(229,209,208);
        line(gameChar_x + 3, gameChar_y - 33, gameChar_x + 11, gameChar_y -20);
        stroke(246,69,105);
        line(gameChar_x + 3, gameChar_y - 33, gameChar_x + 6, gameChar_y - 28);

        noStroke;    

	}
	else if (isFalling || isPlummeting)
	{
		// add your jumping facing forwards code

        //Head
        fill(229,209,208);
        ellipse(gameChar_x, gameChar_y - 50, 30, 30);

        //Hair
        fill(218,146,62);
        triangle(gameChar_x - 9, gameChar_y -62,
                 gameChar_x, gameChar_y - 68,
                 gameChar_x + 9, gameChar_y - 62);

        //Eyes
        fill(255);
        ellipse(gameChar_x - 5, gameChar_y - 48, 9,9);
        ellipse(gameChar_x + 5, gameChar_y - 48, 9,9);
        fill(113,184,255);
        ellipse(gameChar_x - 5, gameChar_y - 48, 5,5);
        ellipse(gameChar_x + 5, gameChar_y - 48, 5,5);
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 48, 2,2);
        ellipse(gameChar_x + 5, gameChar_y - 48, 2,2);
        fill(255);
        stroke(255);
        strokeWeight(1);
        point(gameChar_x - 6, gameChar_y - 48);
        point(gameChar_x + 4, gameChar_y - 48);
        noStroke();

        //Mouth
        fill(246,69,105);
        arc(gameChar_x, gameChar_y - 42, 6, 6, 0, PI, CHORD);

        //Shirt
        fill(246,69,105);
        rect(gameChar_x -7.5, gameChar_y -35, 15,25);

        //Jeans
        fill(74,116,158);
        rect(gameChar_x -7.5, gameChar_y -15, 15,5);

        //Feet
        rect(gameChar_x -7.5, gameChar_y-10, 5,10);
        rect(gameChar_x +2.5, gameChar_y-10, 5,10);

        //Shoes
        fill(0);
        rect(gameChar_x -7.5, gameChar_y -2, 5,3);
        rect(gameChar_x +2.5, gameChar_y -2, 5,3);

        //Hands
        strokeWeight(3);

        //hand-left
        stroke(229,209,208);
        line(gameChar_x - 7, gameChar_y - 33, gameChar_x -19, gameChar_y -38);
        stroke(246,69,105);
        line(gameChar_x - 7, gameChar_y - 33, gameChar_x - 12, gameChar_y - 34.7);
        //hand-right
        stroke(229,209,208);
        line(gameChar_x + 7, gameChar_y - 33, gameChar_x +19, gameChar_y -38);
        stroke(246,69,105);
        line(gameChar_x + 7, gameChar_y - 33, gameChar_x + 12, gameChar_y - 34.7);

        noStroke;

	}
	else
	{
		// add your standing front facing code
        
        //Head
        fill(229,209,208);
        ellipse(gameChar_x, gameChar_y - 50, 30, 30);

        //Hair
        fill(218,146,62);
        triangle(gameChar_x - 9, gameChar_y -62,
                 gameChar_x, gameChar_y - 68,
                 gameChar_x + 9, gameChar_y - 62);

        //Eyes
        fill(255);
        ellipse(gameChar_x - 5, gameChar_y - 48, 9,9);
        ellipse(gameChar_x + 5, gameChar_y - 48, 9,9);
        fill(113,184,255);
        ellipse(gameChar_x - 5, gameChar_y - 48, 5,5);
        ellipse(gameChar_x + 5, gameChar_y - 48, 5,5);
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 48, 2,2);
        ellipse(gameChar_x + 5, gameChar_y - 48, 2,2);
        fill(255);
        stroke(255);
        strokeWeight(1);
        point(gameChar_x - 6, gameChar_y - 48);
        point(gameChar_x + 4, gameChar_y - 48);
        noStroke();

        //Mouth
        fill(246,69,105);
        arc(gameChar_x, gameChar_y - 42, 6, 6, 0, PI, CHORD);

        //Shirt
        fill(246,69,105);
        rect(gameChar_x -7.5, gameChar_y -35, 15,25);

        //Jeans
        fill(74,116,158);
        rect(gameChar_x -7.5, gameChar_y -15, 15,5);

        //Feet
        rect(gameChar_x -7.5, gameChar_y-10, 5,10);
        rect(gameChar_x +2.5, gameChar_y-10, 5,10);

        //Shoes
        fill(0);
        rect(gameChar_x -7.5, gameChar_y -2, 5,3);
        rect(gameChar_x +2.5, gameChar_y -2, 5,3);

        //Hands
        strokeWeight(3);

        //hand-left
        stroke(229,209,208);
        line(gameChar_x - 7, gameChar_y - 33, gameChar_x - 15, gameChar_y -20);
        stroke(246,69,105);
        line(gameChar_x - 7, gameChar_y - 33, gameChar_x - 10, gameChar_y - 28);
        //hand-right
        stroke(229,209,208);
        line(gameChar_x + 7, gameChar_y - 33, gameChar_x + 15, gameChar_y -20);
        stroke(246,69,105);
        line(gameChar_x + 7, gameChar_y - 33, gameChar_x + 10, gameChar_y - 28);

        noStroke;

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
    for (var i = 0; i < clouds.length ; i++)
        {
    
            fill(255,255,255);
            ellipse(clouds[i].x_pos,
                    clouds[i].y_pos,
                    clouds[i].diam,
                    clouds[i].diam);
            ellipse(clouds[i].x_pos + 55,
                    clouds[i].y_pos,
                    clouds[i].diam + 27,
                    clouds[i].diam + 27);    
            ellipse(clouds[i].x_pos + 110,
                    clouds[i].y_pos + 10,
                    clouds[i].diam - 8,
                    clouds[i].diam - 8);
            ellipse(clouds[i].x_pos + 32,
                    clouds[i].y_pos + 30,
                    clouds[i].diam + 7,
                    clouds[i].diam + 7);
            ellipse(clouds[i].x_pos + 77,
                    clouds[i].y_pos + 35,
                    clouds[i].diam - 10,
                    clouds[i].diam - 10);
        }
}

// Function to draw mountains objects.

function drawMountains()
{
    for (var i = 0 ; i < mountains.length ; i++ )
    {
        //mountains-shadows
        fill(11,120,32);
        triangle(mountains[i].x_pos, mountains[i].y_pos,
                 mountains[i].x_pos + 85, mountains[i].y_pos - 197,
                 mountains[i].x_pos + 150, mountains[i].y_pos);
        
        //mountain-midtones
        fill(11,145,32);  
        triangle(mountains[i].x_pos + 45, mountains[i].y_pos,
                 mountains[i].x_pos + 140, mountains[i].y_pos - 162,
                 mountains[i].x_pos + 215, mountains[i].y_pos);

        //mountains-highlights
        fill(11,160,32);  
        triangle(mountains[i].x_pos - 48, mountains[i].y_pos,
                 mountains[i].x_pos + 25, mountains[i].y_pos - 232,
                 mountains[i].x_pos + 100, mountains[i].y_pos);
    }
}

// Function to draw trees objects.

function drawTrees()
{
    for (var i = 0 ; i< trees_x.length ; i++ )
        {
            //tree-trunk
            fill(132,98,76); 
            rect(trees_x[i], floorPos_y - 160, 15, 160);

            //tree-leaves-shadows
            fill(8,180,39);
            ellipse(trees_x[i] + 9, floorPos_y - 160 + 8, 125, 125);
            ellipse(trees_x[i] - 51, floorPos_y - 160 + 28, 70, 70);
            ellipse(trees_x[i] + 65, floorPos_y - 160 + 28, 70, 70);

            //tree-leaves-highlights
            fill(10,204,38);
            ellipse(trees_x[i] + 9, floorPos_y - 160 + 8, 80, 80);
            ellipse(trees_x[i] - 51, floorPos_y - 160 + 28, 32, 32);
            ellipse(trees_x[i] + 65, floorPos_y - 160 + 28, 32, 32);

            //tree-branches
            stroke(135,98,76);
            strokeWeight(4);
            line(trees_x[i], floorPos_y - 160 + 98,
                 trees_x[i] - 33, floorPos_y - 160 + 58);
            line(trees_x[i] + 15, floorPos_y - 160 + 98,
                 trees_x[i] + 47, floorPos_y - 160 + 58);
            noStroke();
        }
}

// Draw lives/hearts

function drawHeart(x, y, r){ 
        ellipse(x, y, r, r);
        ellipse(x+r, y, r, r);
        triangle(x-r/1.9, y+r/8, x+r/1.9, y+r*1.2, x+r*1.5, y+r/8);
        
    }

// ---------------------------------
// Flagpole render & check functions
// ---------------------------------

// Render Flagpole.
function renderFlagpole()
{
    push();
    stroke(0);
    strokeWeight(5);
    line(flagpole.x_pos , floorPos_y, flagpole.x_pos, floorPos_y - 250);
    
    noStroke();
    fill(255,0,0);
    if(flagpole.isReached){
        rect(flagpole.x_pos, floorPos_y - 250, 75, 50);  
    } else {
        rect(flagpole.x_pos, floorPos_y - 100, 75, 50);
    }
    
    pop();
}

// Check Flagpole.
function checkFlagpole(){
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d<15){
        flagpole.isReached = true;
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    for (var i = 0; i < canyons.length ; i++)
        {    
            //canyon-void
            fill(100,211,255);
            rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, t_canyon.height);

            //canyon-shadows
            fill(8,180,39);
            triangle(t_canyon.x_pos + 150, t_canyon.y_pos,
                     t_canyon.x_pos + 150, t_canyon.y_pos + 144,
                     t_canyon.x_pos + 225, t_canyon.y_pos + 144);
            triangle(t_canyon.x_pos, t_canyon.y_pos,
                     t_canyon.x_pos, t_canyon.y_pos + 144,
                     t_canyon.x_pos - 90, t_canyon.y_pos + 144);
        }
}

// Function to check if character is over a canyon.

function checkCanyon(t_canyon)
{   
    if(gameChar_world_x > t_canyon.x_pos
       && gameChar_world_x < t_canyon.x_pos + t_canyon.width
       && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    } 
}

// Function to Check if the character fell off the canyon and hit the rock bottom

function checkPlayerDie(){
    if(gameChar_y > height + 70
       && gameChar_y < height + 75)
    {
        lives -= 1;
        
        if(lives < 1){
            isPlummeting = false;
            lives = 0;
            game_over = true;
        }
        else if(lives >= 1){
            console.log('lost life: -1'); 
            startGame();
        }
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    //draw the collectable

    //apple-shadows
    fill(208,18,18);
    ellipse(t_collectable.x_pos,
            t_collectable.y_pos,
            t_collectable.width,
            t_collectable.height);

    //apple-highlights
    fill(255,18,18);
    ellipse(t_collectable.x_pos - 2,
            t_collectable.y_pos - 5,
            t_collectable.width -14,
            t_collectable.height - 17);

    //apples-leaf
    fill(8,193,39);
    ellipse(t_collectable.x_pos + 7,
            t_collectable.y_pos - 14,
            t_collectable.width - 15,
            t_collectable.height - 25);

    //apple-stem
    stroke(135,76,76);
    strokeWeight(3);
    line(t_collectable.x_pos,
         t_collectable.y_pos - 14,
         t_collectable.x_pos,
         t_collectable.y_pos - 19)
    noStroke();
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <= t_collectable.width)
    {
        t_collectable.isFound = true;
        console.log('found collectable: +1');
        game_score += 1;
    }
}


// ----------------------------------
// Start game
// ----------------------------------

function startGame(){
    
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    trees_x = [-350, -150, 285, 475, 875, 1300, 1600];
    
    clouds = 
        [
            {x_pos: -700, y_pos: 170, diam: 53},
            {x_pos: -300, y_pos: 100, diam: 53},
            {x_pos: 140, y_pos: 150, diam: 53},
            {x_pos: 400, y_pos: 100, diam: 53},
            {x_pos: 800, y_pos: 75, diam: 53},
            {x_pos: 1300, y_pos: 175, diam: 53}
         ];
    
    collectables = 
        [
            {x_pos: 50, y_pos: 430, width: 27, height: 30, isFound: false},
            {x_pos: 830, y_pos: 430, width: 27, height: 30, isFound: false},
            {x_pos: 430, y_pos: 290, width: 27, height: 30, isFound: false},
            {x_pos: 1200, y_pos: 430, width: 27, height: 30, isFound: false}
        ];
    
    canyons = 
        [
            {x_pos: 100, y_pos: 432, width: 150, height: 200},
            {x_pos: 1000, y_pos: 432, width: 150, height: 200}
        ];
    
    mountains = 
        [
            {x_pos: 645, y_pos: 432},
            {x_pos: 1420, y_pos: 432},
            {x_pos: -530, y_pos: 432},
            {x_pos: -235, y_pos: 432}
        ];
    
    flagpole = {isReached: false, x_pos: 1500};
    
    game_score = 0;
    game_over = false;
    
    
}