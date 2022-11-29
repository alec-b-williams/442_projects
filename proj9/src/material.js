class Material {
  constructor(ambient, diffuse, specular, shininess, img) {
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
  }

  load_material(gl, program) {
    set_uniform_scalar( gl, program, 'mat_ambient', this.ambient );
    set_uniform_scalar( gl, program, 'mat_diffuse', this.diffuse );
    set_uniform_scalar( gl, program, 'mat_specular', this.specular );
    set_uniform_scalar( gl, program, 'mat_shininess', this.shininess );
  }
}