var gl;

var defaultPos   = new Vector( 0.0, 0.0, -7.0 );
var defaultSpeed = new Vector( 0.0, -1.0, 0.0 );
var defaultColor = new Vector( 1.0, 1.0, 1.0 );
var systemNormal = new Vector( 0.0, 1.0, 0.0 );

var system = new ParticleSystem( "GL Test System", "F", defaultPos, systemNormal );

function startGen( time ){
	system.startGenerator( 1000 );	
}

function stopGen( ){
	system.stopGenerator();	
}

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}


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


var shaderProgram;

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


var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


  
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
function createPlaneCoords(){
	var verts = [ 
		0.1,	0.1,	0.0,
		-0.1,	0.1,	0.0,
		0.1,	-0.1,	0.0,
		-0.1,	-0.1,	0.0
	];
	return verts;
}
function bufferPlane(){
	var verticies = createPlaneCoords();
	var planePositionBuffer = applyBuffer(verticies, 3, 4);	

	var planeColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, planeColorBuffer);
	var colors = []
	for (var i=0; i < 4; i++) {
		colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	planeColorBuffer.itemSize = 4;
	planeColorBuffer.numItems = 4;
	
	return [planePositionBuffer, planeColorBuffer];
}
function loadPrimitiveBuffers(bufferArray){
	// now lets draw the primitives
	// use the position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferArray[0]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, bufferArray[0].itemSize, gl.FLOAT, false, 0, 0);
	
	// apply the color buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferArray[1]);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, bufferArray[1].itemSize, gl.FLOAT, false, 0, 0);
	
	setMatrixUniforms();	// figure out why we need to do this
}
function drawPlane(){
	// first lets get our buffers
	var planeBuffers = bufferPlane();
	loadPrimitiveBuffers(planeBuffers);
	// lets draw the plane!!
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, planeBuffers[0].numItems);
	
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
	var particleBuffers = bufferParticle(1, color);
	loadPrimitiveBuffers(particleBuffers);
	// lets draw the particle
	gl.drawArrays(gl.POINTS, 0, particleBuffers[0].numItems);
}

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	mat4.identity(mvMatrix);

	mat4.translate(mvMatrix, [0.0, 0.0, -7.0]);	
	drawPlane();
	
	mat4.translate(mvMatrix, [-1.5, 0.0, 0.0]);
	drawParticle([1,0,0]);
	
	mat4.translate(mvMatrix, [0.5, 0.0, 0.0]);
	drawParticle([0,1,0]);
	
	/*
	// lets create a metric fuck ton of particles
	for(var i = 0; i < 100; i ++){
		mat4.translate(mvMatrix, [0.1, 0.0, 0.0]);
		drawParticle([0,0,1]);
	}*/
	
	system.getParticles().push( new Particle( defaultPos, defaultSpeed, defaultColor ) );
	system.getParticles().push( new Particle( new Vector( 1.0, 1.0, 0.0 ), defaultSpeed, defaultColor ) );
	for( var i = 0; i < 100; i++){
			system.getParticles().push( new Particle( new Vector( (i/100), (i/100), 0.0 ), defaultSpeed, defaultColor ) );
	}
	system.getParticles().push( new Particle( new Vector( .5, .5, 0.0 ), defaultSpeed, defaultColor ) );
	//for each particle
	for( var i = 0; i < system.getParticles().length; i++ ){
		var curP = system.getParticles()[i];
		
		//	translate to new position
		mat4.translate(mvMatrix, [curP.getLocation().getX(), curP.getLocation().getY(), curP.getLocation().getZ()]);
		
		//  draw particle
		drawParticle([curP.getColor().getX(), curP.getColor().getY(), curP.getColor().getZ() ]);
		
		//  undow translate to reset for next particle
		mat4.translate(mvMatrix, [ - curP.getLocation().getX(), -curP.getLocation().getY(), -curP.getLocation().getZ()]);
		
	}
	// for each particle
	//	load id
	//	translate to new position
	// 	draw particle (color)
	
	alert("scene has been drawn!");
}



function webGLStart() {
	var canvas = document.getElementById("lesson02-canvas");
	initGL(canvas);
	initShaders();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	    
	drawScene();
}

