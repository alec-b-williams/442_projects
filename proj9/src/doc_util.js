function update_dist(n) {
  light_dist += n;
}

function toggle_inversion() {
  camera.inversion *= -1;
}

function xor_texture() {
  let data = new Array( 256 * 256 * 4 );
  let width = 256;
  for( let row = 0; row < width; row++ ) {
    for( let col = 0; col < width; col++ ) {
      let pix = ( row * width + col ) * 4;
      data[pix] = data[pix + 1] = data[pix + 2] = row ^ col;
      data[pix + 3] = 255;
    }
  }

  return new Uint8Array( data );
}

function on_load() {
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
      gl.RGBA, gl.UNSIGNED_BYTE, this 
  );

  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

function update_tex(image) {
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
      gl.RGBA, gl.UNSIGNED_BYTE, image 
  );

  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

function update_labels() {
  document.getElementById("fov_label").textContent = "FoV: " + projection.fov;
  document.getElementById("keys_label").textContent = "keys: " + input.keys_down_list().join(", ");
  document.getElementById("inversion_label").textContent = " look inversion: " + (camera.inversion == 1 ? "true" : "false")
  document.getElementById("cam_x_label").textContent = "x: " + camera.x.toFixed(2);
  document.getElementById("cam_y_label").textContent = "y: " + camera.y.toFixed(2);
  document.getElementById("cam_z_label").textContent = "z: " + camera.z.toFixed(2);
  document.getElementById("cam_roll_label").textContent = "roll: " + (camera.roll*360).toFixed(1);
  document.getElementById("cam_pitch_label").textContent = "pitch: " + (camera.pitch*360).toFixed(1)
  document.getElementById("cam_yaw_label").textContent = "yaw: " + (camera.yaw*360).toFixed(1)
}

function rand_max_min(min, max) {
  return Math.random() * (max - min) + min;
}