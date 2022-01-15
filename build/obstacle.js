class Obstacle {
    constructor(x, y, simulation) {
        // //Must keep those for quadtree
        this.x = x;
        this.y = y;

        this.obstacleSize = simulation.obstacleSize;

        this.position = createVector( this.x, this.y );
    }

    showObstacle(){
        strokeWeight(this.obstacleSize);
        stroke(255);
        point(this.position.x, this.position.y);
    }
}