let cloud;
let bgColor = "#439CE7";
let font;
let textPoints;
let oldPoints;
let timeStarted;
let timeEnded;
let wordList = [
                "Our Capstone",
                "Recap",
                "Change of Air", 
                "Blue Skies",
                "Updates",
                "Weather Forecast",
                "Thanks!"
              ];
let wordPositions = [];
let wordIndex = 0;
let centroid;
let wordBox;
let oldWordBox;
let noiseScale = 20;
let noiseSampleScale = 0.003;
let deviation = 0.2;
let noiseSpeed = 0.01;
let noiseRotation = 0.003;
let cloudBuffers = [];
let bg;

function preload() {
  cloud = loadImage("cloud-lighter.png");
  font = loadFont('CirrusCumulus.otf');
  bg = loadImage("bg.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  newWord(wordList[wordIndex]);
  let n = 30;
  for (let i = 0; i < n; i++) {
    
    let bufferSize = 64;
    let cloudBuffer = createGraphics(bufferSize, bufferSize);
    
      cloudBuffer.tint(255, map(i, n, 0, 30, 255));
      cloudBuffer.image(cloud, 0, 0, bufferSize, bufferSize);
    
    
    cloudBuffers.push(cloudBuffer);
    
  }
  wordList.forEach(w => {
    // wordPositions.push({kew: w, p: {x: random(width), y: random(height)}})
    // wordPositions.push(w);
    wordPositions[w] = {x: random(width), y: random(height)}
  })
  /*//
  let cloudBuffer = createImage(64, 64);
    cloudBuffer.copy(cloud, 0, 0, cloud.width, cloud.height, 0, 0, 50, 50);
    // tint(255, 255 * (1 - i / 60));
    cloudBuffers.push(cloudBuffer);
  */
  // textPoints = font.textToPoints(wordList[wordIndex], 100, height/2, 300, { sampleFactor:  0.08 });
}

function draw() { 
  image(bg, 0, 0, windowWidth, windowHeight);
  // background(bgColor);
  let t = 0;
  let period = 3000;
  let period2 = 3000;
  let period3 = 3000;
  if (timeStarted && oldPoints) {
    
    let i = 0;
    let endT = min(1, (millis() - timeStarted)/period2);
    endT = gain(endT, 2);
    let drawOldpoints = oldPoints.map(p => {
      let xNoise = 2 * noise(endT + i + p.x * noiseSampleScale) - 1;
      let yNoise = 2 * noise(endT + 1 + i + p.y * noiseSampleScale) - 1;

      let from = createVector(p.x - oldWordBox.w/2 + width/2, p.y - oldWordBox.h/2 + height/2);
      // let position = wordPositions[wordList[wordIndex]];
      let position = createVector(width/2, 3 * height/4);
      let to = createVector(position.x, position.y);
      to.add(200 * xNoise, 100 * yNoise);
      let xTimeNoise = map(noise(endT/4 + p.x / 1000), 0, 1, -1, 1);
      let yTimeNoise = map(noise(endT/4 + p.y / 1000), 0, 1, -1, 1);
      let v = p5.Vector.lerp(from, to, endT);
      v.add(createVector(xTimeNoise * 200 * arcFunction(endT), yTimeNoise * 50 * arcFunction(endT)));
      i++;
      return v;
    })
    i = 0;
    let cloudIndex = floor(constrain(map(sqrt(endT * 3), 0, 1, 0, cloudBuffers.length), 0, cloudBuffers.length - 1));
    
    drawOldpoints.forEach(p => {
      let xNoise = map(noise(frameCount* noiseSpeed + i * deviation + p.x * noiseSampleScale), 0, 1, -1, 1);
      let yNoise = map(noise(frameCount* noiseSpeed + i * deviation + p.y * noiseSampleScale), 0, 1, -1, 1);
      push();
      translate(p.x + noiseScale * xNoise, p.y + noiseScale * yNoise);
      rotate(TWO_PI * noise(frameCount* noiseRotation + i));
      imageMode(CENTER)
      image(cloudBuffers[cloudIndex], 0, 0, 25 + 20 * noise(i), 25 + 20 * noise(i));
      // image(cloud, 0, 0, 25 + 20 * noise(i), 25 + 20 * noise(i));
      pop();
      i++;
    })
  }

  if(timeStarted && millis() - timeStarted < period){
    t = min(1, (millis()-timeStarted)/period);

    t = gain (t, 2);
    let i = 0;
    points = textPoints.map(p => {
      let to = createVector(p.x - wordBox.w/2 + width/2, p.y - wordBox.h/2 + height/2);
      
      let xNoise = 2 * noise(t + i + p.x * noiseSampleScale) - 1;
      let yNoise = 2 * noise(t + 1 + i + p.y * noiseSampleScale) - 1;
      // let position = wordPositions[wordList[wordIndex]];
      let position = createVector(width/2, 3 * height/4);

      let from = createVector(position.x, position.y);
      from.add(100 * xNoise, 50 * yNoise);
      
      let xTimeNoise = map(noise(t/4 + p.x / 1000), 0, 1, -1, 1);
      let yTimeNoise = map(noise(t/4 + p.y / 1000), 0, 1, -1, 1);
      let v = p5.Vector.lerp(from, to, t);
      v.add(createVector(xTimeNoise * 200 * arcFunction(t), yTimeNoise * 50 * arcFunction(t)));
      i++;
      return v;
    });
  }
  else{
    points = textPoints.map(p => {
      return createVector(p.x - wordBox.w/2 + width/2, p.y - wordBox.h/2 + height/2);
    });
  }
  
  
  let i = 0;
  let shortT = min(1, (millis() - timeStarted)/period3);
  shortT = gain(shortT, 2);
  let cloudIndex = floor(constrain(map(shortT, 1, 0, 0, cloudBuffers.length), 0, cloudBuffers.length - 1));
  points.forEach(p =>  {
    let xNoise = map(noise(frameCount* noiseSpeed + i * deviation + p.x * noiseSampleScale), 0, 1, -1, 1);
    let yNoise = map(noise(frameCount* noiseSpeed + i * deviation + p.y * noiseSampleScale), 0, 1, -1, 1);
    push();
    translate(p.x + noiseScale * xNoise, p.y + noiseScale* yNoise);
    rotate(TWO_PI * noise(frameCount* noiseRotation + i));
    imageMode(CENTER)
    image(cloudBuffers[cloudIndex], 0, 0, 25 + 20 * noise(i), 25 + 20 * noise(i));
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
  timeStarted = millis();
  // textPoints = font.textToPoints(word, 100, height/2, 300, { sampleFactor:  0.08 });
  oldPoints = textPoints;
  oldWordBox = wordBox;
  timeEnded = millis();
  textPoints = font.textToPoints(word, 0, 0, 200, { sampleFactor:  0.15 });
  wordBox = font.textBounds(word, 0, 0, 200);
  centroid = averagePoints(textPoints);
}