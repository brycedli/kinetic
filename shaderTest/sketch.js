// a shader variable

let theShader;

function preload() {

    // load the shader

    theShader = loadShader('https://cstudiocoral.s3.amazonaws.com/basic.vert', 'https://cstudiocoral.s3.amazonaws.com/basic.frag');
    print(theShader);

}
function setup() {
  pixelDensity(1);
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {  
  // send resolution of sketch into shader
  theShader.setUniform('u_time', millis()/1000);
  theShader.setUniform('u_resolution', [windowWidth, windowHeight]);
  theShader.setUniform('u_mouse', [mouseX, mouseY]);

  // shader() sets the active shader with our shader
  shader(theShader);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}