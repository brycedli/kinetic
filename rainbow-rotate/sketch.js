let stars = [];
let words = [];
let position;
var startTime = null;
let randomCircle = [];

function preload() {
  stars[0] = loadImage("red_star.png");
  stars[1] = loadImage("green_star.png");
  stars[2] = loadImage("blue_star.png");
  words[0] = loadImage("red_hello.png");
  words[1] = loadImage("green_hello.png");
  words[2] = loadImage("blue_hello.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // background(255, 153, 10);
  position =  new p5.Vector(width/2+1,height/2+1);
  
}

function randomizeDirection() {
  let size = 1;
  let offsetAngle = random(0, TWO_PI);
  for (let i = 0; i < stars.length; i++){
    let theta = offsetAngle + TWO_PI * (i) / stars.length;
    randomCircle[i] = createVector(sin(theta), cos(theta)).normalize();
    // randomCircle[i] = createVector(random(-size, size), random(-size, size)).normalize();
  }
}
function draw() { 
  blendMode(BLEND)
  background(0, 12);
  blendMode(SCREEN);
  imageMode(CENTER);
  let total = 6;
  tint(255, 120);
  let speed = 0.03;
  let orbit = new p5.Vector(sin(frameCount * speed), cos(frameCount * speed)).mult(width/8).add(createVector(width/2, height/2));
  let directionToMouse = p5.Vector.sub(createVector(orbit.x, orbit.y), position).mult(0.1);
  for (let i = 0; i < stars.length; i++) {
    for (let n = 0; n < total; n++){
      push();
      let offsetI = i/stars.length;
      let offsetN = n/total;
      let scale = offsetI * offsetN * 6;
      let offset = directionToMouse.copy().mult(scale);
      translate(position.x, position.y)
      let bumpScale = 1;
      rotate(i * TWO_PI / 100 + frameCount * 0.03);
      // translate(i * 5 * bumpScale, i * 3 * bumpScale);
      
      // translate(width/2, height/2);
      // translate(offset.x, offset.y)
      image(stars[i], 0, 0);
      pop();
    }
    
  }
  
  position.add(directionToMouse);
  
  
}


function mousePressed() {
  randomizeDirection();
  startTime = millis();
}


