
class Projection {

  constructor(ratio, fov, z_near, z_far) {
    this.ratio = ratio;
    this.fov = fov;
    this.z_near = z_near;
    this.z_far = z_far;
  }

  set_fov(n) {
    this.fov += n;
  }

  set_near(n) {
    this.z_near  += n;
  }

  set_far(n) {
    this.z_far += n;
  }

  static getPerspectiveFrustum(left, right, bottom, top, near, far) {
    let c1 = (2 * far * near) / (far - near);
    let c2 = (far + near) / (far - near);
  
    let x_scale = (2*near)/(right-left);
    let y_scale = (2*near)/(top - bottom);
  
    return new Mat4([
      x_scale, 0, 0, 0,
      0, y_scale, 0, 0,
      0, 0, c2, -c1,
      0, 0, 1, 0,
    ])
  }

  getFrustum() {
    let rad_fov = (this.fov / 360) * 2 * Math.PI;
    let tan = Math.tan(rad_fov/2);
    
    let top = tan * this.z_near;
    let bottom = top * -1;
    let right = top * (this.ratio);
    let left = right * -1;
  
    return Projection.getPerspectiveFrustum(left, right, bottom, top, this.z_near, this.z_far);
  }
}