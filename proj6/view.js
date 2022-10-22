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
  }

  getView() {
    let roll = Mat4.rotation_xy(this.roll);
    let pitch = Mat4.rotation_yz(this.pitch);
    let yaw  = Mat4.rotation_xz(this.yaw);
    let translation = Mat4.translation(this.x, this.y, this.z);

    let view = yaw.mul(pitch).mul(roll)
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
  }

  update(delta, inversion) {
    let keys = this.input.keys_down_list();
    let x=0, y=0, z=0, p=0, r=0, ya=0;

    let roll = Mat4.rotation_xy(this.roll);
    let pitch = Mat4.rotation_yz(this.pitch);
    let yaw  = Mat4.rotation_xz(this.yaw);
    let view = yaw.mul(pitch).mul(roll)

    if (keys.includes("KeyA")) {
      x -= view.data[0]*transform_scale;
      y -= view.data[4]*transform_scale;
      z -= view.data[8]*transform_scale;
    }
    if (keys.includes("KeyD")) {
      x += view.data[0]*transform_scale;
      y += view.data[4]*transform_scale;
      z += view.data[8]*transform_scale;
    }
    if (keys.includes("KeyC")) {
      x -= view.data[1]*transform_scale;
      y -= view.data[5]*transform_scale;
      z -= view.data[9]*transform_scale;
    }
    if (keys.includes("Space")) {
      x += view.data[1]*transform_scale;
      y += view.data[5]*transform_scale;
      z += view.data[9]*transform_scale;
    }
    if (keys.includes("KeyS")) {
      x -= view.data[2]*transform_scale;
      y -= view.data[6]*transform_scale;
      z -= view.data[10]*transform_scale;
    }
    if (keys.includes("KeyW")) {
      x += view.data[2]*transform_scale;
      y += view.data[6]*transform_scale;
      z += view.data[10]*transform_scale;
    }
    
    if (keys.includes("KeyQ")) {
      r -= rotate_scale;
    }
    if (keys.includes("KeyE")) {
      r += rotate_scale;
    }
    if (keys.includes("ArrowRight")) {
      ya += Math.cos(-this.roll*2*Math.PI)*rotate_scale;
      p += Math.sin(-this.roll*2*Math.PI)*rotate_scale;
    }
    if (keys.includes("ArrowLeft")) {
      ya -= Math.cos(-this.roll*2*Math.PI)*rotate_scale;
      p -= Math.sin(-this.roll*2*Math.PI)*rotate_scale;
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
}