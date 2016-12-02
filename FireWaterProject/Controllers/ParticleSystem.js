/**
 *	@class
 *	@description Creates and maintains a system of particles
 *	@author Ryan Bucinell
 */
function ParticleSystem( name, typeOfsystem, position, normal ) {
	//System
	var _name = name;
	var _pos = position;
	var _normal = normal;
	var _element = "";
	
	if( typeOfsystem == "F" || typeOfsystem == "fire" ){
		_element = "fire";
	} else if( typeOfsystem == "W" || typeOfsystem == "water" ){
		_element = "water";
	} else {
		_element = "smoke";
	}

	var _nearby_dist = 200;
	var _a_particles = new Array();
	var _particleCount = 0;
	var _isInProduction = false;
	var _rate = 0;
	
	/** @function
	 *  @public
	 *  @description updates all the points
	 *  @param {Particle} particle the particle you want to base your search on
	 *  @returns {Array} a list of nearby neighboring points
	 *  @author Ryan Bucinell
	 */
	this.update = function ( ) {
		for( var i = 0; i < _a_particles.length; i++ ){
			var p = _a_particles[ i ];
			var a_neighbors = this.getNeighbors( p );
			//TODO
			//p.updatePhysicsBasedOn( a_neighbors );
			p.update();
		}
	}
	
	/** @function
	 *  @private
	 *  @description gets all the neighboring particles from a given point
	 *  @param {Particle} particle the particle you want to base your search on
	 *  @returns {Array} a list of nearby neighboring points
	 *  @author Ryan Bucinell
	 */
	this.getNeighbors = function ( particle ){
		var	a_temp = new Array();
		
		for( var j = 0; j < _a_particles.length; j++ ){
			var tempParticle = _a_particles[ j ];
			if( this.pointsLessThanDistApart( particle, tempParticle , nearby_dist ) && particle != tempParticle )
			{
				a_temp.push( tempParticle );
			}	
		}
		return a_temp;
	}
	
	/** @function
	 *  @private
	 *  @description determines if the distance between two points is close enough to be considered neighbors
	 *  @param {Particle} p1 the first particle
	 *  @param {Particle} p2 the second particle
	 *  @param {int} dist the maximum distance that a particle will be consider neighbor
	 *  @returns {Boolean} true if the distance is less than dist param
	 *  @author Ryan Bucinell
	 */
	this.pointsLessThanDistApart = function( p1, p2, dist ) {
		var distBetweenPts = Math.sqrt( Math.pow( p2.getLocation().getX() - p1.getLocation().getX(), 2 ) +
										Math.pow( p2.getLocation().getY() - p1.getLocation().getY(), 2 ) +
										Math.pow( p2.getLocation().getY() - p1.getLocation().getZ(), 2 ) );
		if( distBetweenPts < dist ){
			return true;
		}else{
			return false;
		}
	}
	
	/** @function
	 *  @public
	 *  @description returns the name of the system
	 *  @returns {string} name of the system
	 *  @author Ryan Bucinell
	 */
	this.getName = function( ){
		return _name;	
	}
	
	/** @function
	 *  @public
	 *  @description returns all particles its controlling
	 *  @returns {Array} list of particles controlled by the system
	 *  @author Ryan Bucinell
	 */
	this.getParticles = function() {
		return _a_particles;
	}
	
	/** @function
	 *  @public
	 *  @description starts the generator and produces more particles
	 *  @param {int} rate time between the genration of particles
	 *  @author Ryan Bucinell
	 */
	this.startGenerator = function( rate ) {
		_rate = rate;
		_isInProduction = true;
		this.generateParticles();
	}
	
	/** @function
	 *  @public
	 *  @description stops the generator from producing new particles
	 *  @author Ryan Bucinell
	 */
	this.stopGenerator = function( ){
		_isInProduction = false;	
	}
	
	/** @function
	 *  @private
	 *  @description timeout loop based generation function. creates a particle then sits and waits for timeout peroid.
	 *  @param {int} genSpeed the rate at which particles are created
	 *  @author Ryan Bucinell
	 */
	this.generateParticles = function( ){
		if( _isInProduction ){
			this.createParticle();
			this.generateParticles();
			//TODO fix the below line and remove the above line
			//setTimeout( "this.generateParticles();" , _rate ); 	
			
		}
	}
	
	/** @function
	 *  @private
	 *  @description Creates a particle (TODO: check the type and create proper non generic particle)
	 *  @author Ryan Bucinell
	 */
	this.createParticle = function ( ){
		var particle = new Particle( _pos, _normal , new Vector( 1.0, 1.0, 1.0 ) );
		_particleCount = _particleCount + 1;
		particle.setVelocity( _normal  );
		_a_particles.push( particle );	
	}
	
	
	return true;
}