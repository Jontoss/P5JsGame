/*
The Lion King - Stampede!
by Jonty Graver - N10216944

This sketch is a mini-game developed to showcase Disney's The Lion King (1994)
It is based around a major scene in the movie, where the main character, Simba, is forced
into a canyon and has to run away from a stampede of Wildebeasts that are coming towards him.
The player must survive for 2 minutes to win the game. This is done by dodging enemies and by using the dash to escape
dangerous situations (5 sec cooldown). If the player reaches 0 health, the game is lost.
This game is made to promote the movie towards a younger target audience, but still aims to prevoke a sense
of tension with its difficult gameplay.

ASSETS USED:
Player model and enemy models - https://forums.rpgmakerweb.com/index.php?threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/
Background (Game) - http://forum.profantasy.com/comments.php?DiscussionID=6550
Background (Menu) - https://lionking.fandom.com/wiki/Stampede_(event)
Font - https://www.dafont.com/savannah.font
Music (Game, Listed as 'Thunder') - https://filmstro.com/music/aggressive
Music (Win) - https://www.zapsplat.com/music/cartoon-success-fanfare/


*/

//VARIABLES

//Backgrounds Images
let backgroundImageGame;
let backgroundImageMenu;

//Player/Enemy Images
let playerImage = [];
let beastImage = [];

//Game State (Manages the different screens for the game)
let gameState = 0;

//Player Variables
let playerX;
let playerY;
let playerState = 0; //Used for updating the players image

//Time variable, set to 2 mins
let time = 120;

//Arrays for holding the enemy beasts
let beastsLeft = [];
let beastsRight = [];

//Health variabl
let lostHealth = 0;
let dashCooldown = 5;
let dashText;

//Variable for checking if the game is over
let gameOvercheck = false;

//Variables to be used by the enemy beasts
let beastsCount = 10; //Max amount of beasts on each side
let beastSpeed = 1; //Variable for moving the beasts

//Variables relating to music and audio
let musicCheck;
let winMusicCheck;
let gameMusic;
let winSound;

//Variable relating to fonts
let font;

//Function for pre-loading all the games data files
function preload() {
  //Load the background images for the main menu and the game screen
  backgroundImageGame = loadImage('Data/Background.jpg');
  backgroundImageMenu = loadImage('Data/Title.png');

  //Populate an array with images for each of the players states
  for (let i = 0; i < 4; i++) {
    playerImage[i] = loadImage('Data/Lion' + (i + 1) + '.png');
  }

  //Populate an array with images for both types of beast
  for (let i = 0; i < 2; i++) {
    beastImage[i] = loadImage('Data/WildBeast' + (i + 1) + '.png');
  }

  //Load the music for the game
  gameMusic = loadSound('Data/Thunder.mp3');
  winSound = loadSound('Data/cartoon_success_fanfair.mp3');

  //Load the custom font for the game
  font = loadFont('Data/Savannah.ttf');

}

//
function setup() {
  //Setup the canvas
  createCanvas(600, 400);

  //Set starting variables and font for the game
  gameOvercheck = false;
  musicCheck = true;
  winMusicCheck = true;
  playerX = width / 2;
  playerY = height / 2;
  textFont(font);

  //Create an instance of player
  player = new Player(playerX, playerY);

  //Create instances of the beasts to populate 2 arrays for each side of the screen
  for (let i = 0; i < beastsCount; i++) {
    beastsLeft.push(new WildBeast(25, random(0, height), random(2,3)));
  }

  for (let i = 0; i < beastsCount; i++) {
    beastsRight.push(new WildBeast(575, random(0, height), random(2,3)));
  }

  

}

//Draw function only contains simple logic for checking gamestates, then displaying the relevant screens
function draw() {
  if (gameState == 0) {
    StartScreen();
  } else if (gameState == 1) {
    GameScreen();
  } 
}

//Function for controlling the major gameplay screen
function GameScreen() {
  //Display the background image
  imageMode(CORNER);
  image(backgroundImageGame, 0, 0, width, height);

  //Place the player image on the screen
  imageMode(CENTER);
  player.place(playerImage[playerState]);

  //Play and loop the game music (done with a boolean check to prevent it from playing multiple at once)
  if(musicCheck){
    gameMusic.loop();
    musicCheck = false;
  }

  //Display the text for the timer and dash cooldowns
  textAlign(LEFT, TOP);
  fill('red');
  textSize(24);
  text("Time: " + time, 150, 0, 300, 300);

  if(dashCooldown == 0){
    text("Dash: " + "Ready!", 365, 0, 300, 300);
  }
  else{
    text("Dash: " + dashCooldown, 365, 0, 300, 300);
  }
  
  //Create a red rectangle then a green rectangle above as the healthbar 
  rect(250, 0, 100, 15);
  fill('green');
  rect(250, 0, 100 - lostHealth, 15); //As health is lost, the green rectangle shrinks to create a healthbar effect

  //PLAYER MOVEMENT

  //Move when W is pressed, and update image
  if (keyIsDown(87) && !gameOvercheck) {
    playerState = 0;
    player.move(0, -2);
  }
  //Move when S is pressed, and update image
  if (keyIsDown(83) && !gameOvercheck) {
    playerState = 3;
    player.move(0, 2);
  }
  //Move when A is pressed, and update image
  if (keyIsDown(65) && !gameOvercheck) {
    playerState = 1;
    player.move(-2);
  }
  //Move when D is pressed, and update image
  if (keyIsDown(68) && !gameOvercheck) {
    playerState = 2;
    player.move(2);
  }

  //Run the timer
  Timer();

  //All logic here controls the enemies, so it should be under the game over check to ensure it stops when game is finished
  if (!gameOvercheck) {

    //Place all starting beasts from both arrays
    for (let i = 0; i < beastsLeft.length; i++) {
      beastsLeft[i].place(beastImage[0]);
    }

    for (let i = 0; i < beastsRight.length; i++) {
      beastsRight[i].place(beastImage[1]);
    }



    // RIGHT SIDE BEASTS CONTROL

    //Move each of the beasts coming from the right side
    for (let beasts of beastsRight) {
      beasts.move(-beastSpeed);
    }

    //Check if any of the beasts are colliding with the player
    for (let i = 0; i < beastsRight.length; i++) {
      if (Collision(player, beastsRight[i], 30) == true) {
        lostHealth += 1;
      }
    }

    //Check if any beasts have reached the end, and if they have, delete them and respawn them randomly on their original side
    for (let beasts of beastsRight) {
      if (beasts.getX() < 30) {
        let index = beastsRight.indexOf(beasts);
        beastsRight.splice(index, 1);
        beastsRight.push(new WildBeast(575, random(0, height), random(2,3)));
      }
    }




    // LEFT SIDE BEASTS CONTROL

    //Move each of the beasts coming from the left side
    for (let beasts of beastsLeft) {
      beasts.move(beastSpeed);
    }

    //Check if any of the beasts are colliding with the player
    for (let i = 0; i < beastsLeft.length; i++) {
      if (Collision(player, beastsLeft[i], 30) == true) {
        lostHealth += 1;
      }
    }

    //Check if any beasts have reached the end, and if they have, delete them and respawn them randomly on their original side
    for (let beasts of beastsLeft) {
      if (beasts.getX() > 575) {
        let index = beastsLeft.indexOf(beasts);
        beastsLeft.splice(index, 1);
        beastsLeft.push(new WildBeast(25, random(0, height), random(2,3)));
      }
    }
  }

  //Dash Control - If the player clicks the mouse, it teleports them to the mouse position
  if (mouseIsPressed == true && dashCooldown == 0 && !gameOvercheck) {
    player.Dash(mouseX, mouseY);
    dashCooldown = 5;
  }

  //If the player reaches 100 lost health (AKA 0 health), display the gameover screen
  if (lostHealth >= 100) {
    lostHealth = 100;
    gameOvercheck = true;
    LoseScreen();
  }

}

//Function for displaying the startup screen
function StartScreen() {
  //Background image
  image(backgroundImageMenu, 0, 0, width, height);

  //Title Text
  textSize(40);
  textAlign(CENTER, CENTER);
  text("THE LION KING STAMPEDE!", 100, -150, 400, 400);
  
  //Start Text
  textSize(30);
  fill('red');
  text("Press Any Key To Start", 96, -12, 400, 400);

  //Load up the game screen if player presses a key
  if(keyIsPressed){
    gameState = 1;
  }
 
}


//Function for controlling the timer and the dash cooldown
function Timer() {
  //Counts down the timer every second if the game is running
  if (frameCount % 60 == 0 && time > 0 && !gameOvercheck) {
    time--;
  }

  //Displays the win screen if the time = 0
  if (time <= 0) {
    time = 0;
    gameOvercheck = true;
    WinScreen();
  }

  //Counts down the time for the dash cooldown every second after use
  if (frameCount % 60 == 0 && dashCooldown != 0) {
    dashCooldown--;
  }
}

//Function for displaying the win screen
function WinScreen() {
  fill("blue");
  textSize(32);
  text("You Win!", width / 2 - 60, height / 2 - 35, 200, 200);
  //Stop the game music and play the win music
  gameMusic.stop();
  if(winMusicCheck){
    winSound.play();
    winMusicCheck = false;
  }
  
  
}

//Function for displaying the lose screen
function LoseScreen() {
  fill("red");
  textSize(32);
  text("You Lose!", width / 2 - 65, height / 2 - 35, 200, 200);
}

/*Main function for detecting a collision between two objects, takes the two objects to compare and a number
used as a threshold (how far from the objects to confirm a collision)
*/
function Collision(object1, object2, num) {
  let xDifference = width;
  let yDifference = height;
  let negativeNum = -1 * num;

  //Get the difference in X and Y values between the two objects
  xDifference = object1.getX() - object2.getX();
  yDifference = object1.getY() - object2.getY();

  //Find if the objects are colliding and return true
  if (xDifference < num && xDifference > negativeNum && yDifference < num && yDifference > negativeNum) {
    return true;

  } 
}
