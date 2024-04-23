let cloudURLs = ["/clouds/cloud-1.png", "/clouds/cloud-2.png", "/clouds/cloud-3.png"];
// let cloudURLs = ["cloud-lighter.png"];
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
  let n = 10;
  clouds.forEach(c => {
    let buffer = [];
    cloudBuffers.push(buffer);
    for (let i = 0; i < n; i++) {
      let bufferSize = 32;
      let cloudBuffer = createGraphics(bufferSize, bufferSize);
      cloudBuffer.tint(255, map(i, 0, n, 10, 30));
      cloudBuffer.image(c, 0, 0, bufferSize, bufferSize);
      buffer.push(cloudBuffer);
    }
  })

  imageInput = createFileInput(handleFile);
  imageInput.position(20, 20);

  scaleSlider = createSlider(0, 255);
  scaleSlider.value(128)
  scaleSlider.position(20, 100);

  textInput = createInput();
  textInput.value("hello sky");
  textInput.position(20, 65);
  
  backgroundSelect = createSelect();
  backgroundSelect.position(20, 140);
  backgroundSelect.option('sky');
  backgroundSelect.option('black');
  backgroundSelect.value('black');
  
  imageScale = createSlider(0, 255);
  imageScale.position(20, 170);
  imageScale.value(128)

  thresholdSliderUpper = createSlider(0, 255);
  thresholdSliderUpper.position(20, 200);
  thresholdSliderUpper.value(255)
  thresholdSliderLower = createSlider(0, 255);
  thresholdSliderLower.position(20, 230);
  thresholdSliderLower.value(0)

}

function draw() {
  if (backgroundSelect.value() == 'sky'){
    background(bg);
  }
  if (backgroundSelect.value() == 'black'){
    background(0);
  }
  let textPoints = font.textToPoints(textInput.value(), 0, 0, 200, { sampleFactor: 0.5 });
  
  let s = scaleSlider.value() / 255;
  let finalPoints = []
  let imageSampleSize = 2000
  if (userImage){
    // image(userImage, 0, 0, userImage.width, userImage.height)
    
    randomSeed(0)
    let tries = 0
    let maxTries = 2000
    // for (let i = 0; i < imageSampleSize; i++) {
    while(finalPoints.length < imageSampleSize && tries < maxTries) {
      let px = random(0, userImage.width)
      let py = random(0, userImage.height)
      let pixelVal = brightness(userImage.get(px, py))
      if (invertImage) {
        pixelVal = 100 - pixelVal
      }
      if (pixelVal > thresholdSliderUpper.value()/255 * 100 || pixelVal < thresholdSliderLower.value()/255 * 100) {
        print(pixelVal)
        tries ++
        continue
      }
      pixelVal = map(pixelVal, 0, 100, 0.01, 0.99)
      
      let imgScale = imageScale.value()/255
      px = map(px, 0, userImage.width, width/2 - userImage.width * imgScale / 2, width/2 + userImage.width * imgScale / 2)
      py = map(py, 0, userImage.height, height/2 - userImage.height * imgScale / 2, height/2 + userImage.height * imgScale / 2)
      let r = random(0, 1) * Math.PI
      // let s = scaleSlider.value() * pixelVal + 10
      let s = 100
      let b = cloudBuffers[floor(random(cloudBuffers.length-1))];
      let bIndex = (map(pixelVal, 1, 0, 0, b.length-1));
      let bImage = b[floor(bIndex)];
      
      finalPoints.push( new Cloud(px, py, r, s, bImage))
    }


    

  }
  else {
    for (let i = 0; i < textPoints.length; i++) {
      let speed =  millis()/6000
      let jSample = 0.008
      let sSample = 0.01
      let p = textPoints[i];
          randomSeed(i * 200)
      let n = randomGaussian(0.5, 0.1)
      let n2 = noise(jSample*p.x+200 + speed, jSample*p.y+200 + speed)
      let n3 = noise(jSample*p.x+400 + speed, jSample*p.y+400 + speed)
      let n4 = noise(sSample*p.x+600, sSample*p.y+600)
      // let nX = noise(p.x);
      // let nY = noise(p.y);
      let px = p.x + n2 * 60
      let py = p.y + n3 * 60
      let r = TWO_PI * n
      let scale = 100 * (s+1) * n * n
      let b = cloudBuffers[i % cloudBuffers.length];
      let bIndex = (map(0.5, 1, 0, 0, b.length-1));
      let bImage = b[floor(bIndex-1)+1];
  
      finalPoints.push( new Cloud(px, py, r, scale, bImage))
  
      
    }
  }
  


  finalPoints.forEach(cloud => {
    push()
    if (!userImage){

      translate(width / 2 - font.textBounds(textInput.value(), 0, 0, 200).w / 2, height / 2);
    }
    
    translate(cloud.x, cloud.y)
    rotate(cloud.r)
    imageMode(CENTER)

    image(cloud.img, 0, 0, cloud.s, cloud.s)
    pop()
  })

  

}
function parabola(x) {
  return 1 + 4 * x * x - 4 * x
}
function keyPressed() {
  if (key === 'P') {
    saveCanvas('myCanvas', 'jpg');
  }
  if (key == "i"){
    invertImage = !invertImage
  }
}
function mousePressed() {

}

function handleFile(file) {
  print(file);

  if (file.type === 'image') {
    userImage = loadImage(file.data, '');

  } else {
    userImage = null;
  }
}

class Cloud {
    
  constructor(x, y, r, s, img) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.s = s;
      this.img = img;
  }
  
}