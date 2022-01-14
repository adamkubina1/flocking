
class Simulation {

    constructor(simulation){
        this.height = simulation.height;
        this.width = simulation.width;
        
        this.boidsCount = simulation.boidsCount;
        this.maxBoids = simulation.maxBoids;

        this.maxSpeed = simulation.maxSpeed;
        this.maxForce = simulation.maxForce;
        this.perception = simulation.perception;
        this.boidSize = simulation.boidSize;
        this.desiredDistance = simulation.desiredDistance;

        this.alignModifier = simulation.alignModifier;
        this.cohesionModifier = simulation.cohesionModifier;
        this.separationModifier = simulation.separationModifier;

        this.racism = simulation.racism;

        this.colorMap = simulation.colorMap;
        this.numberOfColors = 1;
        this.maxNumberOfColors = this.colorMap.size;

        this.obstacleSize = simulation.obstacleSize;

        this.spawn = simulation.spawn;

    }
// code block

    //This method initilize the simulation, it is also called on resets
    initilize() {
        // Create the bounding area of the quadtree (x, y, width, height)
        const boundingArea = new QT.Box(0, 0, this.width, this.height);
        // Instantiate  the new quadtree
        const quadtree = new QT.QuadTree(boundingArea);

        this.tree = quadtree;
        this.boids = [];
        this.obstacles = [];

        for (let i = 0; i < this.boidsCount; i++){
            this.boids.push( new Boid(this));
        }

    }

    update() {
        this.tree.clear();
        this.tree.insert(this.boids);
        this.tree.insert(this.obstacles);
    
        this.boids.forEach(b => {
            if(sim.walls){
                b.bounceEdges();
            } else {
                b.avoidEdges();
            }
            
            b.applyRules(this.tree, this.alignModifier, this.separationModifier, this.cohesionModifier, this.racism, this.perception, (this.desiredDistance + this.boidSize), this.obstacleSize); 

            b.updateBoids();

            b.showBoid();
        });

        this.obstacles.forEach(o => {
            o.showObstacle();
        });
    }

    changeColors( newNumberOfColors ) {
        if(newNumberOfColors <= this.maxNumberOfColors && newNumberOfColors > 0){
            this.numberOfColors = newNumberOfColors;

            this.boids.forEach(b => {
                b.changeColor(this.numberOfColors, this.colorMap);
            });
        }
    }
    changeSpeed( newSpeed ){  
        this.maxSpeed = parseInt(newSpeed);

        this.boids.forEach(b => {
            b.maxSpeed = this.maxSpeed;
        });
    }

    changeSize( newSize ){  
        this.boidSize = parseInt(newSize);

        this.boids.forEach(b => {
            b.boidSize = this.boidSize;
        });
    }

    spawnBoid(x, y){
        if(this.boidsCount < this.maxBoids){
            this.changeBoidsCount(this.boidsCount + 1);
            this.boids[this.boids.length - 1].position = createVector(x, y); //This should be changed to set position on boid initicialization
        }
    }

    spawnObstacle(x, y){
        this.obstacles.push(new Obstacle(x, y, this));
    }

    changeBoidsCount( newBoidsCount ) {
        if (this.maxBoids >= parseInt(newBoidsCount) && parseInt(newBoidsCount) > 0){
            let tmp = this.boidsCount;
            this.boidsCount = parseInt(newBoidsCount);
            
            let change = this.boidsCount - tmp;
            
            // In case of equality we wont do anything
            if( change > 0 ){
                for (let i = 0; i < change; i++){
                    this.boids.push( new Boid(this));
                }
            } else if ( change < 0 ){
                    this.boids.length += change; //Removing boids is LIFO
                }
        }
    }
}