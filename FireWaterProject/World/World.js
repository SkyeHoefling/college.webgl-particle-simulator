/** @class
 *  @description Holds information about the location, and Collada model, and
 *				 is used to represent the entire game world.
 *	@param {String} sceneModel The relative location of the scene model
 *  @author Andrew Hoefling
 */
function World(sceneModel) {
    /* contructor */
    if (debug) alert("World constructor");
    if (debug) alert("scene model: " + sceneModel);
    
	var _sceneModelLocation = sceneModel;
	var _model = new c3dl.Collada();
	
	/** @description The relative location of the scene model
	 *  @type String
	 */
	this.getSceneModelLocation = function () { return _sceneModelLocation; }
	
	/** @description The Collada model object for the world.
	 *	@type c3dl.Collada
	 */
	this.getModel = function() { return _model; }
	
	/** @function
	 *  @public
	 *  @description Initializes the model via model location
	 *  @author Andrew Hoefling
	 */
    this.initialize = function () {
        if(debug) alert("World.initialize() function");
        _model = new c3dl.Collada();
        _model.init(_sceneModelLocation);
    };
}