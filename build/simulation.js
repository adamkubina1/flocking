
/**
 * Simulation holds data for flocking simulation and update those data with update() method
 */
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

        this.racism = simulation.racism; //This must be boolean or 0 - 1

        this.colorMap = simulation.colorMap;
        this.numberOfColors = 1;
        this.maxNumberOfColors = this.colorMap.size;


        this.predatorColor = simulation.predatorColor;
        this.maxSpeedPredator = simulation.maxSpeedPredator;

        this.obstacleSize = simulation.obstacleSize;
        this.obstacleColor = simulation.obstacleColor;

        this.spawn = simulation.spawn;

        this.walls = simulation.walls; //This must be boolean or 0 - 1
    }


    
    /**
     * Initilizes the simulation
     * Should be called after creating Simulation object before usage
     */
    initilize() {
        // Create the bounding area of the quadtree (x, y, width, height)
        const boundingArea = new QT.Box(0, 0, this.width, this.height);
        // Instantiate  the new quadtree
        const quadtree = new QT.QuadTree(boundingArea);

        this.tree = quadtree;

        this.boids = [];
        this.obstacles = [];
        this.predators = [];

        for (let i = 0; i < this.boidsCount; i++){
            this.boids.push( new Boid(this));
        }
    }

    /**
     * Deletes every entity in the simulation
     */
    clear() {
        this.boids = [];
        this.obstacles = [];
        this.predators = [];

        this.boidsCount = 0;
    }

    /**
     * Updates state of the simulation for every entity
     */
    update() {
        // Destroys and builds again new quadTree
        this.tree.clear();
        this.tree.insert(this.boids);
        this.tree.insert(this.obstacles);
        this.tree.insert(this.predators);

        this.boids.forEach(b => {
            if(sim.walls){
                b.bounceEdges();
            } else {
                b.avoidEdges();
            }
            
            b.applyRules(this.tree, this.alignModifier, this.separationModifier, this.cohesionModifier, this.racism, this.perception, (this.desiredDistance + this.boidSize), this.obstacleSize, this); 

            b.updateBoids();

            b.showBoid();
        });

        this.obstacles.forEach(o => {
            o.showObstacle();
        });

        this.predators.forEach(p => {
            if(sim.walls){
                p.bounceEdges();
            } else {
                p.avoidEdges();
            }
            p.applyRulesPredator(this.tree, this.obstacleSize, this.perception)

            p.updatePredator();

            p.showPredator();
        });
    }


    /**
     * Changes colorCodes and colors of boids in the simulation
     * @param {number} newNumberOfColors 
     */
    changeColors( newNumberOfColors ) {
        if(newNumberOfColors <= this.maxNumberOfColors && newNumberOfColors > 0){
            this.numberOfColors = newNumberOfColors;

            this.boids.forEach(b => {
                b.changeColor(this.numberOfColors, this.colorMap);
            });
        }
    }

    /**
     * Changes speed of all boids in the simulation
     * @param {number} newSpeed 
     */
    changeSpeed( newSpeed ){  
        this.maxSpeed = parseInt(newSpeed);

        this.boids.forEach(b => {
            b.maxSpeed = this.maxSpeed;
        });
    }

    /**
     * Changes size of all boids and predators in simulation
     * @param {number} newSize 
     */
    changeSize( newSize ){  
        this.boidSize = parseInt(newSize);

        this.boids.forEach(b => {
            b.boidSize = this.boidSize;
        });

        this.predators.array.forEach(p => {
            p.boidSize = this.boidSize * 2;
        });
    }

    /**
     * Spawns boid at specific location
     * @param {number} x - x coordinate of spawn location
     * @param {number} y - y coordinate of spawn location
     */
    spawnBoid(x, y){
        if(this.boidsCount < this.maxBoids){
            this.changeBoidsCount(this.boidsCount + 1);
            this.boids[this.boids.length - 1].position = createVector(x, y);
        }
    }

    /**
     * Spawns obstacle at specific location
     * @param {number} x - x coordinate of spawn location
     * @param {number} y - y coordinate of spawn location
    */
    spawnObstacle(x, y){
        this.obstacles.push(new Obstacle(x, y, this));
    }

    /**
     * Spawns more boids at random location or removes boids - based on newBoidsCount and boidsCount difference
     * @param {number} newBoidsCount 
     */
    changeBoidsCount( newBoidsCount ) {
        if (this.maxBoids >= parseInt(newBoidsCount) && parseInt(newBoidsCount) >= 0){
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

    /**
     * Spawns predator at specific location
     * @param {number} x - x coordinate of spawn location
     * @param {number} y - y coordinate of spawn location
    */
    spawnPredator(x, y){
        let predator = new Predator(x, y, this);

        this.predators.push(predator);
    }

    /**
     * Removes specific boid from simulation
     * @param {Boid} boid 
     */
    destroyBoid( boid ){
        const index = this.boids.indexOf( boid );
        if (index > -1) {
            this.boids.splice(index, 1);
            this.boidsCount--;
        }
    }
}