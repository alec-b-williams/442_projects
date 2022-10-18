
function getFrustum(ratio, v_fov, z_near, z_far) {
  let rad_fov = (v_fov / 360) * 2 * Math.PI;
  let tan = Math.tan(rad_fov/2);
  
  let top = tan * z_near;
  let bottom = top * -1;
  let right = top * (ratio);
  let left = right * -1;

  return getPerspectiveFrustum(left, right, bottom, top, z_near, z_far);
  
  let c1 = (2 * z_far * z_near) / (z_far - z_near);
  let c2 = (z_far + z_near) / (z_far - z_near);

  let x_aspect = 1/tan;
  let y_aspect = 1/tan * ratio;

  return new Mat4([
    x_aspect, 0, 0, 0,
    0, y_aspect, 0, 0,
    0, 0, c2, -c1,
    0, 0, 1, 0,
  ])
}

function getPerspectiveFrustum(left, right, bottom, top, near, far) {
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