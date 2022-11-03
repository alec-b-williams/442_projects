class Material {
  constructor(ambient, diffuse, specular, shininess, img) {
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
  }

  load_material(gl, program) {
    let tex = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, tex );

    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA,
      256, 256, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, 
      xor_texture()
    );

    gl.generateMipmap(gl.TEXTURE_2D);

    set_uniform_scalar( gl, program, 'mat_ambient', this.ambient );
    set_uniform_scalar( gl, program, 'mat_diffuse', this.diffuse );
    set_uniform_scalar( gl, program, 'mat_specular', this.specular );
    set_uniform_scalar( gl, program, 'mat_shininess', this.shininess );
  }
}