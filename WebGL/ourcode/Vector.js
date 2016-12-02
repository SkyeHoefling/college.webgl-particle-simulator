/**
 *	@class
 *	@description Vector data structure
 *  @param {number} x value for the new Vector.
 *  @param {number} y value for the new Vector.
 *  @param {number} z value for the new Vector.
 *	@author Ryan Bucinell
 *  @author Andrew Hoefling
 */
function Vector( x, y , z ){
	var _x = x;
	var _y = y;
	var _z = z;
	
	/** @description Get the X value for the current Vector.
	 *  @field 
	 *  @type number */
	this.getX = function () { return _x; }
	
	/** @description Get the Y value for the current Vector.
	 *  @field 
	 *  @type number */
	this.getY = function () { return _y; }
	
	/** @description Get the Z value for the current Vector.
	 *  @field 
	 *  @type number */
	this.getZ = function () { return _z; }
	
	/** @function
	 *  @description Get the X,Y,Z value's for the current Vector as an Array.	 
	 *  @returns Array Array of this Vector
	 *  @author Andrew Hoefling */
	this.asArray = function (){
		var result = new Array();
		result.push(_x);
		result.push(_y);
		result.push(_z);
		return result;
	}	
	
	/** @function
	 *  @description Gets the distance between this Vector and an input Vector.
	 *  @param {Vector} vec The Vector we are calculating distance on.
	 *  @returns {Number} The distance between the two Vectors.
	 *  @author Andrew Hoefling */
	this.distance = function (vec) {
		var x2 = vec.getX() - _x;
		var y2 = vec.getY() - _y;
		var z2 = vec.getZ() - _z;
		
		x2 = x2 * x2;
		y2 = y2 * y2;
		z2 = z2 * z2;
		
		return Math.sqrt(x2 + y2 + z2);
	}
	
	/** @function
	 *  @description Gets the resulting vector from the cross product of the two
	 *  vectors
	 *  @param {Vector} vec The Vector to cross the current vector with.
	 *  @returns {Vector} The reultant vector
	 *  @author Ryan Bucinell */
	this.cross = function( vec ) {
		var newX = _y * vec.getZ() - _z * vec.getY();
		var newY = _z * vec.getX() - _x * vec.getZ();
		var newZ = _x * vec.getY() - _y * vec.getX();
		
		return new Vector( newX, newY, newZ );
	}
	
	/** @function
	 *  @description Gets the dot product against the give vector
	 *  @param {Vector} the vector to perforrm the dot product on
	 *  @returns {Number} the scalar product
	 *  @author Ryan Bucinell */
	this.dot = function( vec ) {
		return _x * vec.getX() + _y * vec.getY() + _z * vec.getZ();
	}
	
	/** @function
	 *  @description gets the normalized vector
	 *  @returns {Vector} the normalized vector
	 *  @author Ryan Bucinell */
	this.getNormalized = function() {
		var magnitude = Math.sqrt( Math.pow( _x , 2 ) + Math.pow( _y , 2 ) + Math.pow( _z , 2 )  );
		return new Vector( _x / magnitude, 
						   _y / magnitude, 
						   _z / magnitude );			
	}

	this.toString = function () {
		return "\nx: " + _x + "\ny: " + _y + "\nz: " + _z;
	}
	
	return true;
}