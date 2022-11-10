class Shaders {
  static vertex_source = 
    `#version 300 es
    precision mediump float;

    uniform mat4 modelview;
    uniform mat4 spin;

    in vec3 coordinates;
    in vec4 color;
    in vec2 uv;
    in vec3 normal;

    out vec3 v_pos;
    out vec4 v_color;
    out vec2 v_uv;
    out vec3 v_normal;

    void main( void ) {
        gl_Position = modelview * spin * vec4( coordinates, 1.0 );
        v_pos = coordinates;
        v_color = color;
        v_uv = uv;
        v_normal = normalize( mat3( modelview ) * mat3(spin) * normal );
    }
  `;

  static fragment_source = 
    `#version 300 es
    #define MAX_LIGHT 3
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

    uniform int size;
    uniform float a_point_pos[MAX_LIGHT * 3];
    uniform float a_point_color[MAX_LIGHT * 3];
    uniform float linear_scale;

    in vec3 v_pos;
    in vec4 v_color;
    in vec2 v_uv;
    in vec3 v_normal;

    out vec4 f_color;

    float maxDot (vec3 v1, vec3 v2) {
      return max( dot(v1, v2), 0.0);
    }

    vec3 diff_color(
      vec3 normal,
      vec3 light_dir,
      vec3 light_color,
      float mat_diffuse
    ) {
      return mat_diffuse * light_color * maxDot( normal, light_dir );
    }

    vec3 spec_color(
      vec3 surf_normal,
      vec3 light_dir,
      vec3 light_color,
      vec3 camera_pos,
      float specular,
      float shininess
    ) {
      float cos_light_surf_normal = dot( surf_normal, light_dir );
      if( cos_light_surf_normal <= 0.0 ) {
        return vec3( 0.0, 0.0, 0.0 );
      }

      vec3 n_normal  = normalize(surf_normal);
      vec3 n_light_dir = normalize(light_dir);
      vec3 n_camera_pos = normalize(camera_pos);

      vec3 r = normalize(2.0 * dot(n_light_dir, n_normal) * n_normal - light_dir );
      return (specular * pow(maxDot(r, n_camera_pos), shininess)) * light_color;
    }

    void main( void ) {
      vec3 v_sun_dir =  mat3( modelview ) * sun_dir;
      vec3 coords_tx = ( mat3(modelview) * camera_pos ).xyz;

      // color from directional light
      vec4 ambient_color = vec4( mat_ambient, mat_ambient, mat_ambient, 1.0 );
      vec4 diffuse_color = vec4( diff_color(v_normal, v_sun_dir, sun_color, mat_diffuse), 1.0 );
      vec4 specular_color = vec4( spec_color(v_normal, v_sun_dir, sun_color, 
                                             coords_tx, mat_specular, mat_shininess), 1.0 );
      vec4 dir_color = ambient_color + diffuse_color + specular_color;

      // color from point light(s)
      

      vec4 total_point_color = vec4(0.0, 0.0, 0.0, 0.0);
      
      for (int i = 0; i < size; i++) {
        int index = i * 3;
        vec3 point_pos = vec3(a_point_pos[index], a_point_pos[index+1], a_point_pos[index+2]);
        vec3 point_color = vec3(a_point_color[index], a_point_color[index+1], a_point_color[index+2]);
        //vec3 point_pos = vec3(-1,-1,0);
        //vec3 point_color = vec3(1,.25,.25);

        vec3 v_point_pos =  mat3( modelview ) * point_pos;
        float attenuation = 1.0 / (linear_scale * distance(v_pos, point_pos));
        diffuse_color = vec4( diff_color(v_normal, v_point_pos, point_color, mat_diffuse), 1.0 );
        specular_color = vec4( spec_color(v_normal, v_point_pos, point_color, 
                                        coords_tx, mat_specular, mat_shininess), 1.0 );
        total_point_color += (diffuse_color + specular_color) * attenuation;
      }
      
      vec4 mat_color = dir_color + total_point_color;

      f_color = texture(tex_0, v_uv) * mat_color;
      //f_color = v_color * mat_color;
    }
  `;
}
