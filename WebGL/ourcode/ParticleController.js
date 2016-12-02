/**
 *	@class
 *	@description Creates a particle controller
 *	@author Ryan Bucinell
 */
function ParticleController() {

	/** @field 
	 *  @description TODO: add description here
	 *  @type Array */
	var _a_systems= new Array();
	//_a_systems.push(  new ParticleSystem( "Water" ) );
	
	/** @function
	 *  @public
	 *  @description adds a new system to the controller
	 *  @param {string} name the unique name for the system to be called
	 *  @param {string} type of particles you want to generator valid strings are: Fire, Smoke, Water
	 *  @author Ryan Bucinell
	 */
	this.createSystem = function ( name, systemType, position, normal ){
			_a_systems.push( new ParticleSystem( name, systemType, position, normal ) );
	}
	
	/** @function
	 *  @public
	 *  @description tells a particular generator to start generating particles every
	 *  @param {string} systemName name of the particle system you wish to control.
	 *  @param {float} timeout number in seconds
	 *  @author Ryan Bucinell
	 */
	this.startSystem = function( systemName, timeout ){
		//Todo, remove timeout = 500;
		
		timeout = 500;
		var sys;
		
		for( var i = 0; i < _a_systems.length; i++ ){
			if( _a_systems[ i ].getName() == systemName ){
				sys  = _a_systems[ i ];
				break;	
			}
		}
		if( sys != null ){
			alert( "Found System");
			sys.startGenerator( timeout );	
		}else{
			alert( "Couldn't find Particle System by the name of: " + systemName );	
		}
	}
	
	/** @function
	 *  @public
	 *  @description tells a particular generator to stop creating particles
	 *  @param {string} systemName name of the particle system you wish to control.
	 *  @author Ryan Bucinell
	 */
	this.stopSystem = function ( systemName ){
		var sys;
		for( var i = 0; i < _a_systems.length; i++ ){
			if( _a_systems[ i ].getName() = systemName ){
				sys = _a_systems[ i ];
				break;	
			}
		}
		if( sys != null ){
			sys.stopGenerator();	
		}else{
			alert( "Couldn't find Particle System by the name of: " + systemName );	
		}
	}
	
	//update method that is called on every object
	/** @function
	 *  @public
	 *  @description update method that is called on every object
	 *  @param {float} updateTime the change in time since the last update
	 *  @author Ryan Bucinell
	 */
	this.update = function( updateTime ){
		for( var i = 0 ; i < _generators.length; i++ )
		{
			_a_generators[ i ].update( updateTime );	
		}
	}
	
	//End particle controller
	return true;
}