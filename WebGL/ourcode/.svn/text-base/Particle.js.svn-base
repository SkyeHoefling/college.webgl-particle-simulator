/**
 *	@class
 *	@description Creates a particle
 *	@author Ryan Bucinell
 *  @author Andrew Hoefling
 */
function Particle( location, speed, color ){	

	/** @field 
	 *  @description Vector that holds the current (X,Y,Z) position of the particle
	 *  @type Vector */	
	var _location = location;

	/** @field 
	 *  @description Vector that holds the current velocity of the particle in x, y, z compenents
	 *  @type Vector */
	var _velocity = speed;
	
	/** @field
	 *  @description Vector that holds the RGB value for the color
	 *  @type Vector */
	var _color = color;
		
	var _radius = 1.1;
	
	/** @description Vector that holds the current (X,Y,Z) position of the particle
	 *  @type Vector */
	this.getLocation = function () { return _location; }
	
	/** @description Vector that holds the current velocity of the particle in x, y, z components
	 *  @type Vector */
	this.getVelocity = function () { return _velocity; }
	
	/** @description sets the velocity of the particle
	 *  @param {Vector} the new linear Velocity */
	this.setVelocity = function( vel ) { _velocity = vel; }
	
	/** @description Vector that holds the RGB value for the color
	 *  @type Vector */
	this.getColor = function () { return _color; }
	//this.getModel = function () { return _model; }
	
	/** @description the radius length of the particle
	 * @type Number */
	this.getRadius = function() { return _radius; }
	
	
	this.updateLocation = function ( locVector ){
		//alert("updating location!!");
		//alert("locVector: " + locVector.toString());
		_location = new Vector(locVector.getX(), locVector.getY(), locVector.getZ());
		//_model.translate(new Array(locVector.getX(), locVector.getY(), locVector.getZ()));
	}
	
	/** @description Update Method that is called on every object
	 *  @param {number} updateTime change in time since the last update. */
	this.update = function( updateTime ){
		//ball.setLinearVel( new Array( _velocity._x, _velocity._y, _velocity._z ) );
	}
	
	this.toString = function () {
		return "location:" + _location.toString() + "\nVelocity:" + _velocity.toString() + "\nColor: " + _color.toString() + "\n";
	}
	
	return true;
};