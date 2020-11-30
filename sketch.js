var database;
var gameState, readState;
var dogSprite, dogimg, happyDogimg;
var food, foodStock;
var addFoodButton, feedDogButton, nameInput, nameButton;
var fedTime, lastFed, currentTime;
var foodObj;
var name;
var bedroomimg, gardenimg, washroomimg, livingroomimg;

function preload()
{
  dogimg = loadImage('images/Dog.png');
  bedroomimg = loadImage('images/BedRoom.png');
  gardenimg = loadImage('images/Garden.png');
  washroomimg = loadImage('images/WashRoom.png');
  livingroomimg = loadImage('images/LivingRoom.png');
}

function setup() {
  createCanvas(1600, 800);

  //0 is hungry, 1 is relaxing (livingroom), 2 is playing (garden), 3 is sleeping (bedroom), 4 is bathing (washroom)

  dogSprite = createSprite(1250,250,50,50);
  dogSprite.addImage(dogimg);
  dogSprite.scale = 0.5;

  database = firebase.database();
  foodStock = database.ref('Food');
  fedTime = database.ref('LastFed');

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });

  foodObj = new Food();

  feedDogButton = createButton("Feed the dog");
  feedDogButton.position(700,95);
  feedDogButton.mousePressed(feedDog);

  addFoodButton = createButton("Add Food");
  addFoodButton.position(800,95);
  addFoodButton.mousePressed(addFood);

  name = " ";

  nameInput = createInput("ENTER DOGGO NAME");
  nameInput.position(1250,600);

  nameButton = createButton("SAVE");
  nameButton.position(1250,700);
  nameButton.mousePressed(saveName);
}


function draw() {
  background(46,139,87);
  currentTime = hour();

  foodStock.on("value",function(data){
    food = data.val();
  });

  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  database.ref('Name').on("value", function(data){
    name = data.val(); 
  });

  if(food != undefined){
    if(food<1){
      database.ref('/').update({
        Food: 0
      });
    }
  }

  if(gameState!=undefined&&lastFed!=undefined){
    //console.log(gameState);
    if(currentTime==lastFed){
      update(1);
      foodObj.livingroom();
    }else if(currentTime==(lastFed+1)){
      update(2);
      foodObj.garden();
    }else if(currentTime==(lastFed+2)){
      update(3);
      foodObj.bedroom();
    }else if(currentTime==(lastFed+3)){
      update(4);
      foodObj.washroom();
    }else if(currentTime<lastFed||currentTime>(lastFed+3)){
      if(gameState!=0){
        update(0);
        dogSprite = createSprite(1250,250,50,50);
        dogSprite.addImage(dogimg);
        dogSprite.scale = 0.5;
      }
      foodObj.display();
    }
  }

  if(gameState!=undefined){
    if(gameState!=0){
      feedDogButton.hide();
      addFoodButton.hide();
      dogSprite.remove();
    }else{
      feedDogButton.show();
      addFoodButton.show();
      push();
      fill("white");
      stroke("black");
      textSize(15);
      text("PRESS BUTTON TO ADD MORE FOOD",1000,50);
      pop();
    }
  }

  drawSprites();

  push();
  fill(0,1,2);
  textAlign(CENTER);
  textSize(15);
  if(lastFed > 12){
    text("LAST FED: " + lastFed%12 + " PM", 350, 30);
  }
  else if(lastFed == 0){
    text("LAST FED: 12 AM",350,30);
  }
  else if(lastFed == 12){
    text("LAST FED: 12 PM",350,30);
  }
  else {
    text("LAST FED: " + lastFed + " AM", 350, 30);
  }
  textSize(40);
  text(name,1300,500);
  pop();

}

function feedDog(){
  foodObj.updateFoodStock(food-1);

  database.ref('/').update({
    Food: food,
    LastFed: hour()
  })
}

function addFood(){
  if(food < 5){
    food++;
    database.ref('/').update({
      Food: food
    });
  }
}

function saveName(){
  name = nameInput.value();
  database.ref('/').update({
    Name: name
});
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}


