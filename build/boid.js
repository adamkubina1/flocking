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


    steer(boids, alignModifier, separationModifier, cohesionModifier, racism){
        
        // If in the viewing distance of the boid is only boid itself -> we are returning empy vector
        if (boids.length < 2){
            return createVector();
        }

        

        let nearBoidCount = 0;
        let desiredDistance = 20;

        let steeringAlign = createVector();
        let steeringCohesion = createVector();
        let steeringSeperation = createVector();
        let steeringNoise = createVector(); //Free will modifier
        let steering = createVector();


        boids.forEach(b => {
            if( b != this && this.colorCode == b.colorCode){
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

    applyRules(tree, alignModifier, separationModifier, cohesionModifier, racism, perception){

        const points = tree.query(new QT.Circle(this.x, this.y, perception));

        let steer = this.steer(points, alignModifier, separationModifier, cohesionModifier, racism);

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