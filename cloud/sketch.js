let cloud;
let font;
let textPoints;
let oldPoints;
let timeEnded;
let wordList = [
                "AaBbCcDdEeFf",
                "GgHhIiJjKkLlMm",
                "NnOoPpQqRrSsTt", 
                "UuVvWwXxYyZz",

              ];
let wordPositions = [];
let wordIndex = 0;
let centroid;
let wordBox;
let oldWordBox;
let noiseScale = 20;
let noiseSampleScale = 0.003;
let deviation = 0.1;
let noiseSpeed = 0.01;
let noiseRotation = 0.003;
let cloudBuffers = [];
let bg;
let input;

function preload() {
  cloud = loadImage("cloud-lighter.png");
  font = loadFont('CirrusCumulus.otf');
  bg = loadImage("bg.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
 
  let n = 30;
  for (let i = 0; i < n; i++) {
    
    let bufferSize = 64;
    let cloudBuffer = createGraphics(bufferSize, bufferSize);
    
      cloudBuffer.tint(255, map(i, n, 0, 0, 255));
      cloudBuffer.image(cloud, 0, 0, bufferSize, bufferSize);
    
    
    cloudBuffers.push(cloudBuffer);
    
  }
  wordList.forEach(w => {
    // wordPositions.push({kew: w, p: {x: random(width), y: random(height)}})
    // wordPositions.push(w);
    wordPositions[w] = {x: random(width), y: random(height)}
  })
  input = createInput();
  input.value("abcdefg");
  input.position(20, 65);
  newWord(input.value());
  /*//
  let cloudBuffer = createImage(64, 64);
    cloudBuffer.copy(cloud, 0, 0, cloud.width, cloud.height, 0, 0, 50, 50);
    // tint(255, 255 * (1 - i / 60));
    cloudBuffers.push(cloudBuffer);
  */
  // textPoints = font.textToPoints(wordList[wordIndex], 100, height/2, 300, { sampleFactor:  0.08 });
}

function draw() { 
  newWord(input.value());
  image(bg, 0, 0, windowWidth, windowHeight);
  // background(bgColor);
  let t = 0;
  let period = 3000;
  let period2 = 3000;
  let period3 = 3000;
  
    points = textPoints.map(p => {
      return createVector(p.x - wordBox.w/2 + width/2, p.y - wordBox.h/2 + height/2);
    });
  

  
  let i = 0;

  
  points.forEach(p =>  {
    let n = noise(p.x, p.y);
    // let nSquaredNormalized = n*n * 0.5 + 0.5;
    let nSquaredNormalized = min(1/(n*n), 5);
    let cloudIndex = floor(constrain(map(n*n, 5, 0, 0, cloudBuffers.length), 0, cloudBuffers.length - 1));
    let xNoise = map(noise(frameCount* noiseSpeed + i * deviation + p.x * noiseSampleScale), 0, 1, -1, 1);
    let yNoise = map(noise(frameCount* noiseSpeed + i * deviation + p.y * noiseSampleScale), 0, 1, -1, 1);
    push();
    translate(p.x + noiseScale * xNoise, p.y + noiseScale* yNoise);
    rotate(TWO_PI * noise(p.x, p.y));
    imageMode(CENTER)
    let s = 30;
    image(cloudBuffers[cloudIndex], 0, 0, s * nSquaredNormalized * noise(i), s * nSquaredNormalized * noise(i));
    pop();
    i++;
  });
  
}
function arcFunction (x) {
  return -4*x*x + 4*x;
}

function keyPressed() {
  
  if (keyCode == LEFT_ARROW) {
    wordIndex = (--wordIndex)%wordList.length;
    newWord(wordList[wordIndex]);
  }
  if (keyCode == RIGHT_ARROW) {
    wordIndex = (++wordIndex)%wordList.length;
    newWord(wordList[wordIndex]);
  }
  
    if (key === 'P') {
        saveCanvas('myCanvas', 'jpg');
    }
  
}
function mousePressed() {
  
}

function gain(  x,  k ) 
{
    let a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
    return (x<0.5)?a:1.0-a;
}

function averagePoints (points) {
  let sum = createVector(0, 0);
  points.forEach(p => sum.add(createVector(p.x, p.y)));
  sum.div(points.length);
  return sum;
}

function newWord (word) {
  // textPoints = font.textToPoints(word, 100, height/2, 300, { sampleFactor:  0.08 });
  textPoints = font.textToPoints(word, 0, 0, 200, { sampleFactor:  0.3 });
  wordBox = font.textBounds(word, 0, 0, 200);
  centroid = averagePoints(textPoints);
}