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

    static box( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,   1,1,
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,   0,1,
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,   0,0,
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,   1,0,

            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,   0,0,
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,   1,0,
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,   1,1,
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,   0,1,
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

        return new Mesh( gl, program, verts, indis );
    }

    static texturedBox( gl, program, width, height, depth ) {
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

      return new Mesh( gl, program, verts, indis );
    }

    static uv_sphere(gl, program, subdivs, material) {
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

        return new Mesh( gl, program, verts, indis );
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
    static from_obj_text( gl, program, text ) {
        // create verts and indis from the text 
		
        let verts = []
        let indis = []
        
        text = text.replace(/\r/g, '');
        let lines = text.split('\n');
        lines = lines.filter(e => { return e !== ''; });
        //console.log(lines)

        for (let i = 0; i < lines.length; i++) {
          let entries = lines[i].split(' ').filter(e => { return e !== ''; });
          //console.log(entries)
          let vals = entries.slice(1);

          for (let j = 0; j < vals.length; j++) {
            vals[j] = parseFloat(vals[j]);
          }

          if (entries[0] === "v") {
            let colors = [Math.random(), Math.random(), Math.random(), 1];
            verts = verts.concat(vals);
            verts = verts.concat(colors);
          } else {
            vals = vals.map(n => {return n - 1}).reverse();
            indis = indis.concat(vals);
          }
        }

        console.log(verts)
        console.log(indis)
		
        return new Mesh( gl, program, verts, indis );
    }

    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name 
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file( gl, file_name, program, f ) {
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
            let loaded_mesh = Mesh.from_obj_text( gl, program, request.responseText );

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