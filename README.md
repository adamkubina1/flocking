# Flocking
Simulation of natural behavior of flock made with p5.js library.
Based on the algorithm by Craig Reynolds with added quadtree to decrease time complexity from O(n^2) to O(n*log(n)).

All of the attributes of boids can be tweaked with sliders, but with higher number of boids present certain changes can bring the perfomance down.
Especially increasing cohesion and decreasing introversion will create tightly packed clusters, which are due to the nature of quadtree more difficult to operate with.
Moreover you can add obstacles to the simulation and predatory boids, which "hunt" and "eat" other boids.

Created as a final assignment for Web technologies course at VSE.

![flocking](https://user-images.githubusercontent.com/87360961/156839514-e6fda609-7786-411d-bd52-8cd31814f8ed.png)
![flocking1](https://user-images.githubusercontent.com/87360961/156839136-f8d01803-91ad-4807-9924-100859853522.png)

Live demo <a href="https://flock-sim.netlify.app/" target="_blank">here</a>
