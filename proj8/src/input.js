class Keys {
  constructor() {
    this.keys_down  = {};
  }

  static start_listening() {
    let keys = new Keys();
    addEventListener( 'keydown', function( ev ) {
      if( typeof ev.code === 'string' ) {
        keys.keys_down[ ev.code ] = true;
      }
    })
    
    addEventListener( 'keyup', function( ev ) {
    	if( typeof ev.code === 'string' ) {
        keys.keys_down[ ev.code ] = false;
      }	
    })
    
    return keys;
  }

  is_key_down( code ) { 
  	return !!this.keys_down[ code ];
  }
  
  is_key_up( code ) {
    return !this.keys_down[ code ];
  }

  keys_down_list() {

    let ret  = [];
    for( const [ key, value ] of Object.entries( this.keys_down ) ) {
     	if( value ) { ret.push( key ); }
    }
    return ret;

    return Object.entries(this.keys_down)
                 .filter( kv => kv[1] /* the value */ )		
                 .map( kv = kv[0] /* the key */ );
  }

}