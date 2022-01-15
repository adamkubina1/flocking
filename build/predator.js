/**
 * Predator hold information about predator entity, information are updated in update() and applyRules() methods
 */
class Predator {
    /**
     * @param {number} x - X coordinate of spawn location
     * @param {number} y - Y coordinate of spawn location
     * @param {Object} simulation - simulation where object is being spawned
     */
    constructor(x, y, simulation){
        
        this.conteinerHeight = simulation.height;
        this.conteinerWidth = simulation.width;

        this.color = simulation.predatorColor;

        this.maxSpeedPredator = simulation.maxSpeedPredator;
        this.maxForce = simulation.maxForce;

        this.boidSize = simulation.boidSize * 3;

        this.x = x;
        this.y = y;
        this.position = createVector(this.x, this.y);

        this.walls = simulation.walls;

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(this.maxSpeedPredator));
        
        this.acceleration = createVector();
    }

    /**
     * If this.walls is false makes predator on impact with wall teleport on the other side
     */
    avoidEdges(){
        if(this.position.x > this.conteinerWidth){
            this.position.x = this.boidSize;
        }else if (this.position.x < 0){
            this.position.x = this.conteinerWidth - this.boidSize;
        }
    
        if(this.position.y > this.conteinerHeight){
            this.position.y = this.boidSize;
        }else if (this.position.y < 0){
            this.position.y = this.conteinerHeight - this.boidSize;
        }
    }

    /**
     * If this.walls is true makes predator on impact with wall bounce from it
     */
    bounceEdges(){
        if(this.position.x < this.boidSize){
            this.position.x = this.boidSize;
        } else if( this.position.x > this.conteinerWidth - this.boidSize){
            this.position.x = this.conteinerWidth - this.boidSize;
        }
        if (this.position.y < this.boidSize) {
            this.position.y = this.boidSize;
        } else if( this.position.y > this.conteinerHeight - this.boidSize) {
            this.position.y = this.conteinerHeight - this.boidSize;
        }


        if(this.position.x >= this.conteinerWidth - this.boidSize){
            this.velocity.rotate(180);
        }else if (this.position.x <= this.boidSize ){
            this.velocity.rotate(180);
        }
    
        if(this.position.y >= this.conteinerHeight - this.boidSize){
            this.velocity.rotate(180);
        }else if (this.position.y <= this.boidSize){
            this.velocity.rotate(180);
        }
    }

    /**
     * Calculate the steering vector based on entities in the proximity visible to the predator
     * @param {array} points - array of entities in the simulation (Boids, Obstacles, Predators)
     * @returns steering vector
     */
    steerPredator(points){
                
        // If in the viewing distance of the boid is only boid itself -> we are returning empy vector
        if (points.length < 2){
            return createVector();
        }

        let nearBoidCount = 0;
        let nearObstacles = 0;
        let nearPredators = 0;
        
        let steeringAlign = createVector();
        let steeringCohesion = createVector();
        let steeringNoise = p5.Vector.random2D();
        let steering = createVector();
        let obstacleSteer = createVector();
        let predatorSteer = createVector();

        points.forEach(b => {
            let d = dist(
                this.position.x,
                this.position.y,
                b.position.x,
                b.position.y
            );
            if( b instanceof Boid ){
                if( b != this ){
                    steeringCohesion.add(b.position);
    
                    steeringAlign.add(b.velocity);

                    nearBoidCount++;
                }
            } else if( b instanceof Obstacle) {
                let avoidDistance = b.obstacleSize + this.boidSize;

                if(d < avoidDistance){
                    
                    let diff = p5.Vector.sub(this.position, b.position);
                    
                    obstacleSteer.add(diff);
                    nearObstacles++;
                }
            } else if(b instanceof Predator && b != this){
                let avoidDistance = b.boidSize + this.boidSize;

                if(d < avoidDistance){
                    
                    let diff = p5.Vector.sub(this.position, b.position);
                    
                    predatorSteer.add(diff);
                    nearPredators++;
                }
            }
        });
        if(nearBoidCount > 0){
            steeringAlign.div(nearBoidCount);
            steeringAlign.setMag(this.maxSpeedPredator);
            steeringAlign.sub(this.velocity);
            steeringAlign.limit(this.maxForce);

            steeringCohesion.div(nearBoidCount);
            steeringCohesion.sub(this.position);
            steeringCohesion.setMag(this.maxSpeedPredator);
            steeringCohesion.sub(this.velocity);
            steeringCohesion.limit(this.maxForce);

        }
        if(nearObstacles > 0){
            obstacleSteer.div(nearObstacles);
            obstacleSteer.setMag(this.maxSpeedPredator);
            obstacleSteer.sub(this.velocity);
            obstacleSteer.limit(this.maxForce);
        }
        if(nearPredators > 0){
            predatorSteer.div(nearPredators);
            predatorSteer.setMag(this.maxSpeedPredator);
            predatorSteer.sub(this.velocity);
            predatorSteer.limit(this.maxForce);
        }

        steeringNoise.setMag(this.maxSpeedPredator);
        steeringNoise.sub(this.velocity);
        steeringNoise.limit(this.maxForce);


        steeringAlign.mult(2);
        steeringCohesion.mult(2);

        steeringNoise.mult(0.2);
        obstacleSteer.mult(3);
        predatorSteer.mult(1);


        steering.add(steeringAlign);
        steering.add(steeringCohesion);
        steering.add(steeringNoise);
        steering.add(obstacleSteer);
        steering.add(predatorSteer);

        return steering;
    }

    /**
     * Finds the acceleration vector based on entities in the modified perception radius
     * @param {Quadtree} tree - quadtree holding positions of entities in the simulation
     * @param {number} obstacleSize - current size of obstacles
     * @param {number} perception - defines how far is the object needs to be before predator reacts to it
     */
    applyRulesPredator(tree, obstacleSize, perception){
        const points = tree.query(new QT.Circle(this.x, this.y, perception * 2 + obstacleSize));

        let steer = this.steerPredator(points);

        this.acceleration.add(steer);
    }

    /**
     * Adds the velocity vector to the position and adds acceleration vector to the velocity vector
     */
    updatePredator(){
        this.position.add(this.velocity);

        this.x = this.position.x;
        this.y = this.position.y;

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeedPredator);
        
        this.acceleration.mult(0);
    }

    /**
     * Draws the predator in the simulation
     */
    showPredator(){
        strokeWeight(this.boidSize);
        stroke(this.color);
        point(this.position.x, this.position.y);
    }

}