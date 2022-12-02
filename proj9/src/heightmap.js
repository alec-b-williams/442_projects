class Heightmap {
  static heightmap = [
    [0,0,0,0,0,0],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [0,1,0,0,1,0],
    [0,1,1,1,1,0],
    [0,0,0,0,0,0],
  ]

  static heightmap_small = [
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
  ]

  static heightmap_flat = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ]

  static generate_flat(size, height) {
    let map = [];

    for (let i = 0; i < size; i++) {
      let sub = [];
      for (let j = 0; j < size; j++) {
        sub.push(height);
      }
      map.push(sub);
    }

    return map;
  }

  static diamond_square_map(max_scale, scale, roughness, min, max, c_row, c_col, in_map) {
    let max_size = Math.pow(2, max_scale) + 1;
    let size = Math.pow(2, scale) + 1;
    let map = in_map ?? this.generate_flat(size, 0);
    
    // initialize corners
    // top left
    if (map[c_row-scale][c_col-scale] == 0) {map[c_row-scale][c_col-scale] = rand_max_min(min, max)}; 
    // top right 
    if (map[c_row-scale][c_col+scale] == 0) {map[c_row-scale][c_col+scale] = rand_max_min(min, max)};
    // bottom left 
    if (map[c_row+scale][c_col-scale] == 0) {map[c_row+scale][c_col-scale] = rand_max_min(min, max)};
    // bottom right 
    if (map[c_row+scale][c_col+scale] == 0) {map[c_row+scale][c_col+scale] = rand_max_min(min, max)};

    // (diamond) set midpoint
    map[c_row][c_col] = ( map[c_row-scale][c_col-scale] + // nw
                          map[c_row-scale][c_col+scale] + // ne
                          map[c_row+scale][c_col-scale] + // sw
                          map[c_row+scale][c_col+scale] ) / 4 + (rand_max_min(min, max) * roughness);  // se

    // (square) calc NWES
    // north
    let above_north = (c_row-(scale*2) < 0 ? 0 : map[c_row-(scale*2)][c_col])
    map[c_row-scale][c_col] = ( above_north +                   // n of n
                                map[c_row-scale][c_col-scale] + // w of n
                                map[c_row-scale][c_col+scale] + // e of n 
                                map[c_row][c_col] ) / 4 + (rand_max_min(min, max) * roughness); // s of n
    // west
    let west_west = (c_col-(scale*2) < 0 ? 0 : map[c_row][c_col-(scale*2)])
    map[c_row][c_col-scale] = ( map[c_row-scale][c_col-scale] + // n of w
                                west_west +                     // w of w
                                map[c_row][c_col] +             // e of w 
                                map[c_row+scale][c_col-scale] ) / 4 + (rand_max_min(min, max) * roughness); // s of w
    // east
    let east_east = (c_col+(scale*2) >= max_size ? 0 : map[c_row][c_col+(scale*2)])
    map[c_row][c_col+scale] = ( map[c_row-scale][c_col+scale] + // n of e
                                map[c_row][c_col] +             // w of e
                                east_east +                     // e of e
                                map[c_row+scale][c_col+scale] ) / 4 + (rand_max_min(min, max) * roughness); // s of e
    // south
    let south_south = (c_row+(scale*2) >= max_size ? 0 : map[c_row+(scale*2)][c_col])
    map[c_row+scale][c_col] = ( map[c_row][c_col] +             // n of s
                                map[c_row+scale][c_col-scale] + // w of s
                                map[c_row+scale][c_col+scale] + // e of s
                                south_south ) / 4 + (rand_max_min(min, max) * roughness); // s of s

    // recursive step
    if (scale > 1){
      let less_scale = scale-1;
      Heightmap.diamond_square_map(max_scale, less_scale, roughness, min, max, c_row-(less_scale), c_col-(less_scale), map); // nw square
      Heightmap.diamond_square_map(max_scale, less_scale, roughness, min, max, c_row-(less_scale), c_col+(less_scale), map); // ne square
      Heightmap.diamond_square_map(max_scale, less_scale, roughness, min, max, c_row+(less_scale), c_col-(less_scale), map); // sw square
      Heightmap.diamond_square_map(max_scale, less_scale, roughness, min, max, c_row+(less_scale), c_col+(less_scale), map); // se square
    }
    
    return map;
  }
}

function rand_max_min(min, max) {
  return Math.random() * (max - min) + min;
}