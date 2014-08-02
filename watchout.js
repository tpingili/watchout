var gameOptions = {
  nEnemies: 30,
  width: 800,
  height: 500,
  padding: 10
};

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
svg.selectAll("circle.enemy").data(enemiesArray, function(data){return data.id;})
                             .enter().append("circle")
                             .attr("class", "enemy")
                             .attr("cx", function(data){return data.x;})
                             .attr("cy", function(data){return data.y;})
                             .attr("r", 5)
                             .transition().duration(500).attr("r",8);

var moveEnemies = function(){
  enemiesArray.forEach(function(element){
    element.x = randomPosX();
    element.y = randomPosY();
  });
  svg.selectAll("circle.enemy").data(enemiesArray)
                               .transition().duration(800)
                               .attr("cx", function(data){return data.x;})
                               .attr("cy", function(data){return data.y;});
};

//moving enemies every second
setInterval(moveEnemies, 1000);

//Player array for d3
var playerArray = [{ x:0,
  y:0,
  r:8}];

var drag = d3.behavior.drag()
    .on("drag", function(d,i){
      d.x += (d3.event.dx);
      d.y += (d3.event.dy);
      d3.select(this).attr("cx", function(d){return d.x;})
                     .attr("cy", function(d){return d.y;});
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

createPlayer();
