
// Boids in the simulation
const flock = [];

// Create the bounding area of the quadtree (x, y, width, height)
const boundingArea = new QT.Box(0, 0, window.innerWidth, window.innerHeight);
// Instantiate  the new quadtree
const quadtree = new QT.QuadTree(boundingArea);

const colorMap = new Map([
    [ 0, "#aceac3"], 
    [ 1, "#da9edc"]
]);
const numberOfColors = colorMap.size;

let alignModifier = 1;
let cohesionModifier = 1;
let separationModifier = 1.2;


function setup(){
    createCanvas(windowWidth,windowHeight);
    frameRate(60);

    for (let i = 0; i < 500; i++){
        flock.push( new Boid());
    }
    
}


function draw(){
    background(51);
    quadtree.clear();
    quadtree.insert(flock);
    for (let boid of flock){
        boid.avoidEdges();
        boid.applyRules(flock, alignModifier, separationModifier, cohesionModifier);
        boid.updateBoids();
        boid.showBoid();
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


document.getElementById("align-slider").onchange = function () {
    alignModifier = this.value;
};
document.getElementById("cohesion-slider").onchange = function () {
    cohesionModifier = this.value;
};
document.getElementById("seperation-slider").onchange = function () {
    separationModifier = this.value;
};