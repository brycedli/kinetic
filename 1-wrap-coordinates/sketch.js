Matter.use('matter-wrap'); // setup wrap coordinates plugin

let body0;
let body1;
let body2;
let body3;
let body0Constraint;
let body1Constraint;

let slide;


function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;
  engine.gravity.scale = 0;
  // ball

  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };

  const options = {
    inertia: Infinity,
  }
  
  body3 = new Block(world,
    { x: 300, y: 100, w: 50, h: 50, color: 'white' },
    { friction: 0.01, inertia: Infinity, frictionAir: 0.1, plugin: { wrap: wrap }, collisionFilter: {category: 0b10} }
  );
  body2 = new Block(world,
    { x: 400, y: 100, w: 50, h: 50, color: 'white' },
    { friction: 0.01, inertia: Infinity, frictionAir: 0.1, plugin: { wrap: wrap }, collisionFilter: {category: 0b10} }
  );
  print(body3);
  body0 = new Block(world,
    { x: 200, y: windowHeight/2, w: 50, h: windowHeight, color: 'gray' , mass: 0.001},
    { friction: 0.01, inertia: 0, frictionAir: 0.1, plugin: { wrap: wrap } }
  );
  body1 = new Block(world,
    { x: 350, y: windowHeight/2, w: 50, h: windowHeight, color: 'gray' , mass: 0.001},
    { friction: 0.01, inertia: 0, frictionAir: 0.1, plugin: { wrap: wrap }}
  );
  // body0Constraint = body0.constrainTo(null, {
  //   pointA: { x: 0, y: 0 }, pointB: body0.position, length: 1
  // });
  // body1Constraint = body1.constrainTo(null, {
  //   pointA: { x: 0, y: 0 }, pointB: body0.position, length: 1
  // });
  // setup mouse
  mouse = new Mouse(engine, canvas);
  print(mouse);
  mouse.mouseConstraint.constraint.stiffness = 0.01;
  mouse.mouseConstraint.constraint.damping = 0.01;
  // mouse.mouseConstraint.collisionFilter = {mask: 0b10};

  // run the engine
  Matter.Runner.run(engine);
}

const right = Matter.Vector.create(0.03, 0);
const rightBox = Matter.Vector.create(0.01, 0);

function draw() {

  // Matter.Body.applyForce(body0.body, body0.body.position, right);
  // Matter.Body.applyForce(body1.body, body0.body.position, right);
  Matter.Body.applyForce(body2.body, body0.body.position, right);

  Matter.Body.applyForce(body3.body, body0.body.position, right);
  Matter.Body.setAngle(body0.body, 0);
  Matter.Body.setAngle(body1.body, 0);
  
  // body0Constraint.pointB.y = body0.body.position.y;
  // body0Constraint.pointB.x = body0.body.position.x + 1;
  // body1Constraint.pointB.y = body1.body.position.y;
  // body1Constraint.pointB.x = body1.body.position.x + 1;
  background(0);
  // slide.draw();
  body0.draw();
  body0.drawConstraints();
  body1.draw();
  body2.draw();
  body3.draw();
  mouse.draw();
}
