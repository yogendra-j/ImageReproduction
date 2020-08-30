export class Polygon {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.color = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
      a: Math.floor(Math.random()),
    };
    this.triangle = [
      { x: Math.random() * width, y: Math.random() * height },
      { x: Math.random() * width, y: Math.random() * height },
      { x: Math.random() * width, y: Math.random() * height },
    ];
  }

  draw(contextCanvas) {
    contextCanvas.beginPath();
    contextCanvas.moveTo(this.triangle[0].x, this.triangle[0].y);
    for (let i = 0; i < this.triangle.length; i++) {
      contextCanvas.lineTo(this.triangle[i].x, this.triangle[i].y);
    }
    contextCanvas.closePath();
    contextCanvas.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    contextCanvas.fill();
  }
  copy() {
    let newPoly = new Polygon(this.width, this.height);
    newPoly.color = JSON.parse(JSON.stringify(this.color));
    newPoly.triangle = JSON.parse(JSON.stringify(this.triangle));
    return newPoly;
  }
}
