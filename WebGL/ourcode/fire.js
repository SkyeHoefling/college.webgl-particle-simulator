/**
 *  @variable
 *  @description the graphics library being used
 */
var gl;
var shaderProgram;
var fireTexture;

var defaultPos   = new Vector( 0.0, 0.0, -7.0 );
var defaultSpeed = new Vector( 0.0, -1.0, 0.0 );
var defaultColor = new Vector( 1.0, 1.0, 1.0 );
var systemNormal = new Vector( 0.0, 1.0, 0.0 );

var system = new ParticleSystem( "GL Test System", "F", defaultPos, systemNormal );


/** @function
	 *  @public
	 *  @description Initializes WebGL to a canvas element
	 *  @param {canvas} the canvas to load webgl into
	 */
function initGL(canvas) {
	try {
		//Let the fun of an experimental technology begin
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

/** @funciton
 *  @public
 *  @description returns the shader Fragment/ Vertext depending on requested type in the passed in id
 *  @param {gl} the instance of the webgl
 *  @param  {string} the element id to specify which element will feed the shader script request
 *  @returns a vertex or fragment shader
 */
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(shader));
	return null;
	}

	return shader;
}

/** @function
 *  @private
 *  @description Initalies the fragment and vertex shaders
 */
function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

/** @function
 *  @private
 *  @description helper method to  load textures in to be used
 */
function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/** @function
 *  @private
 *  @description intializes the textures that have been loaded in. currently 
 *   						 only fire texture is being manipulated
 */
function initTextures() {
    fireTexture = gl.createTexture();
    fireTexture.image = new Image();
    fireTexture.image.onload = function () {
        handleLoadedTexture(fireTexture);
    }
    fireTexture.image.src = "media/particle.bmp";
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

var particleBuffers;

var blueFireBuffers;
var yellowFireBuffers;
var orangeFireBuffers;
var redFireBuffers;

var textureCoordBuffer


  
function initializeBuffer(){
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	return buffer;
}

function applyBuffer(verts, vectorSize, numberOfVerticies){
	var buffer = initializeBuffer();	
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	buffer.itemSize = vectorSize;
	buffer.numItems = numberOfVerticies;
	return buffer;
}
function createFireCoords(){
	var verts = [
		0.1, 0.1, 0.0,
        -0.1, 0.1, 0.0,
        0.1, -0.1, 0.0,
        -0.1, -0.1, 0.0
	];
	return verts;
}
function bufferFire() {
    var verticies = createFireCoords();
    var firePositionBuffer = applyBuffer(verticies, 3, 4);

	var fireTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, fireTextureBuffer);
	var textureCoords = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];
	var colors = [];
	//for (var i = 0; i < 4; i++) {
	    colors = colors.concat([1, 0, 0]);
	    //}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	fireTextureBuffer.itemSize = 2;
	fireTextureBuffer.numItems = 4;

	return [firePositionBuffer, fireTextureBuffer];
}
function loadPrimitiveBuffers(bufferArray) {
	// now lets draw the primitives
    // use the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferArray[0]);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, bufferArray[0].itemSize, gl.FLOAT, false, 0, 0);

    // apply the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferArray[1]);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, bufferArray[1].itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();	// figure out why we need to do this
}
function loadTextureBuffers(bufferArray) {
    // now lets draw the primitives
    // use the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferArray[0]);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, bufferArray[0].itemSize, gl.FLOAT, false, 0, 0);

    // apply the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferArray[1]);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, bufferArray[1].itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms(); // figure out why we need to do this
}
function drawFireSprite() {
    gl.uniform3f(shaderProgram.colorUniform, 1, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fireTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    var fireBuffers = bufferFire();
    loadTextureBuffers(fireBuffers);
    setMatrixUniforms();
    gl.drawArrays(gl.TRAINGLE_STRIP, 0, fireBuffers[0].numItems);
	
}

function bufferParticle(size, color){
	var particleSize = [size, size, size];
	var particlePositionBuffer = applyBuffer(particleSize, 3, 1);
	
	var particleColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, particleColorBuffer);
	var colors = [];
	colors = colors.concat(color);
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	particleColorBuffer.itemSize = 3;
	particleColorBuffer.numItems = 1;
	return [particlePositionBuffer, particleColorBuffer];
}
function drawParticle(color){
	// create a particle
    //var particleBuffers = bufferParticle(1, color);

	loadPrimitiveBuffers(particleBuffers);
	// lets draw the particle
	gl.drawArrays(gl.POINTS, 0, particleBuffers[0].numItems);
}
function drawFire(type) {
    switch (type) {
        /*case 1: // we have a young fire
            loadPrimitiveBuffers(blueFireBuffers);
            gl.drawArrays(gl.POINTS, 0, blueFireBuffers[0].numItems);
            break;*/
        case 1: // we have middle aged fire particle
            loadPrimitiveBuffers(yellowFireBuffers);
            gl.drawArrays(gl.POINTS, 0, yellowFireBuffers[0].numItems);
            break;
        case 2: // he is old and falling apart
            loadPrimitiveBuffers(orangeFireBuffers);
            gl.drawArrays(gl.POINTS, 0, orangeFireBuffers[0].numItems);
            break;
        case 3:
            loadPrimitiveBuffers(redFireBuffers);
            gl.drawArrays(gl.POINTS, 0, redFireBuffers[0].numItems);
            break;
    }
}
function initParticleBuffers(color){
	particleBuffers = bufferParticle(1, color);
	loadPrimitiveBuffers(particleBuffers);
}
function initFireParticleBuffers() {
    blueFireBuffers = bufferParticle(1, [0, 0, 0.5]);
    yellowFireBuffers = bufferParticle(1, [1, 1, 0]);
    orangeFireBuffers = bufferParticle(1, [0.84, 0.3, 0.0]);
    redFireBuffers = bufferParticle(1, [1, 0, 0]);
}

var fireParticles = [];
var zoom = -30;
var innerFireRadius;
var fireCenter;
var outerFireRadius;
// HACK: Entire particle system
function Particle(startPosition, systemType, ptype) {
    this.velocity = [0, Math.random(), 0];
    this.position = startPosition;
    this.color = [1, 0, 0];
    this.lifespan = 25;
    this.ageGroups = Math.floor(this.lifespan / 2);
    this.age = 0;
    this.type = ptype;
    if (this.type == 1) this.lifespan = 15;
    this.systemType = systemType; // 0 == explosion, 1 == fire
    this.alpha = 1;
    if (this.systemType == 0) {
        this.type = 3;
        this.lifespan = 100;
    }
}
Particle.prototype.draw = function () {
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, this.position);
    drawFire(this.type);
};
Particle.prototype.updatePosition = function (dt) {
    for (var i = 0; i < this.position.length; i++) {
        this.position[i] += this.velocity[i] * dt / 1000;
    }
};
Particle.prototype.animate = function (dt) {
    if (this.systemType == 0)
        this.animateExplosion(dt);
    else
        this.animateFire(dt);
}
Particle.prototype.animateFireOld = function (dt) {
    if (this.age > this.type * this.ageGroups)
        this.type++;
    this.updatePosition(dt);
    if (this.type <= 2) {
        if (this.position[0] < fireCenter + 1 && this.position[0] > fireCenter - 1) {
            if (this.velocity[0] > 0)
                this.velocity[0] = -0.25;
            else if (this.velocity[0] < 0)
                this.velocity[0] = 0.25;
        }
    } else if (this.position[0] < fireCenter + 0.5 && this.position[0] > fireCenter - 0.5) {
        if (this.velocity[0] > 0)
            this.velocity[0] = -0.1;
        else if (this.velocity[0] < 0)
            this.velocity[0] = 0.1;
    }
    if (this.position[0] > fireCenter && this.velocity[0] == 0) {
        this.velocity[0] = -1;
    }
    else if (this.position[0] < fireCenter && this.velocity[0] == 0) {
        this.velocity[0] = 1;
    }
};
var fireGravity = .01;
function normalize2D(x, y) {
    var length = Math.sqrt(x * x + y * y);
    var nx = x / length;
    var ny = y / length;
    return [nx, ny];
}
Particle.prototype.animateFire = function (dt) {
    this.updatePosition(dt);
    // apply a random dir
    for (var i = 0; i < this.velocity.length; i++) {
        if (i == 1) {
            this.velocity[i] += Math.random();
            continue;
        }
        this.velocity[i] += Math.random() - 0.5;
    }
    // now lets head towards x,z center
    var cx = fireCenter[0] - this.position[0]
    var cz = fireCenter[2] - this.position[2];
    var centerForce = normalize2D(cx, cz);
    this.velocity[0] += centerForce[0];
    this.velocity[2] += centerForce[1];
    this.velocity[1] += fireGravity;
}
var explosionGravity = .2;
Particle.prototype.animateExplosion = function (dt) {
    this.updatePosition(dt);
    // apply a random dir.
    for (var i = 0; i < this.velocity.length; i++) {
        this.velocity[i] += Math.random() * 2 - 1;
    }
    // apply gravity
    this.velocity[1] += -explosionGravity;
}
Particle.prototype.getOlder = function () { this.age++; };
function addParticlesRandom(count, radius, ptype) {
    var spawnPosition;
    for (var i = 0; i < count; i++) {
        spawnPosition = new Array();
        spawnPosition.push(fireCenter[0] + Math.random() * radius * 2 - radius);
        spawnPosition.push(fireCenter[1]);
        spawnPosition.push(fireCenter[2] + Math.random() * radius * 2 - radius);
        fireParticles.push(new Particle(spawnPosition, 1, ptype));
    }
}
// HACK: um yeah.... this is really bad.
function createInnerFireParticles(x, y, radius, count) {
    //fireParticles = new Array();
    fireCenter = [x,y,zoom];
    innerFireRadius = radius;
    addParticlesRandom(count, innerFireRadius, 1);
}
function createOuterFireParticles(radius, count) {
    outerFireRadius = radius;
    addParticlesRandom(count, outerFireRadius, 2);
}
function createExplosiveParticles(x, y, count) {
    for (var i = 0; i < count; i++) {
        fireParticles.push(new Particle([x,y,zoom],0, 3));
    }
}

function drawFireParticles() {
    for (var i = 0; i < fireParticles.length; i++) {
        fireParticles[i].draw();
    }
}
function animateFireParticles(dt) { 
    for (var i = 0; i < fireParticles.length; i++) {
        // if the particle is too old we die
        if(fireParticles[i].age > fireParticles[i].lifespan){
            fireParticles.splice(i, 1);
            continue;
        }
        fireParticles[i].animate(dt);
        // lets update our age
        fireParticles[i].getOlder();
    }
    addParticlesRandom(50, innerFireRadius, 1);
    addParticlesRandom(140, outerFireRadius, 2);
}
var x = 0.0;
function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	//gl.enable(gl.BLEND);

	mat4.identity(mvMatrix);

	mat4.translate(mvMatrix, [x, 0.0, -10.0]);
	//drawFireSprite();
	drawFireParticles();
	
	//alert("scene has been drawn!");
}

var lastTime = 0;

function animate() {
	var timeNow = new Date().getTime();
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;
		//x += (elapsed * 1) / 1000;
		animateFireParticles(elapsed);
	}
	lastTime = timeNow;
}


function tick() {
	requestAnimFrame(tick);
	drawScene();
	animate();
}


function webGLStart() {
	var canvas = document.getElementById("lesson02-canvas");
	initGL(canvas);
	initShaders();
	//initTextures();
	initFireParticleBuffers();
	createExplosiveParticles(-0.5, -9, 1000);
	createInnerFireParticles(-0.5, -13.5, 1, 100);
	createOuterFireParticles(2, 100);	
	

	gl.clearColor(0, 0, 0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	tick();
}

