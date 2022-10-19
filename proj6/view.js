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
  }

  getView() {
    let roll = Mat4.rotation_xy(this.roll);
    let pitch = Mat4.rotation_yz(this.pitch);
    let yaw  = Mat4.rotation_xz(this.yaw);
    let translation = Mat4.translation(this.x, this.y, this.z);

    return translation.mul(yaw).mul(pitch).mul(roll).inverse();
  }

  update(delta) {
    let keys = this.input.keys_down_list();
    let x=0, y=0, z=0, p=0, r=0, ya=0;

    if (keys.includes("KeyA")) {
      x -= transform_scale;
    }
    if (keys.includes("KeyD")) {
      x += transform_scale;
    }
    if (keys.includes("KeyW")) {
      z += transform_scale;
    }
    if (keys.includes("KeyS")) {
      z -= transform_scale;
    }
    if (keys.includes("Space")) {
      y += transform_scale;
    }
    if (keys.includes("KeyC")) {
      y -= transform_scale;
    }
    if (keys.includes("KeyQ")) {
      r -= rotate_scale;
    }
    if (keys.includes("KeyE")) {
      r += rotate_scale;
    }
    if (keys.includes("ArrowUp")) {
      p -= rotate_scale;
    }
    if (keys.includes("ArrowDown")) {
      p += rotate_scale;
    }
    if (keys.includes("ArrowRight")) {
      ya += rotate_scale;
    }
    if (keys.includes("ArrowLeft")) {
      ya -= rotate_scale;
    }


    this.update_bearing(x, y, z, p, r, ya);
  }

  update_bearing(x, y, z, p, r, ya) {
    this.x += x;
    this.y += y;
    this.z += z;
    
    if (((this.pitch + p) < 0.25) && ((this.pitch + p) > -0.25)) {
      this.pitch = p;
    }

    this.roll += r;
    this.yaw += ya;
  }
}