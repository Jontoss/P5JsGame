//Class for creating and controlling the player
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 15;
  }

  //Place the player in the world with a given image
  place(img) {
    //ellipse(this.x, this.y, this.w, this.h);
    image((img), this.x, this.y);
    //img.resize(0, 200)
  }

  //Move the player via given variables at a given speed, and prevent the player from leaving the canvas
  move(xDirection = 0, yDirection = 0, speed = 1) {
    this.x += xDirection * speed;
    this.y += yDirection * speed;
    if (this.x > 560) {
      this.x = 560;
    } else if (this.x < 0) {
      this.x = 0;
    }

    if (this.y > 360) {
      this.y = 360;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }

  //Teleport the player to the given position, and prevent them from teleporting off the canvas
  Dash(xDashDirection, yDashDirection) {
    this.x = xDashDirection;
    this.y = yDashDirection;

    if (this.x > 560) {
      this.x = 560;
    } else if (this.x < 0) {
      this.x = 0;
    }

    if (this.y > 360) {
      this.y = 360;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }

  //Get the players X position
  getX() {
    return this.x;
  }

  //Get the players Y position
  getY() {
    return this.y;
  }
}