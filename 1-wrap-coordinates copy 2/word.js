class Word {
    constructor(x, y, image, type) {
        let options = {
            y: windowHeight/2, 
            h: windowHeight,
            mass: 0.001,
            friction: 0.3,
            restitution: 0.6,
        };
        if (type == "f" || type == "o" || type == "t" || type == "w"){
            this.type = type;
        }
        
        this.body = Bodies.rectangle(x, y, image.width, image.height, options);
        World.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        

        push();
        translate(pos.x, pos.y);
        rectMode(CENTER);
        fill(255);
        rect(this.image.width, this.image.height);
        image(this.image, 0, 0);
        pop();
    }
}

/*
  long0 = new Block(world,
    { x: 200, y: windowHeight/2, w: 500, h: windowHeight, color: 'gray' , mass: 0.001},
    { friction: 0.00, inertia: 0, frictionAir: 0.1,  }
  );
*/