class Boid {
    constructor(){
        //Random int from 0 to width/height
        let x = random(width);
        let y = random(height);
        let colorCode = Math.round(random(numberOfColors - 1));

        this.x = x;
        this.y = y;

        //This is used for racism
        this.colorCode = colorCode;
        //This is used for visuals
        this.color = colorMap.get(colorCode);

        this.maxSpeed = 3.5;
        this.maxForce = 1;

        this.boidSize = 3;
        this.position = createVector(x, y);

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        
        this.acceleration = createVector();
        
        
    }

    avoidEdges(){
        if(this.position.x > width){
            this.position.x = this.boidSize;
        }else if (this.position.x < 0){
            this.position.x = width - this.boidSize;
        }
    
        if(this.position.y > height){
            this.position.y = this.boidSize;
        }else if (this.position.y < 0){
            this.position.y = height - this.boidSize;
        }
    }


    steer(boids, alignModifier, separationModifier, cohesionModifier){
        
        // If in the viewing distance of the boid is only boid itself -> we are returning empy vector
        if (boids.length < 2){
            return createVector();
        }

        

        let nearBoidCount = 0;
        let desiredDistance = 20;

        let steeringAlign = createVector();
        let steeringCohesion = createVector();
        let steeringSeperation = createVector();
        let steeringNoise = createVector();
        let steering = createVector();


        boids.forEach(b => {
            if( b != this ){
                let d = dist(
                    this.position.x,
                    this.position.y,
                    b.position.x,
                    b.position.y
                );
                
                

                steeringCohesion.add(b.position);

                steeringAlign.add(b.velocity);

                if(d < desiredDistance){
                    let diff = p5.Vector.sub(this.position, b.position);
                    diff.div(d);
                    steeringSeperation.add(diff);
                }


                nearBoidCount++;
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

            steeringSeperation.div(nearBoidCount);
            steeringSeperation.setMag(this.maxSpeed);
            steeringSeperation.sub(this.velocity);
            steeringSeperation.limit(this.maxForce);

            
        }

        steeringAlign.mult(parseFloat(alignModifier));
        steeringCohesion.mult(parseFloat(cohesionModifier));
        steeringSeperation.mult(parseFloat(separationModifier));

        steering.add(steeringAlign);
        steering.add(steeringCohesion);
        steering.add(steeringSeperation);

        return steering;
    }

    applyRules(boids, alignModifier, separationModifier, cohesionModifier){

        const points = quadtree.query(new QT.Circle(this.x, this.y, 50));

        let steer = this.steer(points, alignModifier, separationModifier, cohesionModifier);

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
}