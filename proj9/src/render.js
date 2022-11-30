class RenderMesh {
  constructor(matrix, mesh) {
    this.matrix = matrix;
    this.mesh = mesh;
  }
}

class Light {
  constructor(color) {
    this.color = color;
  }
}

class RenderLight {
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }
}