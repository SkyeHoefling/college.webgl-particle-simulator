/** @class
 *  @description Enum to handle the different keys on the keyboard.
 *  @author Andrew Hoefling */
var KeyboardLayout = {
	/** @field
	 *  @description Keys refers to all the alphabet keys on
	 *				 on the keyboard.
	 *  @example KeyboardLayout.Keys.A.value
	 *  @type number */
	Keys : { A : { value: 65 }, B : { value: 66 },
			 C : { value: 67 }, D : { value: 68 },
			 E : { value: 69 }, F : { value: 70 },
			 G : { value: 71 }, H : { value: 72 },
			 I : { value: 73 }, J : { value: 74 },
			 K : { value: 75 }, L : { value: 76 },
			 M : { value: 77 }, N : { value: 78 },
			 O : { value: 79 }, P : { value: 80 },
			 Q : { value: 81 }, R : { value: 82 },
			 S : { value: 83 }, T : { value: 84 },
			 U : { value: 85 }, V : { value: 86 },
			 W : { value: 87 }, X : { value: 88 },
			 Y : { value: 89 }, Z : { value: 90 }
			},
	/** @field
	 *  @description Numbers refer to the keys at the top of the keyboard from 1 through 0.
	 *  @example KeyboardLayout.Numbers.Zero.value
	 *  @type number */
	Numbers : { Zero : { value: 48 }, One  : { value: 49 },
			    Two  : { value: 50 }, Three: { value: 51 },
			    Four : { value: 52 }, Five : { value: 53 },
			    Six  : { value: 54 }, Seven: { value: 55 },
			    Eight: { value: 56 }, Nine : { value: 57 }
			  }
};

/** @class
 *  @description The keyboard controller handles all of the keyboard input
 * 				 and runs particlar functions when the event is triggered.
 *	@params {c3dl.Scene} scene The current scene we want to have the keyboard events in.
 *  @author Andrew Hoefling
 */
function KeyboardController (){ 
	// initialize values
	// attributes for key released (key up)
	var _currentKeyReleased = -1;
	var _lastKeyReleased = -1;
	var _isKeyJustReleased = false;
	
	// attributes for key down
	var _currentKeyDown = -1;
	var _lastKeyDown = -1;
	var _isKeyDown = false;
	
	/** @function
	 *  @description Gets the currentKeyReleased value which represents the current key just pressed
	 *  @returns {number} */
	this.getCurrentKeyReleased = function (){ return _currentKeyReleased; };
	
	/** @function
	 *  @event
	 *  @description Gets the lastKeyReleased value which represents the last key pressed
	 *  @returns {number} */
	this.getLastKeyReleased = function (){ return _lastKeyReleased; };
	
	/** @function
	 *  @description Returns true if a key has been pressed in this update cycle
	 *  @returns {boolean} */
	this.isKeyJustReleased = function (){ return _isKeyJustReleased; };
	
	/** @function
	 *  @description Gets the currentKeyDown value which represents the current key that is being pressed
	 *  @returns {number} */
	this.getCurrentKeyDown = function (){ return _currentKeyDown; };
	
	/** @function
	 *  @event
	 *  @description Gets the lastKeyDown value which represents the last key that was pressed
	 *  @returns {number} */
	this.getLastKeyDown = function (){ return _lastKeyDown; };
	
	/** @function
	 *  @description Returns true if a key is currently being pressed and is still down.
	 *  @returns {boolean} */
	this.isKeyDown = function (){ return _isKeyDown; };
	
	/** @function
	 *  @description Called everytime there is a keyboard event.  When
	 *				 there is a keyboard event this handles certain key
	 *				 strokes and calls other functions.
	 *	@params {KeyboardEvent}
	 */
	this.keyUp = function(event) {
		_lastKeyReleased = _currentKeyReleased;
		_currentKeyReleased = event.keyCode;
		_isKeyJustReleased = true;
	};
	this.keyDown = function(event) {
		_lastKeyDown = _currentKeyDown;
		_currentKeyDown = event.keyCode;
		_isKeyDown = true;
	};
	
	/** @function
	 *  @description Update method that is called every frame.  Used primarily to
	 *				 reset the isKeyJustPressed {boolean} and isKeyDown {boolean}
	 *  @params {number} change in time from the last frame. */
	this.update = function(dt) {
		// reset key just pressed
		_isKeyJustReleased = false;
		_isKeyDown = false;
	};
}

