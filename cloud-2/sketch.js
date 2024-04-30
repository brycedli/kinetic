let cloudURLs = ["/clouds/cloud-1.png", "/clouds/cloud-2.png", "/clouds/cloud-3.png"];
// let cloudURLs = ["cloud_1.png"];
let clouds = [];
let font;
let cloudBuffers = [];
let bg;
let textInput;
let scaleSlider, imageInput;
let userImage;
let backgroundSelect;
let imageScale;
let thresholdSliderUpper;
let thresholdSliderLower;
let invertImage = false;

let finalPoints = []
let pointCount = 2000

let textPoints;
function preload() {
  cloudURLs.forEach(url => {
    let cloud = loadImage(url);
    clouds.push(cloud);
  })
  // userImage = loadImage("sample.png")
  font = loadFont('CirrusCumulus.otf');
  bg = loadImage("bg.png");
  
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  let n = 20;
  clouds.forEach(c => {
    let buffer = [];
    cloudBuffers.push(buffer);
    for (let i = 0; i < n; i++) {
      let bufferSize = 16;
      let cloudBuffer = createGraphics(bufferSize, bufferSize);
      cloudBuffer.tint(255, map(i, 0, n, 10, 40));
      cloudBuffer.image(c, 0, 0, bufferSize, bufferSize);
      buffer.push(cloudBuffer);
    }
  })
/*
  imageInput = createFileInput(handleFile);
  imageInput.position(20, 20);

  scaleSlider = createSlider(0, 255);
  scaleSlider.value(128)
  scaleSlider.position(20, 100);
*/
  // textInput = createInput();
  textInput = document.getElementById("input");
  textInput.value = "hello sky";
  // textInput.value("hello sky");
  // textInput.position(20, 65);
  
  /*

  backgroundSelect = createSelect();
  backgroundSelect.position(20, 140);
  backgroundSelect.option('sky');
  backgroundSelect.option('black');
  backgroundSelect.value('sky');
  
  imageScale = createSlider(0, 255);
  imageScale.position(20, 170);
  imageScale.value(128)

  thresholdSliderUpper = createSlider(0, 255);
  thresholdSliderUpper.position(20, 200);
  thresholdSliderUpper.value(255)
  thresholdSliderLower = createSlider(0, 255);
  thresholdSliderLower.position(20, 230);
  thresholdSliderLower.value(0)
*/
  // textPoints = font.textToPoints(textInput.value(), 0, 0, 200, { sampleFactor: 0.2 });
  for (let i = 0; i < pointCount; i++) { 
    let bounds = font.textBounds(textInput.value, 0, 0, 200)
    finalPoints.push(new Cloud(
      random(width/2 - bounds.w/2, width/2 + bounds.w/2), 
      random(height/2 - bounds.h/2, height/2 + bounds.h/2), 0)
    )
  }
}

function keyPressed() {
  if (key === 'P') {
    saveCanvas('myCanvas', 'jpg');
  }
  if (key == "i"){
    invertImage = !invertImage
  }

  
}

function draw() {
  /*
  if (backgroundSelect.value() == 'sky'){
    background(bg);
  }
  if (backgroundSelect.value() == 'black'){
    background(0);
  }*/
  background(bg);
  
  // let s = scaleSlider.value() / 255;
  let s = 0.5;
  let imageScaleValue = 0.5;
  
  let imageSampleSize = 2000
  if (userImage){
    // image(userImage, 0, 0, userImage.width, userImage.height)
    
    randomSeed(0)
    let tries = 0
    let maxTries = 2000
    // for (let i = 0; i < imageSampleSize; i++) {
    let imagePoints = [];
    while(imagePoints.length < imageSampleSize && tries < maxTries) {
      let px = random(0, userImage.width)
      let py = random(0, userImage.height)
      let pixelVal = brightness(userImage.get(px, py))
      if (invertImage) {
        pixelVal = 100 - pixelVal
      }
      if (pixelVal > thresholdSliderUpper.value()/255 * 100 || pixelVal < thresholdSliderLower.value()/255 * 100) {
        tries ++
        continue
      }
      pixelVal = map(pixelVal, 0, 100, 0.01, 0.99)
      
      let imgScale = imageScale.value()/255
      px = map(px, 0, userImage.width, width/2 - userImage.width * imgScale / 2, width/2 + userImage.width * imgScale / 2)
      py = map(py, 0, userImage.height, height/2 - userImage.height * imgScale / 2, height/2 + userImage.height * imgScale / 2)
      imagePoints.push(createVector(px, py))
    }
    for (let i = 0; i < pointCount; i++) {
      if (i < imagePoints.length) {
        finalPoints[i].target = createVector(imagePoints[i].x, imagePoints[i].y, 1)
      }
      else{

        finalPoints[i].target = createVector(finalPoints[i].position.x, finalPoints[i].position.y, 0)
      }
    }
  }
  else {
    
    textPoints = font.textToPoints(textInput.value, 0, 0, 400 * imageScaleValue, { sampleFactor: 0.2 });
    randomSeed(0)
    for (let i = 0; i < pointCount; i++) {
      
      if (i < textPoints.length) {
        let px = textPoints[i].x
        let py = textPoints[i].y
        px += width / 2 - font.textBounds(textInput.value, 0, 0, 400 * imageScaleValue).w / 2
        py += height /2
        finalPoints[i].target = createVector(px, py, 1)
        
      }
      else{
        // finalPoints[i].target = createVector(mouseX, mouseY)
        // finalPoints[i].target = createVector(finalPoints[i].position.x, finalPoints[i].position.y, 0)
        if (textInput.value.length > 0) {
          let bounds = font.textBounds(textInput.value, 0, 0, 400 * imageScaleValue)
          finalPoints[i].target = createVector(
            random(width/2 + bounds.w/2, width/2 + bounds.w/2 + 200), 
            random(height/2 - bounds.h * 2, height/2 + bounds.h), 0)
        }else{
          finalPoints[i].target = createVector(
            random(width/2 - 40, width/2 + 40), 
            random(height/2 - 40, height/2 + 40), 0)
        }
        
    // finalPoints.push(new Cloud(
    //   random(width/2 - bounds.w/2, width/2 + bounds.w/2), 
    //   random(height/2 - bounds.h/2, height/2 + bounds.h/2), 0)
    // )
      }
      // finalPoints.push( new Cloud(px, py))
    }
    
  }
  

  let i = 0
  let speed =  millis()/6000
  let jSample = 0.008
  let sSample = 0.01
  randomSeed(0)
  finalPoints.forEach(cloud => {
    cloud.move()
    push()
    // randomSeed(i * 200)
    let n = randomGaussian(0.5, 0.1)
    let n2 = noise(jSample*cloud.position.x+200 + speed, jSample*cloud.position.y+200 + speed)
    let n3 = noise(jSample*cloud.position.x+400 + speed, jSample*cloud.position.y+400 + speed)
    let n4 = noise(sSample*cloud.position.x+600, sSample*cloud.position.y+600)
    // let nX = noise(p.x);
    // let nY = noise(p.y);
    let px = cloud.position.x + n2 * 60
    let py = cloud.position.y + n3 * 60
    let r = TWO_PI * n
    let scale = 100 * (s+1) * n * n * cloud.position.z + 1
    let b = cloudBuffers[i % cloudBuffers.length];
    let bIndex = (map(cloud.position.z, 0, 1, 0, b.length-1));
    let bImage = b[floor(bIndex-1)+1];

    if (!userImage){

      // translate(width / 2 - font.textBounds(textInput.value(), 0, 0, 200).w / 2, height / 2);
    }
    
    translate(px, py)
    rotate(r)
    imageMode(CENTER)

    image(bImage, 0, 0, scale, scale)
    pop()
    i++
  })
}




function handleFile(file) {

  if (file.type === 'image') {
    userImage = loadImage(file.data, '');

  } else {
    userImage = null;
  }
}

class Cloud {
    
  constructor(targetX, targetY, opacity) {
      this.target = createVector(targetX, targetY, opacity);
      this.position = createVector(targetX, targetY, 0);
  }

  move() {
    let dir = p5.Vector.sub(this.target, this.position);
    // dir.normalize();
    dir.mult(0.03);
    this.position.add(dir);
    
  }
  
}