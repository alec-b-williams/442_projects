class RenderMesh {
  constructor(matrix, mesh, da) {
    this.matrix = matrix;
    this.mesh = mesh;
    this.disable_lighting = da
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