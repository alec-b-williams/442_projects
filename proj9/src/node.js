class Node {
  constructor( data ) {
    this.position = Vec4(0,0,0,1);
    this.scale = Vec4(1,1,1,1);
    this.roll = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.data = data;
    this.children = [];
  }

  add_child() {
    let child = new Node();
    this.children.push(child);
    return child;
  }

  get_matrix() {
    let matrix = new Mat4();
    matrix = matrix.mul( Mat4.translation( this.position ) );
    matrix = matrix.mul( Mat4.scale( this.scale ) );
    matrix = matrix.mul( Mat4.rotation_xz( this.yaw ) );
    matrix = matrix.mul( Mat4.rotation_yz( this.pitch ) );
    matrix = matrix.mul( Mat4.rotation_xy( this.roll ) );
    return matrix;
  }

}