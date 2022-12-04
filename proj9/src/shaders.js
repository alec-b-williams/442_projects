class Shaders {
  static vertex_source = 
    `#version 300 es
    precision mediump float;

    uniform mat4 model;
    uniform mat4 modelview;
    uniform mat4 projection;

    in vec3 coordinates;
    in vec4 color;
    in vec2 uv;
    in vec3 normal;

    out vec3 v_pos;
    out vec4 v_color;
    out vec2 v_uv;
    out vec3 v_normal;

    void main( void ) {
      gl_Position = projection * modelview * vec4( coordinates, 1.0 );

      v_pos = ( model * vec4( coordinates, 1.0 ) ).xyz;  
      v_color = color;
      v_uv = uv;
      v_normal = normalize( mat3( model ) * normal );
    }
  `;

  static fragment_source = 
    `#version 300 es
    #define MAX_LIGHT 12
    precision mediump float;

    uniform sampler2D u_image0;
    uniform sampler2D u_image1;

    uniform mat4 model;
    uniform mat4 modelview;
    uniform vec3 camera_pos;

    uniform bool disable_lighting;

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
      vec3 camera_dir,
      float specular,
      float shininess
    ) {
      float cos_light_surf_normal = dot( surf_normal, light_dir );
      if( cos_light_surf_normal <= 0.0 ) {
        return vec3( 0.0, 0.0, 0.0 );
      }

      vec3 light_reflection = 
                        2.0 * cos_light_surf_normal * surf_normal - light_dir;

      return 
      pow( 
          max( dot( light_reflection, normalize( camera_dir ) ), 0.0  ),
          shininess 
      ) * light_color * specular * cos_light_surf_normal;
    }

    void main( void ) {
      if (disable_lighting) {
        f_color = texture(u_image0, v_uv);
        return;
      }

      vec3 cam_dir = normalize(camera_pos - v_pos); 

      vec3 ambient_color = vec3( mat_ambient, mat_ambient, mat_ambient );

      // color from directional light
      vec3 diffuse_color = diff_color(v_normal, sun_dir, sun_color, mat_diffuse);
      vec3 specular_color = spec_color(v_normal, sun_dir, sun_color, cam_dir, mat_specular, mat_shininess);
      vec3 dir_color = ambient_color + diffuse_color + specular_color;

      // color from point light(s)
      vec3 total_point_color = vec3(0.0, 0.0, 0.0);
      
      for (int i = 0; i < size; i++) {
        int index = i * 3;
        vec3 point_pos = vec3(a_point_pos[index], a_point_pos[index+1], a_point_pos[index+2]);
        vec3 point_color = vec3(a_point_color[index], a_point_color[index+1], a_point_color[index+2]);

        vec3 v_light_pos = normalize( point_pos - v_pos );
        float attenuation = 1.0 / (linear_scale * distance(v_pos, point_pos));
        diffuse_color = diff_color(v_normal, v_light_pos, point_color, mat_diffuse);
        specular_color = spec_color(v_normal, v_light_pos, point_color, cam_dir, mat_specular, mat_shininess);
        total_point_color += (diffuse_color + specular_color) * attenuation;
      }
      
      vec3 mat_color = dir_color + total_point_color;

      f_color = texture(u_image0, v_uv) * vec4(mat_color, 1.0) * v_color;
      //f_color = v_color * vec4(mat_color,1);
      //f_color = texture(tex_0, v_uv);
    }
  `;
}
