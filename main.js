var cubeRotation = 0.0;
var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40 };
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var c = [];
var c1 = [];
var c2 = [];
var Lf = [];
var coins = [];
var cflag = [];
var botflag = [];
var wall = [];
var ob1 = [];
var ob2 = [];
var programInfo3;
var ontrain = 0;
var trn = [];
var jetpack = [];
var jflag = [];
var lflag = [];
var onjet = 0;
var bs = [];
var bcurr=0;
var grey=0;
var jcurr=0;
var tme = 20;
var pol = 0;
var jh = 15;
var immune =0;
var pvl = 20;
var speed= 0.1;
var eyex=0,eyey=5,eyez=0;
var len=30;
var pr = 0;
var ac=len;
var bc=15;
var vz = -0.1;
var pl ;
var off;
var dog;
var vy=0.1;
var cpl = 500;
var gr=-0.01;
var uflag=0;
var score =0;
var nco = 0;
main();
//
// Start here
//


function main() {


  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  pl = new player(gl,0,[0,5.5,-10],'pl.jpg');
  off = new player(gl,0,[0,5.5,-8],'po.jpg');
  dog = new player(gl,1,[1,5.5,-8],'dog.jpeg');
  for(var i=0;i<len;i++)
  {
    c.push( new cube(gl, [0, 4.0, -3.0-4*i], 'track.jpg') );
  	c1.push( new cube(gl, [-4, 4.0, -3.0-4*i], 'track.jpg') );
    c2.push( new cube(gl, [4, 4.0, -3.0-4*i], 'track.jpg') );
  }
  for(var i=0;i<5;i++)
  {
    jetpack.push(new jet(gl,[0,5.5,-1000*Math.random()],'jp.png'));
    jetpack.push(new jet(gl,[-4,5.5,-1000*Math.random()],'jp.png'));
    jetpack.push(new jet(gl,[4,5.5,-1000*Math.random()],'jp.png'));
    jflag.push(0);
    jflag.push(0);
    jflag.push(0);
  }
  for(var i=0;i<10;i++)
  {
    Lf.push(new life(gl,[0,5.5,-1000*Math.random()],'life.jpg'));
    Lf.push(new life(gl,[-4,5.5,-1000*Math.random()],'life.jpg'));
    Lf.push(new life(gl,[4,5.5,-1000*Math.random()],'life.jpg'));
    lflag.push(0);
    lflag.push(0);
    lflag.push(0);
  }
  for(var i=0;i<10;i++)
  {
    bs.push(new boot(gl,[0,5.5,-1000*Math.random()],'bot.png'));
    bs.push(new boot(gl,[-4,5.5,-1000*Math.random()],'bot.png'));
    bs.push(new boot(gl,[4,5.5,-1000*Math.random()],'bot.png'));
    botflag.push(0);
    botflag.push(0);
    botflag.push(0);
  }
  for(var i=0;i<10;i++)
  {
    ob1.push(new obst1(gl,[0, 5.5,-50 -1000*Math.random()],'b1.jpg'));
    ob1.push(new obst1(gl,[-4, 5.5,-50 -1000*Math.random()],'b1.jpg'));
    ob1.push(new obst1(gl,[4, 5.5,-50 -1000*Math.random()],'b1.jpg'));    
  }
  for(var i=0;i<10;i++)
  {
    ob2.push(new obst2(gl,[0, 6,-50 -1000*Math.random()],'o2.jpeg'));
    ob2.push(new obst2(gl,[-4, 6,-50 -1000*Math.random()],'o2.jpeg'));
    ob2.push(new obst2(gl,[4, 6,-50 -1000*Math.random()],'o2.jpeg'));    
  }
  for(var i=0;i<100;i++)
  {
    coins.push(new coin(gl,[0,5.5,-500.0*Math.random()],'y.jpg'));
    coins.push(new coin(gl,[-4,5.5,-500.0*Math.random()],'y.jpg'));
    coins.push(new coin(gl,[4,5.5,-500.0*Math.random()],'y.jpg')); 
    coins.push(new coin(gl,[0,jh,-500.0*Math.random()],'y.jpg'));
    coins.push(new coin(gl,[-4,jh,-500.0*Math.random()],'y.jpg'));
    coins.push(new coin(gl,[4,jh,-500.0*Math.random()],'y.jpg')); 
    cflag.push(0);
    cflag.push(0);
    cflag.push(0);
    cflag.push(0);
    cflag.push(0);
    cflag.push(0);
  }
  for(var i=0;i<15;i++)
  { 
    wall.push(new sidewall(gl, [-10,4, -6.0-10*i], 'wall.jpg'));
    wall.push(new sidewall(gl, [10,4, -6.0-10*i], 'wall.jpg'));
  }
  for(var i=0;i<5;i++)
  {
    trn.push(new train(gl,[0,6.5,-50-1000*Math.random()],'tf.jpg'));
    trn.push(new train(gl,[-4,6.5,-50-1000*Math.random()],'tf.jpg'));
    trn.push(new train(gl,[4,6.5,-50-1000*Math.random()],'tf.jpg'));

  }
  curr=30;
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

   const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const fsSource2 = `
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    precision highp float;
      vec4 color = texture2D(uSampler, vTextureCoord);
      float gray = dot(color.rgb,vec3(0.299,0.587,0.114));
      gl_FragColor = vec4(vec3(gray),1.0);
  }
`;
const vsSource3 = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);


      vLighting = ambientLight;
    }
  `;

const fsSource3 = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgram2 = initShaderProgram(gl, vsSource, fsSource2);
  const shaderProgram3 = initShaderProgram(gl, vsSource3, fsSource3);


  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.


  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
  const programInfo2 = {
    program: shaderProgram2,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram2, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram2, 'uSampler'),
    },
  };
  programInfo3 = {
    program: shaderProgram3,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram3, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram3, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram3, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram3, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram3, 'uSampler'),
    },
  };
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  function collectcoins()
  {
    for(var i=0;i<Lf.length;i++)
    {
      if(Math.abs(Lf[i].pos[0]-pl.pos[0])<=1 && Math.abs(Lf[i].pos[1]-pl.pos[1])<=1 && Math.abs(Lf[i].pos[2]-pl.pos[2])<=0.5 && lflag[i]==0)
      {
        lflag[i]=1;
        immune=40;
      }
    }
    for(var i=0;i<coins.length;i++)
    {
      if(Math.abs(coins[i].pos[0]-pl.pos[0])<=1 && Math.abs(coins[i].pos[1]-pl.pos[1])<=1 && Math.abs(coins[i].pos[2]-pl.pos[2])<=0.5 && cflag[i]==0)
      {
        cflag[i]=1;
        nco+=1;
      }
    }
  }

  function checkColl()
  {
    for(var i=0;i<ob1.length;i++)
    {
      if(Math.abs(ob1[i].pos[0]-pl.pos[0])<=1 && Math.abs(ob1[i].pos[1]-pl.pos[1])<=1 && Math.abs(ob1[i].pos[2]-pl.pos[2])<=0.5)
      {
        if(immune>0)
        continue;
        vz=-0.1;
        if(cpl>0)
        {
          alert("Game Over","score - ",nco);
          // console.log("Game Over");
          vz=0;
          vy=0;
        }
        else
          immune=10;
        cpl=500;
        // console.log(ob1[i].pos[2],pl.pos[2]);
      } 
    }
    for(var i=0;i<ob2.length;i++)
    {
      if(Math.abs(ob2[i].pos[0]-pl.pos[0])<=1 && Math.abs(ob2[i].pos[1]-pl.pos[1])<=1 && Math.abs(ob2[i].pos[2]-pl.pos[2])<=0.5)
      {
        if(immune>0)
        continue;
        vz=0;
        vy=0;
        alert("Game Over","score -",nco);
        // console.log("Game Over");
        // vz=0;
        // console.log(ob1[i].pos[2],pl.pos[2]);
      } 
    }
    var x = onjet;
    for(var i=0;i<trn.length;i++)
    {
      if(Math.abs(trn[i].pos[0]-pl.pos[0])<=1 && Math.abs(trn[i].pos[2]-pl.pos[2])<=2.5)
      {
    // off.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    // console.log(trn[i].pos,pl.pos);
      }
      if(Math.abs(trn[i].pos[0]-pl.pos[0])<=1 && pl.pos[1]-trn[i].pos[1]>=1.3 && pl.pos[1]-trn[i].pos[1]<=2.6 && Math.abs(pl.pos[2]-trn[i].pos[2])<=2)
      {
        ontrain=1;
        console.log("ontrain");
        return;
      }
       if(Math.abs(trn[i].pos[0]-pl.pos[0])<=1 && Math.abs(trn[i].pos[1]-pl.pos[1])<=2.5 && pl.pos[2]-trn[i].pos[2]<=2.5 && pl.pos[2]>=trn[i].pos[2])
      {
        if(immune>0)
          continue;
        vz=0;
        vy=0;
        alert("Game Over","score -",nco);
      }
     
    }
  }

  function getJumpBoots()
  {
    if(bcurr>0)
      return;
    for(var i=0;i<bs.length;i++)
    {
      if(Math.abs(bs[i].pos[0]-pl.pos[0])<=1 && Math.abs(bs[i].pos[1]-pl.pos[1])<=1 && Math.abs(bs[i].pos[2]-pl.pos[2])<=0.5 && botflag[i]==0)
      {
        botflag[i]=1;
        bcurr=200;
        break;
      }
    }
  }

  function getJet()
  {
    if(jcurr>0)
      return;
    for(var i=0;i<jetpack.length;i++)
    {
      if(Math.abs(jetpack[i].pos[0]-pl.pos[0])<=1 && Math.abs(jetpack[i].pos[1]-pl.pos[1])<=1 && Math.abs(jetpack[i].pos[2]-pl.pos[2])<=0.5 && jflag[i]==0)
      {
        jflag[i]=1;
        jcurr=400;
        break;
      }
    }
  }

  // Draw the scene repeatedly
  function render(now) {
    console.log(nco);
    cpl--;
    pvl--;
    immune--;
    if(pvl<=-40)
      pvl=40;
    grey--;
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    tme--;
    if(tme<=0)
    {
      tme=20;
      vz-=0.01;
      if(vz>0.4)
        vz=0.4;
    }
    eyey = pl.pos[1]-2;
    dog.pos[0]=pl.pos[0]+1;
    dog.pos[2]=pl.pos[2]+2;
    off.pos[0]=pl.pos[0];
    eyez+=vz;
    eyex = pl.pos[0];
    off.pos[2]+=vz;
    pr--;
    bcurr--;
    jcurr--;
    if(jcurr<=0 && onjet==1)
    {
      onjet = 0;
      uflag=1;
      vy=0;
    }
    getJet();
    if(jcurr==400)
    {
      onjet = 1;
    }
    if(onjet == 1 && pl.pos[1]<jh)
      pl.pos[1]+=0.1;
    collectcoins();
    getJumpBoots();
    ontrain=0;

    checkColl();
    // console.log(ontrain);
    if(ontrain)
    {
      pl.pos[1]=8.3;
    }
    if(pl.pos[1]<=5.5)
    {
      uflag=0;
      pl.pos[1]=5.5;
    }
    document.addEventListener('keydown', keyDownHandler, false);
    if(leftPressed && pr<=0)
    {
      pr=5;
      if(pl.pos[0]>-4)
        pl.pos[0]-=4;
    }
    if(rightPressed && pr<=0)
    {
      pr=5;
      if(pl.pos[0]<4)
        pl.pos[0]+=4;
    }
    if(upPressed && pr<=0 && uflag==0 && onjet==0)
    {
      uflag=1;
      vy=0.2;
      if(bcurr>0)
        vy=0.3;
    }
    if(uflag)
    {
      pl.pos[1]+=vy;
      vy+=gr;
    }
    document.addEventListener('keyup', keyUpHandler, false);
    pl.pos[2]+=vz;
  for(var i=0;i<len;i++)
  {
    if(c[i].pos[2]-1<=eyez)
      continue;    
    c[i] = new cube(gl, [0, 4.0, -3.0-4*ac], 'track.jpg');
  	c1[i] =  new cube(gl, [-4, 4.0, -3.0-4*ac], 'track.jpg');
    c2[i] =  new cube(gl, [4, 4.0, -3.0-4*ac], 'track.jpg');
    ac=ac+1;
  }
  // for(var i=0;i<20;i++)
  // {
  //   coins.push(new coin(gl,[0,6,-500.0*Math.random()],'y.jpg'));
  //   coins.push(new coin(gl,[-2,6,-500.0*Math.random()],'y.jpg'));
  //   coins.push(new coin(gl,[2,6,-500.0*Math.random()],'y.jpg'));    
  // }
  for(var i=0;i<15;i++)
  { 
    if(wall[2*i].pos[2]-1<=eyez)
      continue;
    wall[2*i]= new sidewall(gl, [-10,4, -6.0-10*bc], 'wall.jpg');
    wall[2*i+1]= new sidewall(gl, [10,4, -6.0-10*bc], 'wall.jpg');
    bc = bc + 1;
  }
  if(grey<=0)
    drawScene(gl, programInfo, deltaTime);
  else
    drawScene(gl, programInfo2, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function keyDownHandler(event) {
  if(event.keyCode == 39) {
      rightPressed = true;
  }
  else if(event.keyCode == 37) {
      leftPressed = true;
  }
  if(event.keyCode == 40) {
    downPressed = true;
  }
  else if(event.keyCode == 38) {
    upPressed = true;
  }
  if(event.keyCode == 71)
    grey=20;
}
function keyUpHandler(event) {
  // if(event.keyCode == 39) {
      rightPressed = false;
  // }
  // else if(event.keyCode == 37) {
      leftPressed = false;
  // }
  // if(event.keyCode == 40) {
    downPressed = false;
  // }
  // else if(event.keyCode == 38) {
    upPressed = false;
  // }
}
//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime) {
  gl.clearColor(0.1, 0.7, 1.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 250.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0, 5, 0]);
    var cameraPosition = [
      cameraMatrix[12]+eyex,
      cameraMatrix[13]+eyey,
      cameraMatrix[14]+eyez,
    ];

    var up = [0, 1, 0];
    var target = [eyex,eyey-0.1,eyez-10];
    mat4.lookAt(cameraMatrix, cameraPosition, target, up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    // c.rotation+=0.04;
  
    for(var i=0;i<len;i++)
    {
    		c[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  	}
  	for(var i=0;i<len;i++)
    {
  		c1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  	}
  	for(var i=0;i<len;i++)
    {
  		c2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  	}
    
    for(var i=0;i<coins.length;i++)
    {
      if(cflag[i]==0)
      coins[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
      
    for(var i=0;i<Lf.length;i++)
    {
      if(lflag[i]==0)
      Lf[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(var i=0;i<30;i++)
    {
      ob1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(var i=0;i<30;i++)
    {
      ob2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(var i=0;i<15;i++)
    {
      trn[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(var i=0;i<30;i++)
  	{
      if(pvl<=0 && grey<0)
        wall[i].drawCube(gl, viewProjectionMatrix, programInfo3, deltaTime);
      else
        wall[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(var i=0;i<jetpack.length;i++)
    {
      if(jflag[i]==0)
        jetpack[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(var i=0;i<30;i++)
    {
        if(botflag[i]==0)
        bs[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    pl.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    if(cpl>0)
      off.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    dog.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of c[7].posc[7].posthe given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}