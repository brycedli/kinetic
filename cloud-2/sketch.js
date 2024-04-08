let cloudURLs = ["/clouds/cloud-1.png", "/clouds/cloud-2.png", "/clouds/cloud-3.png"];
// let cloudURLs = ["cloud-lighter.png"];
let clouds = [];
let font;
let cloudBuffers = [];
let bg;
let textInput;
let scaleSlider;
let backgroundSelect;

function preload() {
  cloudURLs.forEach(url => {
    let cloud = loadImage(url);
    clouds.push(cloud);
  })
  font = loadFont('CirrusCumulus.otf');
  bg = loadImage("bg.png");
  
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  let n = 30;
  clouds.forEach(c => {
    let buffer = [];
    cloudBuffers.push(buffer);
    for (let i = 0; i < n; i++) {
      let bufferSize = 64;
      let cloudBuffer = createGraphics(bufferSize, bufferSize);
      cloudBuffer.tint(255, map(i, 0, n, 10, 60));
      cloudBuffer.image(c, 0, 0, bufferSize, bufferSize);
      buffer.push(cloudBuffer);
    }
  })

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

}

function draw() {
  if (backgroundSelect.value() == 'sky'){
    background(bg);
  }
  if (backgroundSelect.value() == 'black'){
    background(0);
  }
  let textPoints = font.textToPoints(textInput.value(), 0, 0, 200, { sampleFactor: map(scaleSlider.value(), 255, 0, 0.3, 0.5) });
  translate(width / 2 - font.textBounds(textInput.value(), 0, 0, 200).w / 2, height / 2);
  let s = scaleSlider.value() / 255;
  for (let i = 0; i < textPoints.length; i++) {
    
    let p = textPoints[i];
    let n = noise(p.x, p.y);
    let n2 = noise(p.x+200, p.y+200) * (1-s);
    let n3 = noise(p.x+400, p.y+400) * (1-s);

    // let nX = noise(p.x);
    // let nY = noise(p.y);
    push();
    
    translate(p.x + n2 * 50, p.y+ n3 * 50);
    rotate(TWO_PI * n);
    imageMode(CENTER)
    let b = cloudBuffers[i % cloudBuffers.length];
    
    let bIndex = (map(s, 1, 0, 0, b.length-1));
    // if (i == 0){
    //   print(floor(bIndex-1)+1, b.length);
    // }
    // print(bIndex)
    image(b[floor(bIndex-1)+1], 0, 0, 300 * s * n * n + 5, 300 * s * n * n  + 5);
    // image(cloudBuffers[cloudIndex], 0, 0, 200 * s * nSquaredNormalized * noise(i), 200 * s * nSquaredNormalized * noise(i));
    pop();
    
  }
  textPoints.forEach(p => {
    
  })

}
function keyPressed() {
  if (key === 'P') {
    saveCanvas('myCanvas', 'jpg');
  }
}
function mousePressed() {

}

