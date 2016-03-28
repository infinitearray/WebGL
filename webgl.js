var canvas,gl,program;

var cubes = {};
var cylinders = {};

function compileShader(gl, shaderSource, shaderType) {
  // Create the shader object
  var shader = gl.createShader(shaderType);

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}
////////////
function createShaderFromScriptTag(gl, scriptId, opt_shaderType) {
// look up the script tag by id.
		var shaderScript = document.getElementById(scriptId);
		if (!shaderScript) {
  		throw("*** Error: unknown script element" + scriptId);
		}

// extract the contents of the script tag.
		var shaderSource = shaderScript.text;

// If we didn't pass in a type, use the 'type' from
// the script tag.
		if (!opt_shaderType) {
  		if (shaderScript.type == "x-shader/x-vertex") {
    			opt_shaderType = gl.VERTEX_SHADER;
  		}
  		else if (shaderScript.type == "x-shader/x-fragment") {
    			opt_shaderType = gl.FRAGMENT_SHADER;
  		}
  		else if (!opt_shaderType) {
    			throw("*** Error: shader type not set");
  		}
		}
		return compileShader(gl, shaderSource, opt_shaderType);
};
/////////////////
function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }

  return program;
};
//////////////////////////
function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId) {
  var vertexShader = createShaderFromScriptTag(gl, vertexShaderId);
  var fragmentShader = createShaderFromScriptTag(gl, fragmentShaderId);
  return createProgram(gl, vertexShader, fragmentShader);
}

function makeXRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ];
};

function makeYRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ];
};

function makeZRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
     c, s, 0, 0,
    -s, c, 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1,
  ];
}

function Initialize()
{
	canvas = document.getElementById("canvas");

	gl = canvas.getContext("experimental-webgl");

	// setup a GLSL program
	program = createProgramFromScripts(gl,"2d-vertex-shader", "2d-fragment-shader");
	gl.useProgram(program);

  var color = [
    254,  240,  195,  1.0,    // white
    254,  240,  195,  1.0,    // white
    254,  240,  195,  1.0,    // white
    254,  240,  195,  1.0,    // white
    254,  240,  195,  1.0,    // white
    254,  240,  195,  1.0    // white
  ];
  var border_col = [
    102,38,13,1.0,
    102,38,13,1.0,
    102,38,13,1.0,
    102,38,13,1.0,
    102,38,13,1.0,
    102,38,13,1.0
  ];
  drawCube('boardbase', {'x':0, 'y':0, 'z':0}, 2, 0.2, 2, color,1);
  //borders
  drawCube('border1', {'x':-0.94, 'y':0, 'z':0}, 0.12, 0.2, 2, border_col,1);
  drawCube('border2', {'x':0.94, 'y':0, 'z':0}, 0.12, 0.2, 2, [102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0],1);
  drawCube('border3', {'x':0, 'y':-0.94, 'z':0}, 2, 0.2, 0.12, [102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0],1);
  drawCube('border4', {'x':0, 'y':0.94, 'z':0}, 2, 0.2, 0.12, [102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0,102,38,13,1.0],1);
  //striking borders
  drawCube('inborder1', {'x':-0.64, 'y':0, 'z':0}, 0.1, 0.2, 1.38, border_col,0);
  drawCube('inborder2', {'x':0.64, 'y':0, 'z':0}, 0.1, 0.2, 1.38, border_col,0);
  drawCube('inborder3', {'x':0, 'y':-0.64, 'z':0}, 1.38, 0.2, 0.1, border_col,0);
  drawCube('inborder4', {'x':0, 'y':0.64, 'z':0}, 1.38, 0.2, 0.1, border_col,0);
  var color2 = [
    0, 0, 0, 1.0
  ];
  var col = [
    200, 0, 0, 1.0
  ];
  //bord_centers
  drawCylinder('c1', {'x':-0.64, 'y':0.64, 'z':0}, 0.045, 0.1, [200,0,0,1], 50,1);
  drawCylinder('c2', {'x':0.64, 'y':0.64, 'z':0}, 0.045, 0.1, [200,0,0,1], 50,1);
  drawCylinder('c3', {'x':0.64, 'y':-0.64, 'z':0}, 0.045, 0.1, [200,0,0,1], 50,1);
  drawCylinder('c4', {'x':-0.64, 'y':-0.64, 'z':0}, 0.045, 0.1,[200,0,0,1], 50,1);
  //center
  drawCylinder('center', {'x':0, 'y':0, 'z':0}, 0.2, 0.1, color2, 12,0);
  //coins
  drawCylinder('redc', {'x':0, 'y':0, 'z':0}, 0.04, 0.1,[200,0,0,1], 50,1);

  //holes
  drawCylinder('corner1', {'x':-0.8, 'y':0.8, 'z':0}, 0.06, 0.1, color2, 50,1);
  drawCylinder('corner2', {'x':0.8, 'y':0.8, 'z':0}, 0.06, 0.1, color2, 50,1);
  drawCylinder('corner3', {'x':0.8, 'y':-0.8, 'z':0}, 0.06, 0.1, color2, 50,1);
  drawCylinder('corner4', {'x':-0.8, 'y':-0.8, 'z':0}, 0.06, 0.1, color2, 50,1);

  setInterval(drawScene, 50);
}

function drawScene(){
  console.log('yo');
}

function drawCube(name, center, length, width, height, colors, variable){
  for (var i = 0; i < colors.length; i++) {
    if (i%4 != 3){
      colors[i] /= 255.0;
    }
  }
  var temp=[];
  for(var i=0;i<6*colors.length;i++)
  {
      temp.push(colors[i%colors.length]);
  }
  colors=temp;
  //Setup the color variable for the shader
  var vertexColor = gl.getAttribLocation(program, "a_color");

  var colorbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(temp), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(vertexColor);
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put a single clipspace rectangle in
  // it (2 triangles)
  //console.log(center.x - width/2, center.y - height/2);
  var vertices = [
    //Front Face
    center.x-(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    center.x+(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    //Back Face
    center.x-(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x-(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x-(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    //Left Face
    center.x-(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    center.x-(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x-(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x-(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    //right Face
    center.x+(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    center.x+(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    center.x+(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    //Top Face
    center.x-(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0),  center.y+(height/2.0),  center.z+(width/2.0),
    //bottom Face
    center.x-(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0), center.y-(height/2.0), center.z-(width/2.0),
    center.x+(length/2.0), center.y-(height/2.0),  center.z+(width/2.0),
    center.x-(length/2.0), center.y-(height/2.0),  center.z+(width/2.0)
  ];
  //rotate in x
  // for(var i=0;i<vertices.length;i++)
  // {
  //   if(i%3==1)
  //   {
  //     vertices[i]=vertices[i]*Math.cos(3.14/6.0)+vertices[i+1]*Math.sin(3.14/6.0);
  //   }
  //   if(i%3==2)
  //   {
  //     vertices[i]=-vertices[i]*Math.sin(3.14/6.0)+vertices[i+1]*Math.cos(3.14/6.0);
  //   }
  // }
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  // draw
  if(variable==1)
    gl.drawArrays(gl.TRIANGLES, 0, 6*6);
  else {
    gl.drawArrays(gl.LINES, 0, 6*6);
  }

  var object = {'colors':colors, 'center':center, 'height':height, 'width':width,'length':length};
  cubes[name] = object;
}

function drawCylinder(name, center, radius, height, color, triangles, variable){

  color[0]/=255.0;
  color[1]/=255.0;
  color[2]/=255.0;

  var colors = [];

  for(var i=0; i<triangles*3*4; i++){
    colors.push(color[0]);
    colors.push(color[1]);
    colors.push(color[2]);
    colors.push(color[3]);
  }

  //Setup the color variable for the shader
  var vertexColor = gl.getAttribLocation(program, "a_color");
  var colorbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(vertexColor);
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put a single clipspace rectangle in
  // it (2 triangles)
  //console.log(center.x - width/2, center.y - height/2);

  var vertices = [];
  var angle=(2*3.1415/triangles);
  var current_angle = 0;

  for(var i=0; i<triangles; i++){
    //lower circle
    vertices.push(center.x);
    vertices.push(center.y);
    vertices.push(center.z-height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle));
    vertices.push(center.y + radius*Math.sin(current_angle));
    vertices.push(center.z-height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle+angle));
    vertices.push(center.y + radius*Math.sin(current_angle+angle));
    vertices.push(center.z-height/2.0);
    //lower circle
    vertices.push(center.x);
    vertices.push(center.y);
    vertices.push(center.z+height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle));
    vertices.push(center.y + radius*Math.sin(current_angle));
    vertices.push(center.z+height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle+angle));
    vertices.push(center.y + radius*Math.sin(current_angle+angle));
    vertices.push(center.z+height/2.0);
    //rectangle=>triangle1
    vertices.push(center.x + radius*Math.cos(current_angle));
    vertices.push(center.y + radius*Math.sin(current_angle));
    vertices.push(center.z-height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle+angle));
    vertices.push(center.y + radius*Math.sin(current_angle+angle));
    vertices.push(center.z-height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle));
    vertices.push(center.y + radius*Math.sin(current_angle));
    vertices.push(center.z+height/2.0);
    //rectangle=>triangle2
    vertices.push(center.x + radius*Math.cos(current_angle));
    vertices.push(center.y + radius*Math.sin(current_angle));
    vertices.push(center.z+height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle+angle));
    vertices.push(center.y + radius*Math.sin(current_angle+angle));
    vertices.push(center.z+height/2.0);
    vertices.push(center.x + radius*Math.cos(current_angle+angle));
    vertices.push(center.y + radius*Math.sin(current_angle+angle));
    vertices.push(center.z-height/2.0);
    current_angle += angle;
  }
  //rotate in x
  // for(var i=0;i<vertices.length;i++)
  // {
  //   if(i%3==1)
  //   {
  //     vertices[i]=vertices[i]*Math.cos(3.14/6.0)+vertices[i+1]*Math.sin(3.14/6.0);
  //   }
  //   if(i%3==2)
  //   {
  //     vertices[i]=-vertices[i]*Math.sin(3.14/6.0)+vertices[i+1]*Math.cos(3.14/6.0);
  //   }
  // }

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  // draw
  if(variable==1)
    gl.drawArrays(gl.TRIANGLES, 0, 4*3*triangles);
  else {
    gl.drawArrays(gl.LINES, 0, 4*3*triangles);
  }

  var object = {'colors':colors, 'center':center, 'radius':radius,'height':height};
  cylinders[name] = object;
}
