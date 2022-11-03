class Shaders {
  static vertex_source = 
    `#version 300 es
    precision mediump float;

    uniform mat4 modelview;

    in vec3 coordinates;
    in vec4 color;
    in vec2 uv;
    in vec3 normal;

    out vec3 v_pos;
    out vec4 v_color;
    out vec2 v_uv;
    out vec3 v_normal;

    void main( void ) {
        gl_Position = modelview * vec4( coordinates, 1.0 );
        v_pos = coordinates;
        v_color = color;
        v_uv = uv;
        v_normal = normalize( mat3( modelview ) * normal );
    }
  `;

  static fragment_source = 
    `#version 300 es
    precision mediump float;

    uniform sampler2D tex_0;
    uniform mat4 modelview;
    uniform vec3 camera_pos;

    uniform float mat_ambient;
    uniform float mat_diffuse;
    uniform float mat_specular;
    uniform float mat_shininess;

    uniform vec3 sun_dir;
    uniform vec3 sun_color;

    in vec3 v_pos;
    in vec4 v_color;
    in vec2 v_uv;
    in vec3 v_normal;

    out vec4 f_color;

    vec3 diff_color(
      vec3 normal,
      vec3 light_dir,
      vec3 light_color,
      float mat_diffuse
    ) {
      return mat_diffuse * light_color * max( dot( normal, light_dir ), 0.0 );
    }

    vec3 spec_color(
      vec3 normal,
      vec3 light_dir,
      vec3 light_color,
      vec3 camera_pos,
      float specular,
      float shininess
    ) {
      float cos_light_surf_normal = dot( normal, light_dir );
      if( cos_light_surf_normal <= 0.0 ) {
        return vec3( 0.0, 0.0, 0.0 );
      }

      vec3 n_light_dir = normalize(light_dir);
      vec3 n_normal  = normalize(normal); 
      vec3 n_camera_pos = normalize(camera_pos);

      vec3 r = normalize(2.0 * dot(n_light_dir, n_normal) * n_normal - light_dir);
      return specular * pow(max(dot(r, n_camera_pos),0.0), shininess) * light_color;
    }

    void main( void ) {
      vec3 v_sun_dir = normalize( mat3( modelview ) * sun_dir );
      //vec3 coords_tx = ( modelview * vec4( (camera_pos), 1.0 ) ).xyz;
      vec3 n = normalize(camera_pos - v_pos);

      vec4 ambient_color = vec4( mat_ambient, mat_ambient, mat_ambient, 1.0 );
      vec4 diffuse_color = vec4( diff_color(v_normal, v_sun_dir, sun_color, mat_diffuse), 1.0 );
      vec4 specular_color = vec4( spec_color(v_normal, v_sun_dir, sun_color, 
                                             n, mat_specular, mat_shininess), 1.0 );
      vec4 mat_color = ambient_color + diffuse_color + specular_color;

      f_color = texture(tex_0, v_uv) * mat_color;
    }
  `;
}
