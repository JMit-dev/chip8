class Renderer {
  constructor(scale = 10) {
    this.cols = 64;
    this.rows = 32;
    this.scale = scale;
    this.canvas = document.getElementById('display');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.cols * this.scale;
    this.canvas.height = this.rows * this.scale;

    this.display = new Array(this.cols * this.rows).fill(0);
  }

  setPixel(x, y) {
    x = x % this.cols;
    y = y % this.rows;

    const pixelIndex = x + (y * this.cols);
    this.display[pixelIndex] ^= 1;

    return !this.display[pixelIndex];
  }

  clear() {
    this.display = new Array(this.cols * this.rows).fill(0);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.cols * this.rows; i++) {
      const x = (i % this.cols) * this.scale;
      const y = Math.floor(i / this.cols) * this.scale;

      if (this.display[i]) {
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(x, y, this.scale, this.scale);
      }
    }
  }

  getDisplay() {
    return this.display;
  }
}
