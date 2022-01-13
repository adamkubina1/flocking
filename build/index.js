


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
let separationModifier = 1.25;


let sim = new Simulation({
    boidsCount: 200,
    maxBoids: 500,

    maxSpeed: 3.5,
    maxForce: 1,
    percepetion: 50,

    alignModifier: 1,
    cohesionModifier: 1,
    separationModifier: 1.25, //Increased separation for nicer visuals 

    racism: 0,
    numberOfColors: numberOfColors,

    tree: quadtree,
    boids: flock,
    colorMap: colorMap,
    obstacles: "",
    predators: "",
});


function setup(){
    createCanvas(windowWidth,windowHeight);
    frameRate(60);


    sim.initilize();
    // for (let i = 0; i < 200; i++){
    //     flock.push( new Boid());
    // }
    
}


function draw(){
    background(51);
    // quadtree.clear();
    // quadtree.insert(flock);

    sim.tree.clear();
    sim.tree.insert(sim.boids);
    // for (let boid of flock){
    //     boid.avoidEdges();
    //     boid.applyRules(flock, alignModifier, separationModifier, cohesionModifier);
    //     boid.updateBoids();
    //     boid.showBoid();
    // }
    for (let boid of sim.boids){
        boid.avoidEdges();
        boid.applyRules(sim.boids, sim.alignModifier, sim.separationModifier, sim.cohesionModifier);
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