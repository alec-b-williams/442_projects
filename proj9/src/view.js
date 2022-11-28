const transform_scale = 0.02; 
const rotate_scale = 0.005;

class View {

  constructor(input) {
    this.x = 0;
    this.y = 0;
    this.z = -2;
    this.pitch = 0;
    this.roll = 0;
    this.yaw = 0;
    this.input = input;
    this.inversion = 1;
    this.orient = new Mat4();
  }

  getView() {
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

  update(delta, inversion) {
    let keys = this.input.keys_down_list();
    let x=0, y=0, z=0, p=0, r=0, ya=0;

    if (keys.includes("KeyA")) {
      this.move_left(transform_scale);
    }
    if (keys.includes("KeyD")) {
      this.move_right(transform_scale);
    }
    if (keys.includes("KeyC")) {
      this.move_down(transform_scale);
    }
    if (keys.includes("Space")) {
      this.move_up(transform_scale);
    }
    if (keys.includes("KeyS")) {
      this.move_back(transform_scale);
    }
    if (keys.includes("KeyW")) {
      this.move_forward(transform_scale);
    }
    
    if (keys.includes("KeyQ")) {
      this.roll_ccw(rotate_scale);
    }
    if (keys.includes("KeyE")) {
      this.roll_cw(rotate_scale);
    }
    if (keys.includes("ArrowRight")) {
      this.yaw_right(rotate_scale);
    }
    if (keys.includes("ArrowLeft")) {
      this.yaw_left(rotate_scale);
    }
    if (keys.includes("ArrowUp")) {
      ya -= Math.sin(this.roll*2*Math.PI)*rotate_scale*this.inversion;
      p -= Math.cos(this.roll*2*Math.PI)*rotate_scale*this.inversion;
    }
    if (keys.includes("ArrowDown")) {
      ya += Math.sin(this.roll*2*Math.PI)*rotate_scale*this.inversion;
      p += Math.cos(this.roll*2*Math.PI)*rotate_scale*this.inversion;
    }
    
    this.update_bearing(x, y, z, p, r, ya);
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