class Node {
  constructor( data ) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.scale = new Vec4(1,1,1,1);
    this.roll = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.data = data;
    this.children = [];
    this.update_bearing(0,0,0,0,0,0);
  }

  add_child() {
    let child = new Node();
    this.children.push(child);
    return child;
  }

  get_matrix() {
    let matrix = new Mat4();
    
    matrix = matrix.mul( Mat4.translation( this.x, this.y, this.z ));
    matrix = matrix.mul( Mat4.scale( this.scale.x, this.scale.y, this.scale.z ) );
    matrix = matrix.mul( Mat4.rotation_xz( this.yaw ) );
    matrix = matrix.mul( Mat4.rotation_yz( this.pitch ) );
    matrix = matrix.mul( Mat4.rotation_xy( this.roll ) );
    return matrix;
  }

  update() {

  }

  get_view() {
    let roll = Mat4.rotation_xy(this.roll);
    let pitch = Mat4.rotation_yz(this.pitch);
    let yaw  = Mat4.rotation_xz(this.yaw);
    let translation = Mat4.translation(this.x, this.y, this.z);

    let view = yaw.mul(pitch).mul(roll);
    view = translation.mul(view);
    return view.inverse();
  }

  update_bearing(x, y, z, p, r, ya) {
    this.x += x;
    this.y += y;
    this.z += z;
    
    if (((this.pitch + p) < 0.25) && ((this.pitch + p) > -0.25)) {
      this.pitch += p;
    }

    this.roll += r;
    this.yaw += ya;

    let roll = Mat4.rotation_xy(this.roll);
    let pitch = Mat4.rotation_yz(this.pitch);
    let yaw = Mat4.rotation_xz(this.yaw);
    this.orient = yaw.mul(pitch).mul(roll);
  }

  move_forward(dist) {
    let x = this.orient.data[2]*dist;
    let y = this.orient.data[6]*dist;
    let z = this.orient.data[10]*dist;
    this.update_bearing(x,y,z,0,0,0);
  }

  move_back(dist) {
    let x = this.orient.data[2]*-dist;
    let y = this.orient.data[6]*-dist;
    let z = this.orient.data[10]*-dist;
    this.update_bearing(x,y,z,0,0,0);
  }

  move_right(dist) {
    let x = this.orient.data[0]*dist;
    let y = this.orient.data[4]*dist;
    let z = this.orient.data[8]*dist;
    this.update_bearing(x,y,z,0,0,0);
  }

  move_left(dist) {
    let x = this.orient.data[0]*-dist;
    let y = this.orient.data[4]*-dist;
    let z = this.orient.data[8]*-dist;
    this.update_bearing(x,y,z,0,0,0);
  }

  move_up(dist) {
    let x = this.orient.data[1]*dist;
    let y = this.orient.data[5]*dist;
    let z = this.orient.data[9]*dist;
    this.update_bearing(x,y,z,0,0,0);
  }

  move_down(dist) {
    let x = this.orient.data[1]*-dist;
    let y = this.orient.data[5]*-dist;
    let z = this.orient.data[9]*-dist;
    this.update_bearing(x,y,z,0,0,0);
  }

  yaw_left(scale) {
    let ya = Math.cos(-this.roll*2*Math.PI)*-scale;
    let p = Math.sin(-this.roll*2*Math.PI)*-scale;
    this.update_bearing(0,0,0,p,0,ya);
  }

  yaw_right(scale) {
    let ya = Math.cos(-this.roll*2*Math.PI)*scale;
    let p = Math.sin(-this.roll*2*Math.PI)*scale;
    this.update_bearing(0,0,0,p,0,ya);
  }

  pitch_up(scale) {
    let ya = Math.sin(this.roll*2*Math.PI)*scale*this.inversion;
    let p = Math.cos(this.roll*2*Math.PI)*scale*this.inversion;
    this.update_bearing(0,0,0,p,0,ya);
  }

  pitch_down(scale) {
    let ya = Math.sin(this.roll*2*Math.PI)*-scale*this.inversion;
    let p = Math.cos(this.roll*2*Math.PI)*-scale*this.inversion;
    this.update_bearing(0,0,0,p,0,ya);
  }

  roll_cw(scale) {
    let r = scale;
    this.update_bearing(0,0,0,0,r,0);
  }

  roll_ccw(scale) {
    let r = -scale;
    this.update_bearing(0,0,0,0,r,0);
  }
}