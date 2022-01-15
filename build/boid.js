class Boid {
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



    steer(points, alignModifier, separationModifier, cohesionModifier, racism, desiredDistance, obstacleSize, simulation){
        
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
        let steeringNoise = p5.Vector.random2D(); //Free will modifier?
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
                let avoidDistance = obstacleSize + this.boidSize;

                if(d <= avoidDistance){
                    
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
        obstacleSteer.mult(3);
        predatorSteer.mult(100);

        steering.add(steeringAlign);
        steering.add(steeringCohesion);
        steering.add(steeringSeperation);
        steering.add(steeringNoise);
        steering.add(obstacleSteer);
        steering.add(predatorSteer);

        return steering;
    }

    steerPredator(points, obstacleSize){
                
        // If in the viewing distance of the boid is only boid itself -> we are returning empy vector
        if (points.length < 2){
            return createVector();
        }

        let nearBoidCount = 0;
        let nearObstacles = 0;
        
        let steeringAlign = createVector();
        let steeringCohesion = createVector();
        let steeringNoise = p5.Vector.random2D();
        let steering = createVector();
        let obstacleSteer = createVector();

        points.forEach(b => {
            let d = dist(
                this.position.x,
                this.position.y,
                b.position.x,
                b.position.y
            );
            if( b instanceof Boid ){
                if( b != this && b.colorCode != this.colorCode){
                    steeringCohesion.add(b.position);
    
                    steeringAlign.add(b.velocity);

                    nearBoidCount++;
                }
            } else if( b instanceof Obstacle) {
                let avoidDistance = obstacleSize + this.boidSize;

                if(d <= avoidDistance){
                    
                    let diff = p5.Vector.sub(this.position, b.position);
                    
                    obstacleSteer.add(diff);
                    nearObstacles++;
                }
            }
        });
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
        if(nearObstacles > 0){
            obstacleSteer.div(nearObstacles);
            obstacleSteer.setMag(this.maxSpeed);
            obstacleSteer.sub(this.velocity);
            obstacleSteer.limit(this.maxForce);
        }

        steeringNoise.setMag(this.maxSpeed);
        steeringNoise.sub(this.velocity);
        steeringNoise.limit(this.maxForce);

        // steeringAlign.mult(3);
        // steeringCohesion.mult(3);
        steeringNoise.mult(0.2);
        obstacleSteer.mult(3);

        steering.add(steeringAlign);
        steering.add(steeringCohesion);
        steering.add(steeringNoise);
        steering.add(obstacleSteer);

        return steering;
    }

    applyRules(tree, alignModifier, separationModifier, cohesionModifier, racism, perception, desiredDistance, obstacleSize, simulation){

        const points = tree.query(new QT.Circle(this.x, this.y, perception + obstacleSize));

        let steer = this.steer(points, alignModifier, separationModifier, cohesionModifier, racism, desiredDistance, obstacleSize, simulation);

        this.acceleration.add(steer);
    }

    applyRulesPredator(tree, obstacleSize, perception){
        const points = tree.query(new QT.Circle(this.x, this.y, perception * 2 + obstacleSize));

        let steer = this.steerPredator(points, obstacleSize);

        this.acceleration.add(steer);
    }

    updateBoids(){

        this.position.add(this.velocity);
        this.x = this.position.x;
        this.y = this.position.y;
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        

        this.acceleration.mult(0);
    }

    showBoid(){
        strokeWeight(this.boidSize);
        stroke(this.color);
        point(this.position.x, this.position.y);
    }


    changeColor( newNumberOfColors, colorMap ){
        this.colorCode = Math.round(random( newNumberOfColors - 1));

        this.color = colorMap.get(this.colorCode);
    }
}