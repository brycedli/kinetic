let canvas;
let originalBuffer;
let maskBuffer;
let clickLocation;
let w = 200;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    originalBuffer = createGraphics(windowWidth, windowHeight);
    maskBuffer = createGraphics(windowWidth, windowHeight);
    originalBuffer.background(0);
    originalBuffer.textSize(100);
    originalBuffer.fill(255);
    originalBuffer.rectMode(CENTER);

    originalBuffer.textAlign(CENTER);
    // originalBuffer.text("festival of the winds", width/2, height/2);
    originalBuffer.text("festival\nof the\nwinds", width/2, height/2);
    clickLocation = [width/2, height/2]
}

function draw() {    
    background(0);
    image(originalBuffer, 0,0, width, height);
    // maskBuffer = originalBuffer.copy()
    fill(0);
    circle(mouseX, mouseY, w);
    image(maskBuffer, mouseX - w/2, mouseY - w/2, w, w);
    // image(makeMask(w/2), 0, 0, w, w);

}

function makeMask(r) {
    let m = createGraphics(r, r);
    m.noStroke();
    // m.background(0);
    m.fill(255);
    m.circle(r/2, r/2, r);
    return m;
}

function mousePressed(){
    clickLocation = [mouseX, mouseY];
    let pattern = createGraphics(width, height);
    pattern.copy(originalBuffer, mouseX - w/2, mouseY - w/2, w, w, 0, 0, pattern.width, pattern.height);
    pattern = pattern.get();
    let m = makeMask(w/2); //m is graphics
    pattern.mask(m); 
    maskBuffer.image(pattern, 0, 0, pattern.width, pattern.height);
}


/*
function draw() {
  background(220);
  noStroke();
  text("wobble (angle range): " + angleSlider.value(),155,33 );
    text("stretch (cp distance): " + distanceSlider.value(),155,53 );
  translate(240,240)
  stroke(0);
  strokeWeight(1);
  
  beginShape(); // start drawing the shape
  vertex(blobPoints[0].x,blobPoints[0].y); // first point is a plain vertex
  
  for (b=1; b<blobPoints.length; b++){
    // start from 1 (the second node in the ring)
    let bp = blobPoints[b];
    let pp = blobPoints[b-1]; // previous node
    // bezier points go:
    // second control point from previous node
    // first control point from this node
    // x and y of this node
    bezierVertex(pp.cp[1].x, pp.cp[1].y, bp.cp[0].x, bp.cp[0].y, bp.x, bp.y);
  }
  // to finish, wrap around
  // so join the last point in the ring to the first point in the same way as above
  
  let lastp = blobPoints[blobPoints.length-1];
  let firstp = blobPoints[0]
  
  bezierVertex(lastp.cp[1].x, lastp.cp[1].y, firstp.cp[0].x, firstp.cp[0].y, firstp.x, firstp.y);
  
  endShape();
  
  // drawing the node and control points if the box is checked
  if (drawCp.checked()){
      blobPoints.forEach(p => {
        strokeWeight(4);
        stroke(0);
        point(p.x, p.y);
        strokeWeight(3);
        stroke(255,0,0)
        point(p.cp[0].x, p.cp[0].y)
        point(p.cp[1].x, p.cp[1].y)
      strokeWeight(1);
      line (p.cp[0].x, p.cp[0].y, p.cp[1].x, p.cp[1].y)
    }) 
  }
  
}

function buildBlob(){ // this creates a new blob with current settings
  blobPoints = []; // empty the array
  
  // get values from the sliders
  cpOffsetAngle = angleSlider.value();
  cpdist = distanceSlider.value();
  
  // generate points around a ring
  for (let p=0; p<numPoints; p ++){ 
    let a = p * TWO_PI/numPoints; // angle of this point
    let r = baseRadius + random(-radiusRandomness*baseRadius, radiusRandomness*baseRadius); // radius randomiser
    // create an object storing the x and y coordinate, and the angle
    // as well as an empty array for storing the control points
    let bp = { x:cos(a)*r, 
               y:sin(a)*r, 
               angle: a, 
               cp:[]
             };
    blobPoints.push(bp);
  }
  
  // now run through again and add the control points
  
  for (let b=0; b< blobPoints.length; b++){ // run through the ring
    let thisp = blobPoints[b]; // current node
    let randomangle = random(-cpOffsetAngle,cpOffsetAngle); // random angle for control points
    
    let cp1angle = thisp.angle - (HALF_PI+randomangle);
    let cp2angle = thisp.angle + (HALF_PI-randomangle);
    // make sure the two angles of the control points add up to 180 degrees
    // to keep them in the same line and create a smooth join
    
    // create the control points
    // note that we use cos and sin to create coordinates
    // relative to the node point
    cp1 = { x: thisp.x + (cos(cp1angle)*cpdist), 
            y: thisp.y + (sin(cp1angle)*cpdist)
          };
    cp2 = { x: thisp.x + (cos(cp2angle)*cpdist), 
            y: thisp.y + (sin(cp2angle)*cpdist)
          };
    
    thisp.cp = [cp1,cp2]; // store control points in the current node in the blobPoints array
  
  }
}
*/