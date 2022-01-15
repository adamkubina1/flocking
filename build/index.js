
const colorMap = new Map([
    [ 0, "#aceac3"], 
    [ 1, "#da9edc"],
    [ 2, "#33bbcc"],
    [ 3, "#f9f953"],
    [ 4, "#9e764c"],
    [ 5, "#d3ffce"],
    [ 6, "#fdf5e6"],
    [ 7, "#5f9ea0"],
]);



let sim = new Simulation({
    height: window.innerHeight,
    width: window.innerWidth,

    boidsCount: 200,
    maxBoids: 500,

    maxSpeed: 5,
    maxForce: 1,
    perception: 50,
    boidSize: 5,
    desiredDistance: 15,

    alignModifier: 1,
    cohesionModifier: 1,
    separationModifier: 1.25, //Increased separation for nicer visuals 

    racism: 0,
    colorMap: colorMap,

    walls: false,

    obstacleSize: 40,

    spawn: 0 // 0-boid, 1-obstacle, 2-predator
});



function setup(){
    createCanvas(windowWidth,windowHeight);
    frameRate(60);

    sim.initilize();
}


function draw(){
    background(51);

    sim.update();
}


function keyTyped() {
    if(key == 's'){
        switch(sim.spawn) {
            case 0:
              sim.spawnBoid(mouseX, mouseY);
              break;
            case 1:
              sim.spawnObstacle(mouseX, mouseY);
              break;
            case 2:
              sim.spawnPredator(mouseX, mouseY);
        } 
    }
}


document.getElementById("zen-button").onclick = function () {
    let target = document.getElementById("info-section");
    let target1 = document.getElementById("click-settings");
    let target2 = document.getElementById("attribute-settings");

    if ( target.style.display !== "none") {
      target.style.display = "none";
      target1.style.display = "none";
      target2.style.display = "none";
    } else {
      target.style.display = "block";
      target1.style.display = "block";
      target2.style.display = "block";
    }
};

document.getElementById("clear-button").onclick = function () {
    sim.clear();
};



//This is probs posible to write in one function
document.getElementById("boid").onchange = function () {
    sim.spawn = parseInt(this.value);
};
document.getElementById("obstacle").onchange = function () {
    sim.spawn = parseInt(this.value);
};
document.getElementById("predator").onchange = function () {
    sim.spawn = parseInt(this.value);
};



document.getElementById("boidCount-slider").oninput = function () {
    sim.changeBoidsCount(this.value);
};
document.getElementById("align-slider").onchange = function () {
    sim.alignModifier = this.value;
};
document.getElementById("cohesion-slider").onchange = function () {
    sim.cohesionModifier = this.value;
};
document.getElementById("seperation-slider").onchange = function () {
    sim.separationModifier = this.value;
};
document.getElementById("racism-slider").onchange = function () {
    sim.racism = !sim.racism;
};
document.getElementById("perception-slider").onchange = function () {
    sim.perception = this.value;
};
document.getElementById("introversion-slider").onchange = function () {
    sim.desiredDistance = this.value;
};
document.getElementById("size-slider").onchange = function () {
    sim.changeSize(this.value);
};
document.getElementById("speed-slider").onchange = function () {
    sim.changeSpeed(this.value);
};
document.getElementById("colors-slider").onchange = function () {
    sim.changeColors(this.value);
};
document.getElementById("walls").onchange = function () {
    sim.walls = !sim.walls;
};
