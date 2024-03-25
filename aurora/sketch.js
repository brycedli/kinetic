let input, button, greeting, font, slice, bgImage;

let points; 
let sliceOpacities = [];

function preload(){
    font = loadFont('CirrusCumulus.otf');
    slice = loadImage("slice_b5.png");
    bgImage = loadImage("nightsky.jpeg");
}

function opacities (texture, n) {
    let opacities = [];
    for (let i = 0; i < n; i++) {
        let bufferSize = 64;
        let buffer = createGraphics(bufferSize, bufferSize);
        buffer.tint(255, map(i, n, 0, 0, 255));
        buffer.image(texture, 0, 0, bufferSize, bufferSize);
        opacities.push(buffer);
    }
    return opacities;
}
function setup() {
    // create canvas
    createCanvas(windowWidth, windowHeight);
    input = createInput();
    input.value("Hello World");
    input.position(20, 65);
    sliceOpacities = opacities(slice, 100);
}

function draw () {
    
    image(bgImage, 0, 0, windowWidth, windowHeight);
    background(0, 160);
    fill(0);
    imageMode(CORNER)
    points = font.textToPoints(input.value(), 100, height/2, 300, { sampleFactor:  0.05 });
    for (let i = 0; i < points.length; i++) {
        push();
        let noiseScale = 400;
        let l = 1000 * noise(points[i].x/noiseScale, points[i].y/noiseScale, millis()/3000);
        translate(points[i].x, points[i].y);
        rotate(PI/3);
        translate(0, -1 * l);
        // image(slice, 0, 0, 25, 600 + 300 * noise(points[i].x/1000, millis()/4000));
        image(sliceOpacities[floor(l/1000 * sliceOpacities.length)], 0, 0, 25, l);
        pop();
    }
}