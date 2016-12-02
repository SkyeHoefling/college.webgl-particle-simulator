/**
 *	@class
 *	@description maintains a list of planes for particles to bound against
 *	@author Ryan Bucinell
 */
function CollisionController( a_planes ){
	
	/** @field
	 *  @description a list of planes passed in to check against
	 *  @type Array */
	var _a_planes = a_planes;
	
	/** @function
	 *  @public
	 *  @description iterates through all stored planes, determining if a particle collides
	 *  with any of the planes
	 *  @param {Particle} the particle to test against
	 *  @return {Vector} normalized normal of the plane we collide against if no collision, 
	 *  return null
	 *  @author Ryan Bucinell
	 */
	this.getCollision = function ( p ){
		//Iterate each plane
		for( var i = 0; i < _a_planes.length ; i++ ){
			//check if it is colliding with a plane
			if( _a_planes[ i ].isColliding( p ) ) {
				//if it collides get a normalized vector back so we know the direction to
				//rebound the particle with
				return _a_planes[i].getNormal().getNormalized();		
			}
		}
		//No collisions, return 0's
		return null;
	}
	
	
	//End collision controller
	return true;
}
