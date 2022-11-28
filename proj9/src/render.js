class RenderMesh {
  constructor(matrix, mesh, mat) {
    this.matrix = matrix;
    this.mesh = mesh;
    this.mat = mat;
  }
}

class RenderLight {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
  }
}