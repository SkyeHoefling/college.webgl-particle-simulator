/**	@class
 *	@description Creates a particle
 *	@author Ryan Bucinell
 */
function Plane( p0, p1, p2, p3  ){
	
	/** @field
	 *  @description point on the plane
	 *  @type Vector */
	var _p0 = p0;
	
	/** @field
	 *  @description point on the plane
	 *  @type Vector */
	var _p1 = p1;
	
	/** @field
	 *  @description point on the plane
	 *  @type Vector */
	var _p2 = p2;
	
	/** @field
	 *  @description point on the plane
	 *  @type Vector */
	var _p3 = p3;
		
	var deltaP1 = new Vector( _p1.getX() - _p0.getX(),
							  _p1.getY() - _p0.getY(),
							  _p1.getZ() - _p0.getZ() );
	
	var deltaP2 = new Vector( _p2.getX() - _p0.getX(),
							  _p2.getY() - _p0.getY(),
							  _p2.getZ() - _p0.getZ() );
		
	/** @field
	 *  @description Normal vector to the plane
	 *  @type Vector */
	var _normal = deltaP1.cross( deltaP2 );
		
	/** @description Retuns an array of the four input points
	 *  @type Array */
	this.getPoints = function () { 
		var a_points = new Array();
		a_points.push( _p0 );
		a_points.push( _p1 );
		a_points.push( _p2 );
		a_points.push( _p3 );
		
		return a_points; 
	}
	
	/** @function
	 *  @private
	 *  @description determine if a particle intersects a plane
	 *  @param { Particle } the particle to check with
	 *  @returns {Boolean} true if the particle is colliding with the plane
	 *  @author Ryan Bucinell */
	this.isColliding = function( particle ){
		var dist = _normal.dot( particle.getLocation() );
		if( dist < particle.getRadius() && dist >= 0 ){
			return true;
		}
		return false;
	}
	
	/** @function
	 *  @public
	 *  @description gets the normal of the plane
	 *  @returns {Vector} returns the normal vector
	 *  @author Ryan Bucinell */
	this.getNormal = function( ){
		return _normal;	
	}
		
	this.toString = function () {
		return "p0: " + _p0.toString() + "\nNormal: " + _normal.toString() + "\n";
	}
	
	return true;
}