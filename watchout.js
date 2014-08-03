var gameOptions = {
  nEnemies: 30,
  width: 800,
  height: 500,
  padding: 10,
};

var score = 0,
  highScore = 0,
  collisionCount = 0;

var randomPosX = function(){
  return Math.floor(Math.random() * (gameOptions.width - 2 * gameOptions.padding));
};

var randomPosY = function(){
  return Math.floor(Math.random() * (gameOptions.height - 2 * gameOptions.padding));
};

var svg = d3.select(".container").append("svg")
            .attr("width", gameOptions.width)
            .attr("height", gameOptions.height)
            .attr("class", "gameField");

//Enemy object
var Enemy = function(i){
  this.id = i;
  this.x = randomPosX();
  this.y = randomPosY();
  this.r = 12;
};

//pushing enemy objects into an array
var createEnemies = function(n){
  var result = [];
  for(var i = 0 ; i < n; i++){
    result.push(new Enemy(i));
  }
  return result;
};

//this array has all the enemy objects
var enemiesArray = createEnemies(gameOptions.nEnemies);
//placing the enemies on the field
svg.selectAll("image.enemy").data(enemiesArray, function(data){return data.id;})
                             .enter().append("svg:image")
                             .attr("class", "enemy")
                             .attr("id", function(data){return data.id;})
                             .attr("x", function(data){return data.x;})
                             .attr("y", function(data){return data.y;})
                             .attr("xlink:href", "Shuriken.png")
                             .attr("width", 25)
                             .attr("height", 25)
                             .attr("r", function(data){return data.r;});

var moveEnemies = function(){
  enemiesArray.forEach(function(element){
    element.x = randomPosX();
    element.y = randomPosY();
  });
  svg.selectAll("image.enemy").data(enemiesArray)
                               .transition().duration(800)
                               .attr("x", function(data){return data.x;})
                               .attr("y", function(data){return data.y;});
};

var prevCollision = false;
var collisionDetection = function(){
  var collision = false;
  var player = playerArray[0];
  for (var i = 0; i < enemiesArray.length; i ++){
    var radiusSum = parseFloat(enemiesArray[i].r + player.r);
    var xDiff = parseFloat(enemiesArray[i].x - player.x);
    var yDiff = parseFloat(enemiesArray[i].y - player.y);
    var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
    if (separation < radiusSum) {
      collision = true;
    }
  }
  if(collision){
    changeHighScore();
    score = 0;
    if(prevCollision!== collision){
      collisionCount++;
      d3.select(".collisions span").text(collisionCount);
    }
  }
  prevCollision = collision;
};

//moving enemies every second
setInterval(moveEnemies, 2000);

//Player array for d3
var playerArray = [{ x:0,
  y:0,
  r:8}];

var boundaries = {
  maxX: gameOptions.width - gameOptions.padding,
  maxY: gameOptions.height - gameOptions.padding,
  minX: gameOptions.padding,
  minY: gameOptions.padding
};
var drag = d3.behavior.drag()
    .on("drag", function(d,i){
      d.x += (d3.event.dx);
      d.y += (d3.event.dy);
      d3.select(this).attr("cx", function(d){return d.x > boundaries.maxX? boundaries.maxX : d.x < boundaries.minX ? boundaries.minX: d.x;})
                     .attr("cy", function(d){return d.y > boundaries.maxY? boundaries.maxY : d.y < boundaries.minY ? boundaries.minY: d.y;});
});

//Put player on board
var createPlayer = function (){
  playerArray.forEach(function(element){
    element.x = (gameOptions.width - 2 * gameOptions.padding) * 0.5;
    element.y = (gameOptions.height - 2 * gameOptions.padding) * 0.5;
  });
  svg.selectAll("circle.player").data(playerArray)
                             .enter().append("circle")
                             .attr("class", "player")
                             .attr("cx", function(d){return d.x;})
                             .attr("cy", function(d){return d.y;})
                             .attr("r", 8)
                             .call(drag);
};

var scoreIncrease = function(){
  score++;
  changeHighScore();
  d3.select(".current span").text(score);
};

var changeHighScore = function(){
  highScore = Math.max(score, highScore);
  d3.select(".high span").text(highScore);
};

createPlayer();
d3.timer(collisionDetection);
setInterval(scoreIncrease,50);
