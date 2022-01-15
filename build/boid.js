/**
 * Boid hold information about boid entity, information are updated in update() and applyRules() methods
 */
class Boid {
    /**
     * @param {Object} simulation - Simulation object where the boid will be located
     */
    constructor(simulation){

        let colorCode = Math.round(random(simulation.numberOfColors - 1));

        this.conteinerHeight = simulation.height;
        this.conteinerWidth = simulation.width;

        //This is used for racism
        this.colorCode = colorCode;
        //This is used for visuals
        this.color = simulation.colorMap.get(colorCode);

        this.maxSpeed = simulation.maxSpeed;
        this.maxForce = simulation.maxForce;

        this.boidSize = simulation.boidSize;

        this.position = createVector(random(simulation.width), random(simulation.height));

        this.walls = simulation.walls;

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(this.maxSpeed));
        
        this.acceleration = createVector();
    }

    /**
     * If this.walls is false makes boid on impact with wall teleport on the other side
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
     * If this.walls is true boid predator on impact with wall bounce from it
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
     * Calculate the steering vector based on entities in the proximity visible to the boid
     * @param {array} points - array of entities in the simulation (Boids, Obstacles, Predators)
     * @param {number} alignModifier - sets weight of alignment rule
     * @param {number} separationModifier - sets weight of separation rule
     * @param {number} cohesionModifier - sets weight of cohesion rule
     * @param {boolean} racism - true: boids are only separeting from other colors
     * @param {number} desiredDistance - distance that boids seek from other boids
     * @param {Simulation} simulation - reference to the simulation where boids are spawned - used to deleting
     * @returns steering vector
     */
    steer(points, alignModifier, separationModifier, cohesionModifier, racism, desiredDistance, simulation){
        
        // If in the viewing distance of the boid is only boid itself -> we are returning empy vector
        if (points.length < 2){
            return createVector();
        }

        let nearBoidCount = 0;
        let nearBoidCountSep = 0;
        let nearObstacles = 0;
        let nearPredators = 0;
        
        let steeringAlign = createVector();
        let steeringCohesion = createVector();
        let steeringSeperation = createVector();
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
            if( b instanceof Boid && b != this){
                if( (this.colorCode == b.colorCode || !racism) && b.colorCode != -1){

                    steeringCohesion.add(b.position);
    
                    steeringAlign.add(b.velocity);
    
                    if(d <= desiredDistance){
                        let diff = p5.Vector.sub(this.position, b.position);
                        diff.div(d*d);
                        steeringSeperation.add(diff);
                        nearBoidCountSep++;
                    }
    
                    nearBoidCount++;
                } else if (this.colorCode != b.colorCode && racism && b.colorCode != -1) {
                    if(d <= desiredDistance){
                        let diff = p5.Vector.sub(this.position, b.position);
                        
                        steeringSeperation.add(diff);
                        nearBoidCountSep++;
                    }
                }
            } else if( b instanceof Predator ){
                    
                if( d < b.boidSize){
                    simulation.destroyBoid(this);
                }

                if(d <= this.perception){
                    let diff = p5.Vector.sub(this.position, b.position);
                
                    obstacleSteer.add(diff);
                    nearPredators++;
                }
            } else if( b instanceof Obstacle) {
                let avoidDistance = b.obstacleSize + this.boidSize;

                if(d < avoidDistance){
                    
                    let diff = p5.Vector.sub(this.position, b.position);
                    
                    obstacleSteer.add(diff);
                    nearObstacles++;
                }
            }   

        });

        //We are dividing with nearBoidCount, so it can not be zero
        if(nearBoidCount > 0){
            steeringAlign.div(nearBoidCount);
            steeringAlign.setMag(this.maxSpeed);
            steeringAlign.sub(this.velocity);
            steeringAlign.limit(this.maxForce);

            steeringCohesion.div(nearBoidCount);
            steeringCohesion.sub(this.position);
            steeringCohesion.setMag(this.maxSpeed);
            steeringCohesion.sub(this.velocity);
            steeringCohesion.limit(this.maxForce);

        }
        if(nearBoidCountSep > 0){
            steeringSeperation.div(nearBoidCountSep);
            steeringSeperation.setMag(this.maxSpeed);
            steeringSeperation.sub(this.velocity);
            steeringSeperation.limit(this.maxForce);
        }
        if(nearObstacles > 0){
            obstacleSteer.div(nearObstacles);
            obstacleSteer.setMag(this.maxSpeed);
            obstacleSteer.sub(this.velocity);
            obstacleSteer.limit(this.maxForce);
        }
        if( nearPredators > 0){
            predatorSteer.div(nearPredators);
            predatorSteer.setMag(this.maxSpeed);
            predatorSteer.sub(this.velocity);
            predatorSteer.limit(this.maxForce);
        }

        steeringNoise.setMag(this.maxSpeed);
        steeringNoise.sub(this.velocity);
        steeringNoise.limit(this.maxForce);

        steeringAlign.mult(parseFloat(alignModifier));
        steeringCohesion.mult(parseFloat(cohesionModifier));
        steeringSeperation.mult(parseFloat(separationModifier));
        steeringNoise.mult(0.2);
        obstacleSteer.mult(2.1);
        predatorSteer.mult(10);

        steering.add(steeringAlign);
        steering.add(steeringCohesion);
        steering.add(steeringSeperation);
        steering.add(steeringNoise);
        steering.add(obstacleSteer);
        steering.add(predatorSteer);

        return steering;
    }

    /**
     * Finds the acceleration vector based on entities in the modified perception radius
     * @param {array} points - array of entities in the simulation (Boids, Obstacles, Predators)
     * @param {number} alignModifier - sets weight of alignment rule
     * @param {number} separationModifier - sets weight of separation rule
     * @param {number} cohesionModifier - sets weight of cohesion rule
     * @param {boolean} racism - true: boids are only separeting from other colors
     * @param {number} desiredDistance - distance that boids seek from other boids
     * @param {number} obstacleSize - size of the obstacles
     * @param {Simulation} simulation - reference to the simulation where boids are spawned - used to deleting
     */
    applyRules(tree, alignModifier, separationModifier, cohesionModifier, racism, perception, desiredDistance, obstacleSize, simulation){

        const points = tree.query(new QT.Circle(this.x, this.y, perception + obstacleSize));

        let steer = this.steer(points, alignModifier, separationModifier, cohesionModifier, racism, desiredDistance, simulation);

        this.acceleration.add(steer);
    }

    /**
     * Adds the velocity vector to the position and adds acceleration vector to the velocity vector
    */
    updateBoids(){
        this.position.add(this.velocity);
        this.x = this.position.x;
        this.y = this.position.y;

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        
        this.acceleration.mult(0);
    }

    /**
    * Draws the boid in the simulation
    */
    showBoid(){
        strokeWeight(this.boidSize);
        stroke(this.color);
        point(this.position.x, this.position.y);
    }

    /**
     * Changes color and color code of the boid
     * @param {number} newNumberOfColors 
     * @param {Map([number, "color code"])} colorMap 
     */
    changeColor( newNumberOfColors, colorMap ){
        this.colorCode = Math.round(random( newNumberOfColors - 1));

        this.color = colorMap.get(this.colorCode);
    }
}