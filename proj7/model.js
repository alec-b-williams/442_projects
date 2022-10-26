const xy_rotation_speed = 0.25;
const xz_rotation_speed = 0.125;
const yz_rotation_speed = 0.05;

class Model {

  static getXYRotation(time) {
    let xy_rotation_amt = xy_rotation_speed * time;
    xy_rotation_amt %= 1;
    return Mat4.rotation_xy(xy_rotation_amt);
  }

  static getXZRotation(time) {
    let xz_rotation_amt = xz_rotation_speed * time;
    xz_rotation_amt %= 1;
    return Mat4.rotation_xz(xz_rotation_amt);
  }

  static getYZRotation(time) {
    let yz_rotation_amt = yz_rotation_speed * time;
    yz_rotation_amt %= 1;
    return Mat4.rotation_yz(yz_rotation_amt);
  }
}