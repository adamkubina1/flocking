
class Simulation {

    constructor(simulation){
        
        this.boidsCount = simulation.boidsCount;
        this.maxBoids = simulation.maxBoids;

        this.maxSpeed = simulation.maxSpeed;
        this.maxForce = simulation.maxForce;
        this.perception = simulation.perception;

        this.alignModifier = simulation.alignModifier;
        this.cohesionModifier = simulation.cohesionModifier;
        this.separationModifier = simulation.separationModifier;

        this.racism = simulation.racism;
        this.numberOfColor = simulation.numberOfColor;

        this.tree = simulation.tree;
        this.colorMap = simulation.colorMap;
        this.boids = simulation.boids;
        this.obstacles = simulation.obstacles;
        this.predators = simulation.predators;
    }


    initilize() {
        this.boids = [];

        for (let i = 0; i < this.boidsCount; i++){
            this.boids.push( new Boid());
        }

    }
}