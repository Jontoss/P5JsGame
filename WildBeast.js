//Class for creating and moving the enemy beasts
class WildBeast {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 15;
        this.speed = speed;
    }

    //Place the enemy beast on the screen using a given image
    place(img) {
        image(img, this.x, this.y);
    }

    //Move the beast in a given direction
    move(xDirection, yDirection = 0) {
        this.x += xDirection * this.speed;
        this.y += yDirection * this.speed;
    }

    //Get the beasts X position
    getX() {
        return this.x;
    }

    //Get the beasts Y position
    getY() {
        return this.y;
    }

}