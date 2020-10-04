// Croquet Tutorial 1
// Hello World 
// Croquet Studios, 2019

class MyModel extends Croquet.Model {

    init() {
        this.count = 0;
        this.subscribe("counter", "reset", this.resetCounter);
        this.future(1000).tick();
    }

    resetCounter() {
        this.count = 0;
        this.publish("counter", "update", this.count);
    }

    tick() {
        this.count++;
        this.publish("counter", "update", this.count);
        this.future(1000).tick();
    }

}

MyModel.register();

class MyView extends Croquet.View {

    constructor(model) {
        super(model);
        countDisplay.onclick = event => this.onclick(event);
        this.subscribe("counter", "update", this.handleUpdate);
    }

    onclick() {
        this.publish("counter", "reset");
    }

    handleUpdate(data) {
        countDisplay.textContent = data;
    }

}

Croquet.startSession("hello", MyModel, MyView);