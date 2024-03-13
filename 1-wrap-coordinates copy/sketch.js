// Define the canvas and create a Matter.js engine
var canvas = document.getElementById('canvas');
var engine = Matter.Engine.create();

// Create a new Matter.js body and set its y-coordinate to 300
var movableBody = Matter.Bodies.rectangle(200, 200, 50, 50, {
  render: {
    fillStyle: 'red'
  }
});
movableBody.position.y = 300; // Set the y-coordinate to 300

// Add the body to the Matter.js engine
Matter.World.add(engine.world, [movableBody]);

// Create a constraint to lock the body's y-coordinate to 300
var lockYConstraint = Matter.Constraint.create({
  pointA: { x: movableBody.position.x, y: 300 },
  bodyB: movableBody,
  pointB: { x: 0, y: 0 },
  stiffness: 1,
  length: 0
});
Matter.World.add(engine.world, [lockYConstraint]);

// Add a mouse constraint to allow the body to be dragged
var mouse = Matter.Mouse.create(canvas);
var mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false
    }
  }
});
Matter.World.add(engine.world, mouseConstraint);

// Render the scene using p5.js
function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(0);

  // Draw the Matter.js bodies using p5.js
  var bodies = engine.world.bodies;
  for (var i = 0; i < bodies.length; i++) {
    var vertices = bodies[i].vertices;
    beginShape();
    for (var j = 0; j < vertices.length; j++) {
      vertex(vertices[j].x, vertices[j].y);
    }
    endShape(CLOSE);
  }

  // Update the Matter.js engine
  Matter.Engine.update(engine);
}
