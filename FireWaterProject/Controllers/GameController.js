var debug = false;
/**
 *	@class
 *	@description Creates the GameController, this is our base class.  Creates local variables, and initializes the main callback function
 *	@param {String} canvasName Refers to the canvas that we want to draw in
 *	@param {String} worldLocation Refers to the relative location of the world ".dae" file
 *	@author Andrew Hoefling
 */
function GameController(canvasName, worldLocation) {
    if(debug) alert("GameController(canvasName)");	
    /* Contructor Code */
	/** @field 
	 *  @description Collada(model) object that holds the world ".dae" file and texture information
	 *  @type c3dl.Collada */
    var _world;
	
	/** @field
	 *  @description WorldController object that handles everything in the world that isn't handled
	 *				 by the c3dl.Scene
	 *  @type WorldController*/
	 var _worldManager = new WorldController();
	 
	/** @field
	 *  @description KeyboardController object that handles keyboard events, and calls corresponding functions.
	 *  @type KeyboardController */
	var _keyboardManager;
	
	/** @field 
	 *  @description A free camera that controls what we can see in the canvas 3d element
	 *  @type c3dl.FreeCamera */
    var _camera;
	
	/** @field 
	 *  @description Scene object that uses the renderer, and stores all of our objects in the scene
	 *  @type c3dl.Scene */
    var _scene;
	
	/** @field 
	 *  @description The canvas id name that we want to draw everything in
	 *  @type String */
    var _canvasName = canvasName;
	
	/** @field 
	 *  @description The relative file location of our world ".dae" file
	 *  @type String */
    var _worldLocation = worldLocation;
	
	/** @field 
	 *  @description The current time since we started running the program
	 *  @type number */
    var _currentTime = 0;
	
	/** @field 
	 *  @description The time recorded since the last update cycle
	 *  @type number */
    var _lastTime = 0;
	
	/** @field
	 *  @description The delta time, or change in time since the last update.  
	 *				 This is created here so we don't delete/recreate the var
	 *				 every update cycle.
	 *  @type number */
	var _dt;

    // set the main callback function call, and the canvas 
    // we want to pass into
    c3dl.addMainCallBack(this.canvasMain, _canvasName);

    /** 
	 *  @function
	 *  @private
	 *  @description Create the main game loop 
     *  @param {number} time The change in time since the last update
	 *  @author Andrew Hoefling
     */
    this.update = function (time) {
        // calculate the delta(change in) time -> dt
        _currentTime = time;
        _dt = (_currentTime - _lastTime) / 1000;
        _lastTime = _currentTime;

		// check keyboard input here
		if(_keyboardManager.isKeyDown()){
			switch(_keyboardManager.getCurrentKeyDown()) {
				case KeyboardLayout.Keys.A.value:
					var cPosition = _camera.getPosition();
					cPosition[0] -= 25;
					_camera.setPosition(cPosition);
					break;
				case KeyboardLayout.Keys.D.value:
					var cPosition = _camera.getPosition();
					cPosition[0] += 25;
					_camera.setPosition(cPosition);
					break;
				case KeyboardLayout.Keys.S.value:
					var cPosition = _camera.getPosition();
					cPosition[2] += 25;
					_camera.setPosition(cPosition);
					break;
				case KeyboardLayout.Keys.W.value:
					var cPosition = _camera.getPosition();
					cPosition[2] -= 25;
					_camera.setPosition(cPosition);
					break;
				case KeyboardLayout.Keys.Z.value:
					_camera.rotateOnAxis([0,1,0], 0.01);
					break;
				case KeyboardLayout.Keys.X.value:
					_camera.rotateOnAxis([0,1,0], -0.01);
					break;				
			}
		}
		
        // TODO: call update functions here
		_worldManager.update(_dt);
		_keyboardManager.update(_dt);
    };

	/** @function
	 *  @private
	 *  @description Init the game update loop
	 *  @author Andrew Hoefling
	 */
    this.startUpdateLoop = function () {
        if (debug) alert("starting the update loop");
        _scene.setUpdateCallback(this.update);
    };
	
	/** @function
	 *  @private
	 *  @description Initialize all the event listeners, and their corresponding objects.
	 *  @author Andrew Hoefling 
	 */
	this.initializeEventListeners = function (){
		if(debug) alert("creating keyboard events");
		_keyboardManager = new KeyboardController();
		_scene.setKeyboardCallback(_keyboardManager.keyUp, _keyboardManager.keyDown);
	};
	this.test = function(event){
		alert("test: " + event.keyCode);
	}
	/** @function
	 *  @private
	 *  @description Initializes the scene object, and applys a renderer to the scene.	 
	 *  @param {c3dl.Renderer} renderer A renderer object that holds shader information (I assume).	 
	 *  @returns {c3dl.Scene} A new scene object that is created as a result of the canvas and the renderer.
	 *  @author Andrew Hoefling
	 */
    this.createScene = function (renderer) {
        // create and init scene
        var scn = new c3dl.Scene();
        scn.setCanvasTag(_canvasName);

        // set the renderer
        scn.setRenderer(renderer);
        scn.init(_canvasName);

        return scn;
    };

	/** @function
	 *  @private
	 *  @description Adds an array of objects to our scene
	 *  @param {Array} a_objects An array of Collada objects
	 *  @author Andrew Hoefling
	 */
    this.addObjectsToScene = function (a_objects) {
        for (var i = 0; i < a_objects.length; i++) {
            _scene.addObjectToScene(a_objects[i]);
			alert("position: " + "\nx: " + a_objects[i].getPosition()[0] +
								 "\ny: " + a_objects[i].getPosition()[1] +
								 "\nz: " + a_objects[i].getPosition()[2]);
        }
    };

    /* Create the camera */
	/** @function
	 *  @private
	 *  @description Creats our basic free camera provided by the c3dl framework, and places it at an optimal location
	 *				 looking at the center of the world coordinates (origin)
	 *  @author Andrew Hoefling
	 */
    this.createCamera = function () {
        // create a camera
        var camera = new c3dl.FreeCamera();

        // Place the camera.
        // WebGL uses a right handed co-ordinate system.
        // move 1000 to the right
        // move 1800 up
        // move 8000 units out
        camera.setPosition(new Array(1000, 1800, 8000));

        // Point the camera.
        // Here it is pointed at the same location as
        // the world, so the world will appear centered
        camera.setLookAtPoint(new Array(0.0, 0.0, 0.0));
        camera.setFarClippingPlane(100000);
        return camera;
    };

	/** @function
	 *  @private
	 *  @description This is where all the initialization magic starts.  Creates the renderer, scene, camera, and objects.
	 * 				 Will then connect them as needed and starts the scene, after that update loop will begin
	 *  @author Andrew Hoefling
	 */
    this.canvasMain = function () {
        // create the scene, and pass in a basic renderer
        if (debug) alert("Creating the scene, and renderer");
        var renderer = new c3dl.WebGL();
        renderer.createRenderer(this);
        _scene = this.createScene(renderer);

        //the isReady() function tests whether or not a renderer
        //is attached to a scene.  If the renderer failed to
        //initialize this will return false but only after you
        //try to attach it to a scene.
        if (renderer.isReady()) {
            if (debug) alert("The renderer is ready, loading world . . .");
			
            // lets create the world and init it
			alert(_worldLocation);
            _world = new World(_worldLocation);			
            _world.initialize();

            if (debug) alert("World has been loaded, adding the objects to the scene");
            // lets add the object to the scn
            var a_objects = new Array();
			var pos = new Vector(0,0,1000);
			var color = new Vector(1,1,1);
			alert("position: " + pos.toString() + "\ncolor: " + color.toString());
			var particle = new Particle(pos, 0, color);		
            a_objects.push(_world.getModel());
			a_objects.push(particle.getModel());			
            this.addObjectsToScene(a_objects);

            if (debug) alert("creating a camera");
            // create a camera
            _camera = this.createCamera();

            // add the camera to the scene
            _scene.setCamera(_camera);

            if (debug) alert("starting the scene");

			// okay everything is created lets add some events listeners
			this.initializeEventListeners();
			
            // start the scene
            _scene.startScene();			

            // start update loop
            this.startUpdateLoop();
        }
    };
}