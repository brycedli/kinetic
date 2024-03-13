// Example based on https://www.youtube.com/watch?v=urR596FsU68
// 5.17: Introduction to Matter.js - The Nature of Code
// by @shiffman

// module aliases

var Engine = Matter.Engine,
  //    Render = Matter.Render,
  World = Matter.World,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies;

let s3Url = "https://cstudiocoral.s3.amazonaws.com/";
let engine;
let world;
let words = [];
let ligatures = [];
let boundaries = [];
let kites = [];

let canvas;
let glCanvas;
let glShader;
let windDirection;
let glDensity = 5;
let kiteSprites = [s3Url+"arrowblue.png", s3Url+"arroworange.png",s3Url+"arrowlime.png",
                  s3Url+"boxblue.png", s3Url+"boxorange.png",s3Url+"boxlime.png",
                  s3Url+"diamondblue.png", s3Url+"diamondorange.png",s3Url+"diamondlime.png"];


let tolerance = 10;

// color to look for (set with mouse click)
let colorToMatch;

let video;
let firstPx;
let showVideo = true;

// let festival = "https://cstudiocoral.s3.amazonaws.com/festival.png";
// let of = "https://cstudiocoral.s3.amazonaws.com/of.png";
// let the = "https://cstudiocoral.s3.amazonaws.com/the.png";
// let winds = "https://cstudiocoral.s3.amazonaws.com/winds.png";


let festival = "https://cstudiocoral.s3.amazonaws.com/festivalwhite.png";
let of = "https://cstudiocoral.s3.amazonaws.com/ofwhite.png";
let the = "https://cstudiocoral.s3.amazonaws.com/thewhite.png";
let winds = "https://cstudiocoral.s3.amazonaws.com/windswhite.png";

function preload() {
  for (let i = 0; i < kiteSprites.length; i++){
    kiteSprites[i] = loadImage(kiteSprites[i]);
  }
  festival = loadImage(festival);
  of = loadImage(of);
  the = loadImage(the);
  winds = loadImage(winds);
  glShader = loadShader('https://cstudiocoral.s3.amazonaws.com/basic.vert', 'https://cstudiocoral.s3.amazonaws.com/basic.frag');;
}
function setup() {
  glCanvas = createGraphics(windowWidth, windowHeight, WEBGL);
  glCanvas.pixelDensity(1/glDensity);
  canvas = createCanvas(windowWidth, windowHeight);

  // an initial color to look for
  colorToMatch = color(255,150,0);

  // webcam capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();


  engine = Engine.create();
  world = engine.world;
  engine.gravity.y = 0;
  let mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity() // for retina displays etc
  let options = {
    mouse: mouse
  }
  mConstraint = MouseConstraint.create(engine, options);
  mConstraint.constraint.stiffness = 0.01;
  mConstraint.constraint.damping = 0.1;
  World.add(world, mConstraint);
  words.push(new Word(533, height / 2, festival, "festival"));
  words.push(new Word(868, height / 2, of, "of"));
  kites.push(new Kite(width/2, height/2));
  ligatures.push(new Ligature(words[0], words[1]));
  words.push(new Word(1039, height / 2, the, "the"));
  ligatures.push(new Ligature(words[1], words[2]));
  words.push(new Word(1327, height / 2, winds, "winds"));
  ligatures.push(new Ligature(words[2], words[3]));
  boundaries.push(new Boundary(windowWidth / 2, windowHeight * -0.5 + 100, windowWidth*2, 100));
  boundaries.push(new Boundary(windowWidth / 2, windowHeight * 1.5, windowWidth*2, 100));
  windDirection = Matter.Vector.create(0,0);

  
}

function spawnWordGroup(x, y) {
  let festivalWord = new Word(x + 533, y, festival, "festival");
  let ofWord = new Word(x + 868, y, of, "of");
  let theWord = new Word(x + 1039, y, the, "the");
  let windsWord = new Word(x + 1327, y, winds, "winds");
  
  words.push(festivalWord);
  words.push(ofWord);
  words.push(theWord);
  words.push(windsWord);

  ligatures.push(new Ligature(festivalWord, ofWord));
  ligatures.push(new Ligature(ofWord, theWord));
  ligatures.push(new Ligature(theWord, windsWord));
}

let count = 0;
function draw() {

  glShader.setUniform('u_time', millis()/1000);
  glShader.setUniform('u_resolution', [glCanvas.width/(glDensity*2), glCanvas.height/(glDensity*2)]);
  glShader.setUniform('u_mouse', [mouseX, mouseY]);
  glCanvas.shader(glShader);
  glCanvas.rect(0,0,width, height);
  image(glCanvas, 0, 0, windowWidth, windowHeight);
  if (showVideo){
    image(video, 0,0);
  }
  
  Engine.update(engine);
  for (let word of words) {
    word.show();
  }
  for (let ligature of ligatures) {
    ligature.show();
  }
  for (let kite of kites){
    kite.show();
  }
  
  firstPx = findColor(video, colorToMatch, tolerance);
  // windDirection = Matter.Vector.create(((width-mouseX)/width)*1.2, ((height-mouseY)/height-1)*1.2);

  if (random() < 0.3 && firstPx){
    let pointerX = windowWidth-firstPx.x/video.width * windowWidth;
    let pointerY = firstPx.y/video.height * windowHeight;
    kites.push(new Kite (pointerX , pointerY ));
    fill(colorToMatch);
    stroke(255);
    strokeWeight(2);
    if (showVideo){
      circle(firstPx.x, firstPx.y, 30);
    }
    else{
      circle(pointerX, pointerY, 30);
    }
    windDirection = Matter.Vector.create(((width-mouseX)/width)*1.2, ((height-mouseY)/height-1)*1.2);


  }
}
function mousePressed() {
  if (showVideo){
    loadPixels();
    colorToMatch = get(mouseX, mouseY);
  }
  

}
function keyPressed(){
  if (key == 'f'){
    fullscreen(true);
  }
  if (key == "v"){
    showVideo = !showVideo;
  }
}

function windowResized(){
  // for (let boundary of boundaries){
  //   World.remove(boundary.body);
  // }
  resizeCanvas(windowWidth, windowHeight);
  glCanvas.resizeCanvas(windowWidth, windowHeight);
}

function findColor(input, c, tolerance) {
  
  // if we don't have video yet (ie the sketch
  // just started), then return undefined
  if (input.width === 0 || input.height === 0) {
    return undefined;
  }

  // grab rgb from color to match
  let matchR = c[0];
  let matchG = c[1];
  let matchB = c[2];

  // look for the color!
  // in this case, we look across each row 
  // working our way down the image – depending 
  // on your project, you might want to scan 
  // across instead
  input.loadPixels();
  for (let y=0; y<input.height; y++) {
    for (let x=0; x<input.width; x++) {
 
      // current pixel color
      let index = (y * video.width + x) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index+1];
      let b = video.pixels[index+2];

      // if our color detection has no wiggle-room 
      // (either the color matches perfectly or isn't 
      // seen at all) then it won't work very well in 
      // real-world conditions to overcome this, we 
      // check if the rgb values are within a certain 
      // range – if they are, we consider it a match
      if (r >= matchR-tolerance && r <= matchR+tolerance &&
          g >= matchG-tolerance && g <= matchG+tolerance &&
          b >= matchB-tolerance && b <= matchB+tolerance) {

          // send back the x/y location immediately
          // (faster, since we stop the loop)
          return createVector(x, y);
      }
    }
  }

  // if no match was found, return 'undefined'
  return undefined;
}