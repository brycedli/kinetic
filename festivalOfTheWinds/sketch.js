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

let kiteSpritesWhite = [s3Url+"arrowwhite.png", s3Url+"boxwhite.png",s3Url+"diamondwhite.png"];

let festival = "https://cstudiocoral.s3.amazonaws.com/festivalwhite.png";
let of = "https://cstudiocoral.s3.amazonaws.com/ofwhite.png";
let the = "https://cstudiocoral.s3.amazonaws.com/thewhite.png";
let winds = "https://cstudiocoral.s3.amazonaws.com/windswhite.png";

function preload() {
  for (let i = 0; i < kiteSpritesWhite.length; i++){
    kiteSpritesWhite[i] = loadImage(kiteSpritesWhite[i]);
  }
  festival = loadImage(festival);
  of = loadImage(of);
  the = loadImage(the);
  winds = loadImage(winds);
  glShader = loadShader('https://cstudiocoral.s3.amazonaws.com/basic.vert', 'https://cstudiocoral.s3.amazonaws.com/basic.frag');;
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight*0.8);

  glCanvas = createGraphics(canvas.width, canvas.height, WEBGL);
  glCanvas.pixelDensity(1/glDensity);

  // an initial color to look for
  colorToMatch = color(255,150,0);


  engine = Engine.create();
  world = engine.world;
  engine.gravity.y = 0;
  let mouse = Mouse.create(canvas.elt);
  print(canvas.elt);
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
  
  background("#91A9C2")
  glShader.setUniform('u_time', millis()/1000);
  glShader.setUniform('u_resolution', [glCanvas.width/(glDensity*2), glCanvas.height/(glDensity*2)]);
  glShader.setUniform('u_mouse', [mouseX, mouseY]);
  glCanvas.shader(glShader);
  glCanvas.rect(0,0,width, height);
  image(glCanvas, 0, 0, windowWidth, windowHeight);
  if (mouseIsPressed === true && random() < 0.4) {
    kites.push(new Kite(mouseX, mouseY));
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
  
  
  windDirection = Matter.Vector.create(((width-mouseX)/width)*1.2, ((height-mouseY)/height-1)*1.2);

}

function keyPressed(){
  if (key == 'f'){
    fullscreen(true);
  }
  if (key == 'k'){
    kites.push(new Kite(mouseX, mouseY));
  }
}

function windowResized(){
  // for (let boundary of boundaries){
  //   World.remove(boundary.body);
  // }
  resizeCanvas(windowWidth, windowHeight);
  glCanvas.resizeCanvas(windowWidth, windowHeight);
}
