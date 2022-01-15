class Predator {
    constructor(x, y, simulation){
        
        this.conteinerHeight = simulation.height;
        this.conteinerWidth = simulation.width;

        this.color = simulation.predatorColor;

        this.maxSpeedPredator = simulation.maxSpeedPredator;
        this.maxForce = simulation.maxForce;

        this.boidSize = simulation.boidSize * 3;
        this.position = createVector(x, y);

        this.walls = simulation.walls;

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(this.maxSpeedPredator));
        
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

    steerPredator(points, obstacleSize){
                
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
                let avoidDistance = obstacleSize + this.boidSize;

                if(d <= avoidDistance){
                    
                    let diff = p5.Vector.sub(this.position, b.position);
                    
                    obstacleSteer.add(diff);
                    nearObstacles++;
                }
            } else if(b instanceof Predator && b != this){
                let avoidDistance = b.boidSize + this.boidSize;

                if(d <= avoidDistance){
                    
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
        this.velocity.limit(this.maxSpeedPredator);
        

        this.acceleration.mult(0);
    }

    showBoid(){
        strokeWeight(this.boidSize);
        stroke(this.color);
        point(this.position.x, this.position.y);
    }

}