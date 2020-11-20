// Croquet Tutorial 1
// Hello World 
// Croquet Studios, 2019

// What would be wolf pack programming for children look like?
// 
// Everybody would play with different versions of the environment yet 
// still have a common model you would eventually sync against.
//
// E.g. in GemStone with VisualWorks or Pharo as clients you would change
// the common model in your local "play" client environment, test it there,
// and only upload your "delta" to the common model if all is well.
//
// E.g. in Git you have your local change repo to commit changes against,
// when ready push or request a pull against the common model a.k.a repository.
//
// How would that look like in Snap with Croquet ?
//
// Let us look a coding and playing together a common space wars game.
/* 
Alice creates a black space frame with a few yellow pixels as stars.
Bob paints a rocket sprite and drops it on top of the black space.
Alice defines five input devices:
- one for turning the rocket smoothly (say 90 degrees to the left per second)
- another one turning the rocket 90 degrees to the right per second
- one to shoot a laser gun, 
  (She decides that speed of light in this game should be "10 rocket lengths / second")
- one to accelerate it (+ 0.5 rocket lengths / second)
- one to declerate it (- 0.5 rocket lengths / second)


What would be the model here? The proportions of the rocket, it's starting position, orientation, and speed.

*/
class Rocket extends Croquet.Model {

    init() {
        this.x = 0;
        this.y = 0;
        this.rotation = 10;
        this.speed = 1;
        this.acceleration = 0;
        this.subscribe("rocket", "accelerate", this.accelerate);
        this.subscribe("rocket", "decelerate", this.decelerate);
        this.subscribe("rocket", "reset", this.reset);
        this.subscribe("rocket", "turnRight", this.turnRight);
        this.subscribe("rocket", "turnLeft", this.turnLeft);
        this.future(30).tick();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.speed = 0;
        this.acceleration = 0;
        this.publish("rocket", "update", this);
    }

    accelerate() {
        this.speed = this.speed + 1;
    }

    decelerate() {
        this.speed = this.speed - 1;
    }

    turnRight() {
        this.rotation = this.rotation + 10;
    }

    turnLeft() {
        this.rotation = this.rotation - 10;
    }

    tick() {
        this.speed = this.speed + this.acceleration;
        this.x = this.x + this.speed * Math.sin(2 * Math.PI * this.rotation / 360);
        this.y = this.y + this.speed * Math.cos(2 * Math.PI * this.rotation / 360);
        this.publish("rocket", "update", this);
        this.future(30).tick();
    }
}

Rocket.register();
let theView;

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        console.log(this);
        theView.publish("rocket", "turnRight");
        console.log("Right Cursor down");
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        theView.publish("rocket", "turnLeft");
        console.log("Left Cursor down");
    }
    else if (e.key == "Up" || e.key == "ArrowUp") {
        theView.publish("rocket", "accelerate");
        console.log("Up Cursor down");
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        theView.publish("rocket", "decelerate");
        console.log("Down Cursor down");
    }
}

class RocketView extends Croquet.View {

    constructor(model) {
        super(model);
        theView = this;
        var canvas = document.getElementById("myCanvas");
        canvas.onclick = event => this.onclick(event);
        document.addEventListener("keydown", keyDownHandler, false);
        this.subscribe("rocket", "update", this.handleUpdate);
    }

    onclick() {
        console.log("onclick");
        console.log(this);
        this.publish("rocket", "reset");
    }

    handleUpdate(rocket) {
        var canvas = document.getElementById("myCanvas");
        var context = canvas.getContext("2d");
        context.fillStyle = "#00008F";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle = "#FF0000";
        context.arc(rocket.x % 500, rocket.y % 500, 20, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
    }
}

Croquet.Session.join("hello", Rocket, RocketView);