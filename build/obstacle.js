/**
 * Obstacle holds information about obstacle entity
 */
class Obstacle {
    /**
     * @param {number} x - X coordinate of spawn location
     * @param {number} y - Y coordinate of spawn location
     * @param {Object} simulation - simulation where object is being spawned
     */
    constructor(x, y, simulation) {
        // //Must keep those for quadtree
        this.x = x;
        this.y = y;

        this.obstacleSize = simulation.obstacleSize;
        this.obstacleColor = simulation.obstacleColor;

        this.position = createVector( this.x, this.y );
    }

    /**
     * Draws the obstacle on the canvas
     */
    showObstacle(){
        strokeWeight(this.obstacleSize);
        stroke(this.obstacleColor);
        point(this.position.x, this.position.y);
    }
}