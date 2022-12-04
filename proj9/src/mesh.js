const TAU = 2 * Math.PI;
const VERTEX_STRIDE = 36;
const UV_VERTEX_STRIDE = 48;

class Mesh {
    /** 
     * Creates a new mesh and loads it into video memory.
     * 
     * @param {WebGLRenderingContext} gl  
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor( gl, program, vertices, indices ) {
        this.verts = create_and_load_vertex_buffer( gl, vertices, gl.STATIC_DRAW );
        this.indis = create_and_load_elements_buffer( gl, indices, gl.STATIC_DRAW );

        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;
    }

    /**
     * Create a box mesh with the given dimensions and colors.
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth 
     */

    static box( gl, program, width, height, depth, mat ) {
      let hwidth = width / 2.0;
      let hheight = height / 2.0;
      let hdepth = depth / 2.0;

      let v1 = new Vec4(hwidth, -hheight, -hdepth).norm();
      let v2 = new Vec4(-hwidth, -hheight, -hdepth).norm();
      let v3 = new Vec4(-hwidth, hheight, -hdepth).norm();
      let v4 = new Vec4(hwidth, hheight, -hdepth).norm();

      let v5 = new Vec4(hwidth, -hheight, hdepth).norm();
      let v6 = new Vec4(-hwidth, -hheight, hdepth).norm();
      let v7 = new Vec4(-hwidth, hheight, hdepth).norm();
      let v8 = new Vec4(hwidth, hheight, hdepth).norm();

      let verts = [
        hwidth, -hheight, -hdepth,      1,1,1,1,   1,1, v1.x,v1.y,v1.z,
        -hwidth, -hheight, -hdepth,     1,1,1,1,   0,1, v2.x,v2.y,v2.z,
        -hwidth, hheight, -hdepth,      1,1,1,1,   0,0, v3.x,v3.y,v3.z,
        hwidth, hheight, -hdepth,       1,1,1,1,   1,0, v4.x,v4.y,v4.z,

        hwidth, -hheight, hdepth,       1,1,1,1,   0,0, v5.x,v5.y,v5.z,
        -hwidth, -hheight, hdepth,      1,1,1,1,   1,0, v6.x,v6.y,v6.z,
        -hwidth, hheight, hdepth,       1,1,1,1,   1,1, v7.x,v7.y,v7.z,
        hwidth, hheight, hdepth,        1,1,1,1,   0,1, v8.x,v8.y,v8.z,
      ];

      let indis = [
        // counter-clockwise winding
        0, 3, 2, 2, 1, 0,
        4, 7, 3, 3, 0, 4,
        5, 6, 7, 7, 4, 5,
        1, 2, 6, 6, 5, 1,
        3, 7, 6, 6, 2, 3,
        4, 0, 1, 1, 5, 4,
      ];

      let mesh = new Mesh( gl, program, verts, indis );
      mesh.material = mat;
      return mesh;
    }

    static textured_box( gl, program, width, height, depth, mat ) {
      let hwidth = width / 2.0;
      let hheight = height / 2.0;
      let hdepth = depth / 2.0;

      let verts = [
          // front face: 0 - 3
          -hwidth, hheight, -hdepth,     0.0, 0.0, 1.0, 1.0,   0,    0.25,  // top left
          hwidth, hheight, -hdepth,      1.0, 1.0, 0.0, 1.0,   0.25, 0.25,  // top right
          -hwidth, -hheight, -hdepth,    0.0, 1.0, 0.0, 1.0,   0,    0.5,   // bottom left
          hwidth, -hheight, -hdepth,     1.0, 0.0, 0.0, 1.0,   0.25, 0.5,   // bottom right

          // right face: 4 - 7
          hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,   0.25, 0.25,  // top left
          hwidth, hheight, hdepth,       1.0, 1.0, 0.0, 1.0,   0.5,  0.25,  // top right
          hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,   0.25, 0.5,   // bottom left
          hwidth, -hheight, hdepth,      1.0, 0.0, 0.0, 1.0,   0.5,  0.5,   // bottom right

          // back face: 8 - 11
          hwidth, hheight, hdepth,       0.0, 0.0, 1.0, 1.0,   0.5,  0.25,  // top left
          -hwidth, hheight, hdepth,      1.0, 1.0, 0.0, 1.0,   0.75, 0.25,  // top right
          hwidth, -hheight, hdepth,      0.0, 1.0, 0.0, 1.0,   0.5,  0.5,   // bottom left
          -hwidth, -hheight, hdepth,     1.0, 0.0, 0.0, 1.0,   0.75, 0.5,   // bottom right

          // left face: 12 - 15
          -hwidth, hheight, -hdepth,     1.0, 1.0, 0.0, 1.0,   0.75, 0.25,  // top left
          -hwidth, hheight, hdepth,      0.0, 0.0, 1.0, 1.0,   1,    0.25,  // top right
          -hwidth, -hheight, -hdepth,    1.0, 0.0, 0.0, 1.0,   0.75, 0.5,   // bottom left
          -hwidth, -hheight, hdepth,     0.0, 1.0, 0.0, 1.0,   1,    0.5,   // bottom right

          // top face: 16 - 19
          hwidth, hheight, hdepth,       1.0, 1.0, 0.0, 1.0,   0.5,  0,     // top left
          -hwidth, hheight, hdepth,      0.0, 0.0, 1.0, 1.0,   0.75, 0,     // top right
          hwidth, hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,   0.5,  0.25,  // bottom left
          -hwidth, hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,   0.75, 0.25,  // bottom right

          // bottom face: 20 - 23
          hwidth, -hheight, hdepth,      1.0, 1.0, 0.0, 1.0,   0.5, 0.5,    // top left
          -hwidth, -hheight, hdepth,     0.0, 0.0, 1.0, 1.0,   0.75, 0.5,   // top right
          hwidth, -hheight, -hdepth,     1.0, 0.0, 0.0, 1.0,   0.5, 0.75,   // bottom left
          -hwidth, -hheight, -hdepth,    0.0, 1.0, 0.0, 1.0,   0.75, 0.75,  // bottom right
      ];

      let indis = [
          // counter-clockwise winding
          1,  0,   2,  2,  3,  1,
          5,  4,   6,  6,  7,  5,
          9,  8,  10, 10, 11,  9,
          14, 12, 13, 13, 15, 14,
          18, 16, 17, 17, 19, 18,
          21, 20, 22, 22, 23, 21,
      ];
      let mesh = new Mesh( gl, program, verts, indis );
      mesh.material = mat;
      return mesh;
    }

    static skybox( gl, program, width, height, depth, mat ) {
      let hwidth = width / 2.0;
      let hheight = height / 2.0;
      let hdepth = depth / 2.0;

      let front = new Vec4(0,0,-1).scaled(-1);
      let right = new Vec4(1,0,0).scaled(-1);
      let back = new Vec4(0,0,1).scaled(-1);
      let left = new Vec4(-1,0,0).scaled(-1);
      let top = new Vec4(0,1,0).scaled(-1);
      let bottom = new Vec4(0,-1,0).scaled(-1);

      let verts = [
          // front face: 0 - 3
          -hwidth, hheight, -hdepth,     1,1,1,1,   0,    0.25,  front.x,front.y,front.z, // top left
          hwidth, hheight, -hdepth,      1,1,1,1,   0.25, 0.25,  front.x,front.y,front.z,// top right
          -hwidth, -hheight, -hdepth,    1,1,1,1,   0,    0.5,   front.x,front.y,front.z,// bottom left
          hwidth, -hheight, -hdepth,     1,1,1,1,   0.25, 0.5,   front.x,front.y,front.z,// bottom right

          // right face: 4 - 7
          hwidth, hheight, -hdepth,      1,1,1,1,   0.25, 0.25,  right.x,right.y,right.z,// top left
          hwidth, hheight, hdepth,       1,1,1,1,   0.5,  0.25,  right.x,right.y,right.z,// top right
          hwidth, -hheight, -hdepth,     1,1,1,1,   0.25, 0.5,   right.x,right.y,right.z,// bottom left
          hwidth, -hheight, hdepth,      1,1,1,1,   0.5,  0.5,   right.x,right.y,right.z,// bottom right

          // back face: 8 - 11
          hwidth, hheight, hdepth,       1,1,1,1,   0.5,  0.25,  back.x,back.y,back.z,// top left
          -hwidth, hheight, hdepth,      1,1,1,1,   0.75, 0.25,  back.x,back.y,back.z,// top right
          hwidth, -hheight, hdepth,      1,1,1,1,   0.5,  0.5,   back.x,back.y,back.z,// bottom left
          -hwidth, -hheight, hdepth,     1,1,1,1,   0.75, 0.5,   back.x,back.y,back.z,// bottom right

          // left face: 12 - 15
          -hwidth, hheight, -hdepth,     1,1,1,1,   0.75, 0.25,  left.x,left.y,left.z,// top left
          -hwidth, hheight, hdepth,      1,1,1,1,   1,    0.25,  left.x,left.y,left.z,// top right
          -hwidth, -hheight, -hdepth,    1,1,1,1,   0.75, 0.5,   left.x,left.y,left.z,// bottom left
          -hwidth, -hheight, hdepth,     1,1,1,1,   1,    0.5,   left.x,left.y,left.z,// bottom right

          // top face: 16 - 19
          hwidth, hheight, hdepth,       1,1,1,1,   0.5,  0,     top.x,top.y,top.z,// top left
          -hwidth, hheight, hdepth,      1,1,1,1,   0.75, 0,     top.x,top.y,top.z,// top right
          hwidth, hheight, -hdepth,      1,1,1,1,   0.5,  0.25,  top.x,top.y,top.z,// bottom left
          -hwidth, hheight, -hdepth,     1,1,1,1,   0.75, 0.25,  top.x,top.y,top.z,// bottom right

          // bottom face: 20 - 23
          hwidth, -hheight, hdepth,      1,1,1,1,   0.5, 0.5,    bottom.x,bottom.y,bottom.z,// top left
          -hwidth, -hheight, hdepth,     1,1,1,1,   0.75, 0.5,   bottom.x,bottom.y,bottom.z,// top right
          hwidth, -hheight, -hdepth,     1,1,1,1,   0.5, 0.75,   bottom.x,bottom.y,bottom.z,// bottom left
          -hwidth, -hheight, -hdepth,    1,1,1,1,   0.75, 0.75,  bottom.x,bottom.y,bottom.z,// bottom right
      ];

      let indis = [
          // counter-clockwise winding
          2,  0,   1,  1,  3,  2,
          6,  4,   5,  5,  7,  6,
          10,  8,  9, 9, 11,  10,
          13, 12, 14, 14, 15, 13,
          17, 16, 18, 18, 19, 17,
          22, 20, 21, 21, 23, 22,
      ];
      let mesh = new Mesh( gl, program, verts, indis );
      mesh.material = mat;
      return mesh;
    }

    static uv_sphere(gl, program, subdivs, mat) {
      let verts = []
      let indis = []

      // for each layer in the y direction
      for (let layer = 0; layer <= subdivs; layer++) {
        let y_turns = layer / subdivs / 2; 
        let y = Math.cos( y_turns * TAU ) / 2;

        // for each subdivision within the y-layer
        for( let subdiv = 0; subdiv <= subdivs; subdiv++ ) {
          let turns = subdiv / subdivs;
          let rads = turns * TAU;
      
          // need to scale x/z based on radius of circle in y-plane thru sphere
          let x = reduce(Math.cos( rads ) / 2) * Math.sin( y_turns * TAU );
          let z = reduce(Math.sin( rads ) / 2) * Math.sin( y_turns * TAU );

          verts.push(x,y,z);
          verts.push(1,1,1,1);
          verts.push(subdiv/subdivs, layer/subdivs)
          verts.push(x,y,z);
        }

        if (layer === 0) {continue;}

        // generate indis with current layer and previous layer
        let prev = (layer-1)*(subdivs+1);
        for ( let offset = prev; offset < (prev + subdivs); offset++ ) {
          indis.push(
            offset, offset + subdivs + 1, offset + subdivs + 2,
            offset + subdivs + 2, offset + 1, offset
          )
        }
      }

      let mesh = new Mesh( gl, program, verts, indis );
      mesh.material = mat;
      return mesh;
    }

    static from_heightmap(gl, program, map, min, max, mat, color) {
      const MIN_HEIGHT_COLOR = 0.2;
      let rows = map.length;
      let cols = map[0].length;
      let off_x = (cols / 2.0)-.5;
      let off_z = (rows / 2.0)-.5;
      let verts = [];
      let indis = [];
      let indi_start = 0;

      function push_vert( verts, pos, u, v, norm, color) {
        function calc_color( height ) {
          let normed_height = height / ( max - min );
          return MIN_HEIGHT_COLOR + normed_height * ( 1 - MIN_HEIGHT_COLOR );
        }

        let color_scale = calc_color(pos.y);
        color = color.scaled(color_scale)
        
        verts.push(pos.x,pos.y,pos.z);
        verts.push(color.x,color.y,color.z,1);
        verts.push(u, v)
        verts.push(norm.x,norm.y,norm.z);
      }

      for( let row = 1; row < rows; row++ ) {
        for( let col = 1; col < cols; col++ ) {
          let pos_tl = map[row - 1][col - 1];
          let pos_tr = map[row - 1][col];
          let pos_bl = map[row][col - 1];
          let pos_br = map[row][col];

          let v_tl = new Vec4( -1, pos_tl, -1 );
          let v_tr = new Vec4( 0, pos_tr, -1 );
          let v_bl = new Vec4( -1, pos_bl, 0 );
          let v_br = new Vec4( 0, pos_br, 0 );

          let normal_t1 = Vec4.normal_of_triangle( v_bl, v_tr, v_tl );
          let normal_t2 = Vec4.normal_of_triangle( v_tr, v_bl, v_br );

          v_tl.x += col - off_x;
          v_tl.z += row - off_z;
          v_tr.x += col - off_x;
          v_tr.z += row - off_z;
          v_bl.x += col - off_x;
          v_bl.z += row - off_z;
          v_br.x += col - off_x;
          v_br.z += row - off_z;

          push_vert( verts, v_tl, 0, 1, normal_t1, color );
          push_vert( verts, v_tr, 1, 1, normal_t1, color );
          push_vert( verts, v_bl, 0, 0, normal_t1, color );
          
          push_vert( verts, v_br, 1, 0, normal_t2, color );
          push_vert( verts, v_bl, 0, 0, normal_t2, color );
          push_vert( verts, v_tr, 1, 1, normal_t2, color );
          
          indis.push(
            indi_start,
            indi_start + 1,
            indi_start + 2,
            indi_start + 3,
            indi_start + 4,
            indi_start + 5
          );

          indi_start += 6;
        }
      }

      let mesh = new Mesh( gl, program, verts, indis );
      mesh.material = mat;
      return mesh;
    }

    

    /**
     * Render the mesh. Does NOT preserve array/index buffer or program bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render( gl ) {
        gl.cullFace( gl.BACK );
        gl.enable( gl.CULL_FACE );
        
        gl.useProgram( this.program );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "coordinates", 
            this.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 0 
        );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "color", 
            this.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );
    }

    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    static from_obj_text( gl, program, text, color ) {
        // create verts and indis from the text 
		
      let verts = [];
      let norms = [];
      let indis = [];
      let total_indis = 0;
      let final_verts = [];

      function push_vert( verts_list, pos, u, v, norm, color) {
        verts_list.push(pos.x,pos.y,pos.z);
        verts_list.push(color.x,color.y,color.z,1);
        verts_list.push(u, v);
        verts_list.push(norm.x,norm.y,norm.z);
      }
      
      text = text.replace(/\r/g, '');
      let lines = text.split('\n');
      lines = lines.filter(e => { return e !== ''; });

      for (let i = 0; i < lines.length; i++) {
        let entries = lines[i].split(' ').filter(e => { return e !== ''; });
        //console.log(entries)
        let vals = entries.slice(1);

        /*for (let j = 0; j < vals.length; j++) {
          vals[j] = parseFloat(vals[j]);
        }*/

        if (entries[0] === "v") {
          for (let j = 0; j < vals.length; j++) {
            vals[j] = parseFloat(vals[j]);
          }
          console.log(vals);
          let vert = new Vec4(vals[0], vals[1], vals[2]);
          verts.push(vert);
        } else if (entries[0] === "vn") {
          for (let j = 0; j < vals.length; j++) {
            vals[j] = parseFloat(vals[j]);
          }
          let norm = new Vec4(vals[0], vals[1], vals[2]);
          norms.push(norm);
        } else if (entries[0] === "f") {
          for (let j = 0; j < vals.length; j++) {
            let pair = vals[j].split("//");
            //console.log(pair)
            //console.log(verts[parseInt(pair[0])-1])
            console.log(verts[parseInt(pair[0])-1], norms[parseInt(pair[1])-1])
            push_vert(final_verts, verts[parseInt(pair[0])-1],0,1, norms[parseInt(pair[1])-1], color);
          }
          indis.push(total_indis+2, total_indis+1, total_indis);
          total_indis += 3;
        }
      }

      console.log(verts);

      let test_verts = []
      let test_indis = [0,1,2]
      push_vert(test_verts, new Vec4(0,2,0),0,1, new Vec4(1,0,0), color);
      push_vert(test_verts, new Vec4(0,0,0),0,1, new Vec4(1,0,0), color);
      push_vert(test_verts, new Vec4(0,0,3),0,1, new Vec4(1,0,0), color);
  
      return new Mesh( gl, program, final_verts, indis );
    }

    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name 
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file( gl, program, file_name, f, color, mat) {
        let request = new XMLHttpRequest();
        
        // the function that will be called when the file is being loaded
        request.onreadystatechange = function() {
            // console.log( request.readyState );

            if( request.readyState != 4 ) { return; }
            if( request.status != 200 ) { 
                throw new Error( 'HTTP error when opening .obj file: ', request.statusText ); 
            }

            // now we know the file exists and is ready
			      // load the file 
            let loaded_mesh = Mesh.from_obj_text( gl, program, request.responseText, color );
            loaded_mesh.material = mat;
            console.log( 'loaded ', file_name );
            f( loaded_mesh );
        };

        
        request.open( 'GET', file_name ); // initialize request. 
        request.send();                   // execute request
    }
}

function reduce(value) {
    const min = Math.pow(6.12, -14);
    if (Math.abs(value) < min)
      return 0;
    else
      return value;
  }