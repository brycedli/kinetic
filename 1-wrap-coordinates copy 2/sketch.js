Matter.use('matter-wrap'); // setup wrap coordinates plugin

let long0;
let long1;

let topBound;
let bottomBound;

let festival = "https://cstudiocoral.s3.amazonaws.com/festival.png";
let of = "https://cstudiocoral.s3.amazonaws.com/of.png";
let the = "https://cstudiocoral.s3.amazonaws.com/the.png";
let winds = "https://cstudiocoral.s3.amazonaws.com/winds.png";

let blocks = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  festival = loadImage(festival);
  of = loadImage(of);
  the = loadImage(the);
  winds = loadImage(winds);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;
  engine.gravity.scale = 0;
  // ball
  

  topBound = new Block(world,
    { x: windowWidth/2, y: windowHeight * -0.5, w: windowWidth, h: 50, color: 'white' },
    { isStatic: true }
  );
  bottomBound = new Block(world,
    { x: windowWidth/2, y: windowHeight * 1.5, w: windowWidth, h: 50, color: 'white' },
    { isStatic: true }
  );
  long0 = new Block(world,
    { x: 200, y: windowHeight/2, w: 500, h: windowHeight, color: 'gray' , mass: 0.001},
    { friction: 0.00, inertia: 0, frictionAir: 0.1,  }
  );

  long1 = new Block(world,
    { x: 350, y: windowHeight/2, w: 200, h: windowHeight, color: 'gray' , mass: 0.001},
    { friction: 0.00, inertia: 0, frictionAir: 0.1, }
  );
  const attributes = {
    x: 900,
    y: 730,
    color: "blue"
  }
  mouse = new Mouse(engine, canvas);
  print(mouse);
  mouse.mouseConstraint.constraint.stiffness = 0.01;
  mouse.mouseConstraint.constraint.damping = 0.1;

  // run the engine
  Matter.Runner.run(engine);
}

const right = Matter.Vector.create(0.1, 0);

function draw() {
  Matter.Body.applyForce(long0.body, long0.body.position, right);
  Matter.Body.applyForce(long1.body, long1.body.position, right);
  Matter.Body.setAngle(long0.body, 0);
  Matter.Body.setAngle(long1.body, 0);
  background(0);
  topBound.draw();
  bottomBound.draw();
  // long0.draw();
  // long1.draw();
  mouse.draw();
  print(long0.body);
  fill(255);
  textSize(128);
  textAlign(CENTER);
  text("Festival", long0.body.position.x, long0.body.position.y);
  text("of", long1.body.position.x, long1.body.position.y);
  noFill(); 
  // fill(255);
  // circle(0, 255, 200);
  strokeWeight(5);
  stroke(255);
  let controlOffset = 200;
  bezier(long0.body.position.x, long0.body.position.y, 
        long0.body.position.x + controlOffset, long0.body.position.y, 
        long1.body.position.x - controlOffset, long1.body.position.y, 
        long1.body.position.x, long1.body.position.y);
}

