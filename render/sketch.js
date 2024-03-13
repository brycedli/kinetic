var Engine = Matter.Engine,
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
let kiteSprites = [s3Url + "arrowblue.png", s3Url + "arroworange.png", s3Url + "arrowlime.png",
s3Url + "boxblue.png", s3Url + "boxorange.png", s3Url + "boxlime.png",
s3Url + "diamondblue.png", s3Url + "diamondorange.png", s3Url + "diamondlime.png"];

let kiteSpritesWhite = [s3Url + "arrowwhite.png", s3Url + "boxwhite.png", s3Url + "diamondwhite.png"];

let festival = "https://cstudiocoral.s3.amazonaws.com/festivalwhite.png";
let of = "https://cstudiocoral.s3.amazonaws.com/ofwhite.png";
let the = "https://cstudiocoral.s3.amazonaws.com/thewhite.png";
let winds = "https://cstudiocoral.s3.amazonaws.com/windswhite.png";

let festivalBlack = "/assets/words/festivalblack.png"
let ofBlack = "/assets/words/ofblack.png"
let theBlack = "/assets/words/theblack.png"
let windsBlack = "/assets/words/windsblack.png"

let toggleWind;
let toggleInvert;
let toggleSky;
let toggleLockY;
let menuOptions;
let recordButtonElement;
let toggleKites;
let toggleWords;
let windSlider;
function preload() {
  // let kites 
  for (let i = 0; i < kiteSprites.length; i++){
    kiteSprites[i] = loadImage(kiteSprites[i]);
  }
  print(toggleWind);
  festival = loadImage(festival);
  of = loadImage(of);
  the = loadImage(the);
  winds = loadImage(winds);

  festivalBlack = loadImage(festivalBlack);
  ofBlack = loadImage(ofBlack);
  theBlack = loadImage(theBlack);
  windsBlack = loadImage(windsBlack);
  glShader = loadShader('https://cstudiocoral.s3.amazonaws.com/basic.vert', 'https://cstudiocoral.s3.amazonaws.com/basic.frag');;
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  toggleWind = select("#wind");
  toggleInvert = select('#invert');
  toggleSky = select('#showsky');
  toggleLockY = select('#lockY');
  menuOptions = select('#options');
  recordButtonElement = select('#recordButton');
  toggleKites = select('#kites');
  toggleWords = select('#words');
  windSlider = select('#windSlider');
  record();


  // an initial color to look for
  colorToMatch = color(255, 150, 0);
  glCanvas = createGraphics(canvas.width, canvas.height, WEBGL);
  glCanvas.pixelDensity(1 / glDensity);


  engine = Engine.create();
  world = engine.world;
  engine.gravity.y = 0;
  let mouse = Mouse.create(canvas.elt.parentElement);
  // mouse.pixelRatio = pixelDensity() // for retina displays etc
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
  boundaries.push(new Boundary(windowWidth / 2, windowHeight * -0.5 + 100, windowWidth * 2, 100));
  boundaries.push(new Boundary(windowWidth / 2, windowHeight * 1.5, windowWidth * 2, 100));
  // windDirection = Matter.Vector.create(0, 0);
  windDirection = Matter.Vector.create(1, -0.5);

}

function reset() {
  words.forEach((word) => {
    print(word.body);
    World.remove(world, word.body);

  });
  words = [];
  ligatures = [];
  kites = [];
  spawnWordGroup(0, height / 2)
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
  invertColors();
}

let count = 0;
function draw() {
  background("#000000");
  if (toggleInvert.elt.checked) {
    background("#FFFFFF");
  }
  else {
    background("#000000");
  }
  if (toggleSky.elt.checked) {

    glShader.setUniform('u_time', millis() / 1000);
    glShader.setUniform('u_resolution', [glCanvas.width / (glDensity * 2), glCanvas.height / (glDensity * 2)]);
    glShader.setUniform('u_mouse', [mouseX, mouseY]);
    glCanvas.shader(glShader);
    glCanvas.rect(0, 0, width, height);
    image(glCanvas, 0, 0, windowWidth, windowHeight);
  }

  if (mouseIsPressed === true && random() < 0.4 && toggleKites.elt.checked) {
    kites.push(new Kite(mouseX, mouseY));
  }

  if (keyIsDown(LEFT_ARROW)) {
    let ofWord = words[3];
    let direction = Matter.Vector.create(-40, 0);
    print(ofWord.body, ofWord.body.position);

    Matter.Body.applyForce(ofWord.body, ofWord.body.position, direction);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    let ofWord = words[1];
    let direction = Matter.Vector.create(40, 0);
    print(ofWord.body, ofWord.body.position);

    Matter.Body.applyForce(ofWord.body, ofWord.body.position, direction);
  }

  Engine.update(engine);
  
  if (toggleWords.elt.checked){
    for (let word of words) {
      word.show();
    }
    for (let ligature of ligatures) {
      ligature.show();
    }
  }
  

  if (toggleKites.elt.checked){
    for (let kite of kites){
      kite.show();
    }
  }

  windDirection = Matter.Vector.create((windSlider.elt.value/100)-0.5, -0.5);
  // windDirection = Matter.Vector.create(((width - mouseX) / width) * 1.2, ((height - mouseY) / height - 1) * 1.2);

}

let toggleMenu = false;
function keyPressed() {
  if (key == 'f') {
    fullscreen(true);
  }
  if (key == ' ') {
    reset();
  }
  if (key == 'r') { //32 is keycode for space
    recordButton();
  }
  if (key == 'h') {
    toggleMenu = !toggleMenu;
    if (toggleMenu) {
      menuOptions.elt.style.display = "flex";
    }
    else {
      menuOptions.elt.style.display = "none";
    }
  }
  // if (key == 'k'){
  //   kites.push(new Kite(mouseX, mouseY));
  // }
}



function windowResized() {
  // for (let boundary of boundaries){
  //   World.remove(boundary.body);
  // }
  // glCanvas.pixelDensity(1 / glDensity);
  resizeCanvas(windowWidth, windowHeight);
  // glCanvas = createGraphics(canvas.width, canvas.height, WEBGL);


}

function updateSky (){
  if (toggleInvert.elt.checked && toggleSky.elt.checked){
    toggleInvert.elt.checked = false;
  }
  invertColors();
}

function invertColors() {
  
  let ischecked = toggleInvert.elt.checked;

  if (toggleSky.elt.checked && ischecked){
    toggleSky.elt.checked = false;
  }
  // updateSky();

  for (let word of words) {
    if (ischecked) {

      if (word.type == 'festival') {
        word.image = festivalBlack;
      }
      if (word.type == 'of') {
        word.image = ofBlack;
      }
      if (word.type == 'the') {
        word.image = theBlack;
      }
      if (word.type == 'winds') {
        word.image = windsBlack;
      }

    }
    else {
      if (word.type == 'festival') {
        word.image = festival;
      }
      if (word.type == 'of') {
        word.image = of;
      }
      if (word.type == 'the') {
        word.image = the;
      }
      if (word.type == 'winds') {
        word.image = winds;
      }
    }

  }
}

let recording = false;
let recorder;
let chunks = [];

const fr = 30;

function record() {
  chunks.length = 0;

  let stream = document.querySelector('canvas').captureStream(fr);

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = exportVideo;

}

function exportVideo(e) {
  var blob = new Blob(chunks, { 'type': 'video/webm' });
  date = new Date();
  start = round(date.getTime() / 1000);
  
  // Draw video to screen
  // var videoElement = document.createElement('video');
  // videoElement.setAttribute("id", Date.now());
  // videoElement.controls = true;
  // document.body.appendChild(videoElement);
  // videoElement.src = window.URL.createObjectURL(blob);

  // Download the video 
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'fotw-motion-'+start+'.webm';
  a.click();
  window.URL.revokeObjectURL(url);

}


function recordButton() {
  recording = !recording
  print(recording);

  if (recording) {
    recordButtonElement.elt.textContent = 'Stop recording';
    recorder.start();

  } else {
    recordButtonElement.elt.textContent = 'Start recording';
    recorder.stop();
  }
}
