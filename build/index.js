
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
    boidSize: 3,

    alignModifier: 1,
    cohesionModifier: 1,
    separationModifier: 1.25, //Increased separation for nicer visuals 

    racism: 1, //Racism 1 is no racism, 0 is full racism
    colorMap: colorMap
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
    sim.alignModifier = this.value;
};
document.getElementById("cohesion-slider").onchange = function () {
    sim.cohesionModifier = this.value;
};
document.getElementById("seperation-slider").onchange = function () {
    sim.separationModifier = this.value;
};
document.getElementById("racism-slider").onchange = function () {
    sim.racism = this.value;
};
document.getElementById("colors-slider").onchange = function () {
    sim.changeColors(this.value);
};