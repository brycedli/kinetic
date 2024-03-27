let stars = [];
let position;
var startTime = null;
let sky;
function preload() {
    stars[0] = createVideo("red.mp4");
    stars[1] = createVideo("green.mp4");
    stars[2] = createVideo("blue.mp4");
    sky = loadImage("night.png");
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    // background(255, 153, 10);
    position = new p5.Vector(width / 2 + 1, height / 2 + 1);
    stars.forEach(star => {
        star.loop();
        star.play();
        star.hide();
    })
}


function draw() {
    blendMode(BLEND)
    //   background(0, 12);
    imageMode(CORNER);
    background(0);
    image(sky, 0, 0, windowWidth, windowHeight);
    blendMode(SCREEN);
    imageMode(CENTER);
    let total = 2;
    //   tint(255, 120);
    let speed = 0.03;
    let orbit = new p5.Vector(sin(frameCount * speed), cos(frameCount * speed)).mult(width / 8).add(createVector(width / 2, height / 2));
    let directionToMouse = p5.Vector.sub(createVector(mouseX, mouseY), position).mult(0.1);
    for (let i = 0; i < stars.length; i++) {
        for (let n = 0; n < total; n++) {
            push();
            let offsetI = i / stars.length;
            let offsetN = n / total;
            let scale = offsetI * offsetN * 4;
            let offset = directionToMouse.copy().mult(scale);
            translate(position.x - offset.x, position.y - offset.y);
            let bumpScale = 1;
            //   rotate(i * TWO_PI / 100 + frameCount * 0.03);
            // translate(i * 5 * bumpScale, i * 3 * bumpScale);

            //   translate(width/2, height/2);
            //   translate(offset.x, offset.y)
            //    tint(255, 25);
            image(stars[i], 0, 0, 256, 256);
            pop();
        }

    }

    position.add(directionToMouse);


}


function mousePressed() {
    randomizeDirection();
    startTime = millis();
}


