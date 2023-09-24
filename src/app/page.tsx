"use client";
import React, { useRef, useEffect } from "react";
// import styles from "./page.module.css";

const vertexShaderSource = `
uniform mat4 modelViewMatrix;
uniform mat4 perspectiveMatrix;
attribute vec3 vertexPosition;
attribute vec4 vColor;
varying vec4 fColor;
 void main(void) {
  fColor = vColor;
  gl_Position = perspectiveMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
  gl_PointSize = 4.7;
}`;

// vec2 cxy = 2.0 * gl_PointCoord - 1.0;
//   float r =  dot(cxy, cxy);
//   if (r > 1.0) {
//     discard;
//   }
const fragmentShaderSource = `
#ifdef GL_ES
precision highp float;
#endif
varying vec4 fColor;
void main(void) {
  gl_FragColor = fColor;
}`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader)); // if any error
  gl.deleteShader(shader);
}
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram(); // create GLSL shaders, upload the GLSL source, compile the shaders
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(program);
    return program;
  }
  console.log(gl.getProgramInfoLog(program)); // if any error
  gl.deleteProgram(program);
  gl.deleteProgram(vertexShader);
  gl.deleteProgram(fragmentShader);
}
function resize(canvas) {
  const displayWidth = Math.floor(canvas.clientWidth * window.devicePixelRatio);
  const displayHeight = Math.floor(
    canvas.clientHeight * window.devicePixelRatio
  );
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

let vertices = [],
  freqArr = [],
  velocities = [],
  thetaArr = [],
  velThetaArr = [],
  velRadArr = [],
  randomPoints = [],
  animatedPoints = [],
  drawType = 2,
  animationEndTime = 0;

const boldRateArr = [],
  randomTargetXArr = [],
  randomTargetYArr = [],
  numLines = 4000;
// offsetDelay = [0.02, 0.04, 0.03, 0.05, 0.03, 0.02, 0.05, 0.04]

function setup() {
  const screenRatio = window.innerWidth / window.innerHeight;
  for (let i = 0; i < numLines; i++) {
    const rad = Math.random() * 0.2 + 0.1;
    const theta = Math.random() * Math.PI * 2;
    const velTheta = (Math.random() * Math.PI * 2) / 40;
    const freq = Math.random() * 0.12 + 0.03;
    const boldRate = Math.random() * 0.04 + 0.01;
    const randomPosX = (Math.random() * 2 - 1) * screenRatio;
    const randomPosY = Math.random() * 2 - 1;
    //  Math.random() * 2 - 1 is to place points in all four quardinates
    vertices.push(rad * Math.cos(theta), rad * Math.sin(theta), 1.83);
    // vertices.push(rad * Math.cos(theta), rad * Math.sin(theta), 1.83) // Dont know why 2 times used so commented
    thetaArr.push(theta);
    velThetaArr.push(velTheta);
    velRadArr.push(rad);
    freqArr.push(freq);
    boldRateArr.push(boldRate);
    randomTargetXArr.push(randomPosX);
    randomTargetYArr.push(randomPosY);
  }

  freqArr = new Float32Array(freqArr);
  vertices = new Float32Array(vertices);
  velocities = new Float32Array(velocities);
  thetaArr = new Float32Array(thetaArr);
  velThetaArr = new Float32Array(velThetaArr);
  velRadArr = new Float32Array(velRadArr);
}

const availableImages = [
  "/1.png",
  "/2.png",
  "/3.png",
  "/4.png",
  "/5.png",
  "/6.png",
  "/7.png",
  "/8.png",
  "/9.png",
];
const pointsColors = [];
const pointsCords = [];
function loadImageData(canvas, imageIndex) {
  let img = new Image();

  img.onload = () => {
    const pointsColor = [];
    const pointsCord = [];
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
    console.log(imgData.length, img.width, img.height);

    const midX = img.width / 2;
    const midY = img.height / 2;
    let x = 0;
    let y = 1;
    const numberOfPoints = imgData.length / 4;
    const maxRandomPoints = numberOfPoints * 3; // 3 randomPoints values
    const multiplier = 10000;
    for (let i = 0; i < imgData.length; i = i + 4) {
      x = x + 1;
      if (x > img.width) {
        x = 1;
        y = y + 1;
      }
      pointsColor.push(
        Math.round((imgData[i] * multiplier) / 255) / multiplier,
        Math.round((imgData[i + 1] * multiplier) / 255) / multiplier,
        Math.round((imgData[i + 2] * multiplier) / 255) / multiplier,
        Math.round((imgData[i + 3] * multiplier) / 255) / multiplier
      );
      pointsCord.push(
        Math.round(((x - midX) * multiplier) / midX) / multiplier,
        Math.round(((midY - y) * multiplier) / midY) / multiplier,
        1.83
      );
      let x1 = Math.random() - 0.5;
      let y1 = Math.random() - 0.5;
      if (randomPoints.length < maxRandomPoints) {
        randomPoints.push(x1 * 20, y1 * 20, 1.83); // *Note: check later
      }
    }
    pointsColors.push(pointsColor);
    pointsCords.push(pointsCord);
    // console.log(randomPoints.length / 3, pointsCord.length / 3)
    if (availableImages.length >= imageIndex + 1) {
      loadImageData(canvas, imageIndex + 1); // *Note: Do the same thing for next image
    }
    // if (imgData.length / 4 < numLines) {
    // *NOTE: this will not be true for all images
    // }
  };
  img.src = availableImages[imageIndex];
}

export default function Home() {
  const webgl = useRef(null);
  const img1 = useRef(null);
  useEffect(() => {
    const gl = webgl.current.getContext("webgl");
    if (!gl) return;
    loadImageData(img1.current, 0);
    resize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    const program = createProgram(gl, vertexShader, fragmentShader); // Link the two shaders into a program

    //    Get the vertexPosition attribute from the linked shader program
    const vertexPosition = gl.getAttribLocation(program, "vertexPosition");
    //    Enable the vertexPosition vertex attribute array. If enabled, the array
    //    will be accessed an used for rendering when calls are made to commands like
    //    gl.drawArrays, gl.drawElements, etc.
    gl.enableVertexAttribArray(vertexPosition);
    //    Clear the depth buffer. The value specified is clamped to the range [0,1].
    //    More info about depth buffers: http://en.wikipedia.org/wiki/Depth_buffer
    gl.clearDepth(1.0);
    //    Enable depth testing. This is a technique used for hidden surface removal.
    //    It assigns a value (z) to each pixel that represents the distance from this
    //    pixel to the viewer. When another pixel is drawn at the same location the z
    //    values are compared in order to determine which pixel should be drawn.
    //gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    //    Specify which function to use for depth buffer comparisons. It compares the
    //    value of the incoming pixel against the one stored in the depth buffer.
    //    Possible values are (from the OpenGL documentation):
    //    GL_NEVER - Never passes.
    //    GL_LESS - Passes if the incoming depth value is less than the stored depth value.
    //    GL_EQUAL - Passes if the incoming depth value is equal to the stored depth value.
    //    GL_LEQUAL - Passes if the incoming depth value is less than or equal to the stored depth value.
    //    GL_GREATER - Passes if the incoming depth value is greater than the stored depth value.
    //    GL_NOTEQUAL - Passes if the incoming depth value is not equal to the stored depth value.
    //    GL_GEQUAL - Passes if the incoming depth value is greater than or equal to the stored depth value.
    //    GL_ALWAYS - Always passes.
    //gl.depthFunc(gl.LEQUAL);
    //    Now create a shape.
    //    First create a vertex buffer in which we can store our data.
    var vertexBuffer = gl.createBuffer();
    //    Bind the buffer object to the ARRAY_BUFFER target.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //    Specify the vertex positions (x, y, z)
    setup(); // of image processing
    //    Clear the color buffer (r, g, b, a) with the specified color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //    Clear the color buffer and the depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //    Creates a new data store for the vertices array which is bound to the ARRAY_BUFFER.
    //    The third paramater indicates the usage pattern of the data store. Possible values are
    //    (from the OpenGL documentation):
    //    The frequency of access may be one of these:
    //    STREAM - The data store contents will be modified once and used at most a few times.
    //    STATIC - The data store contents will be modified once and used many times.
    //    DYNAMIC - The data store contents will be modified repeatedly and used many times.
    //    The nature of access may be one of these:
    //    DRAW - The data store contents are modified by the application, and used as the source for
    //           GL drawing and image specification commands.
    //    READ - The data store contents are modified by reading data from the GL, and used to return
    //           that data when queried by the application.
    //    COPY - The data store contents are modified by reading data from the GL, and used as the source
    //           for GL drawing and image specification commands.
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    //     Specify the location and format of the vertex position attribute
    gl.vertexAttribPointer(vertexPosition, 3.0, gl.FLOAT, false, 0, 0);
    var colorLoc = gl.getAttribLocation(program, "vColor");
    gl.disableVertexAttribArray(colorLoc);
    gl.vertexAttrib4f(colorLoc, 0.2, 0.3, 0.4, 1.0);

    //    Define the viewing frustum parameters
    //    More info: http://en.wikipedia.org/wiki/Viewing_frustum
    //    More info: https://knol.google.com/k/view-frustum
    var fieldOfView = 30;
    var nearPlane = 1.0;
    var farPlane = 10000.0;
    var top = nearPlane * Math.tan((fieldOfView * Math.PI) / 360.0);
    var bottom = -top;
    var right = (gl.canvas.width / gl.canvas.height) * top; // aspectRatio * top
    var left = -right;
    //     Create the perspective matrix. The OpenGL function that's normally used for this,
    //     glFrustum() is not included in the WebGL API. That's why we have to do it manually here.
    //     More info: http://www.cs.utk.edu/~vose/c-stuff/opengl/glFrustum.html
    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = (farPlane + nearPlane) / (farPlane - nearPlane);
    var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
    var x = (2 * nearPlane) / (right - left);
    var y = (2 * nearPlane) / (top - bottom);
    var perspectiveMatrix = [x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0];
    //     Create the modelview matrix
    //     More info about the modelview matrix: http://3dengine.org/Modelview_matrix
    var modelViewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    //     Get the location of the "modelViewMatrix" uniform variable from the
    //     shader program
    var uModelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    //     Get the location of the "perspectiveMatrix" uniform variable from the
    //     shader program
    var uPerspectiveMatrix = gl.getUniformLocation(
      program,
      "perspectiveMatrix"
    );
    //     Set the values
    gl.uniformMatrix4fv(
      uModelViewMatrix,
      false,
      new Float32Array(perspectiveMatrix)
    );
    gl.uniformMatrix4fv(
      uPerspectiveMatrix,
      false,
      new Float32Array(modelViewMatrix)
    );
    let activeLoopingImageIndex = 0;
    const eachImageMaxLoop = 2;
    let currentImageIteratedCount = 0;
    const drawSeen = (now) => {
      requestAnimationFrame(drawSeen);
      let i, bp;
      switch (drawType) {
        case 0: {
          // shuffle()
          for (i = numLines; i > -1; i--) {
            bp = i * 3; // 3 x 3 matrix
            vertices[bp] +=
              (randomTargetXArr[i] - vertices[bp]) *
              (Math.random() * 0.04 + 0.06);
            vertices[bp + 1] +=
              (randomTargetYArr[i] - vertices[bp + 1]) *
              (Math.random() * 0.04 + 0.06);
          }
          break;
        }
        case 1: {
          // spin()
          for (i = numLines; i > -1; i--) {
            bp = i * 3;
            thetaArr[i] = thetaArr[i] + velThetaArr[i];
            vertices[bp] +=
              (velRadArr[i] * Math.cos(thetaArr[i]) - vertices[bp]) *
              (Math.random() * 0.1 + 0.1);
            vertices[bp + 1] +=
              (velRadArr[i] * Math.sin(thetaArr[i]) - vertices[bp + 1]) *
              (Math.random() * 0.1 + 0.1);
          }
          break;
        }
        case 2: {
          // swirl()
          for (i = numLines; i > -1; i--) {
            bp = i * 3;
            thetaArr[i] += velThetaArr[i];
            vertices[bp] += velRadArr[i] * Math.cos(thetaArr[i]) * 0.1;
            vertices[bp + 1] += velRadArr[i] * Math.sin(thetaArr[i]) * 0.1;
          }
          break;
        }
        default: {
          if (!animationEndTime) {
            animationEndTime = now + 1500;
          }
          const pointsCord = pointsCords[activeLoopingImageIndex];
          const pointsColor = pointsColors[activeLoopingImageIndex];
          if (now <= animationEndTime) {
            // linear: t => t           // no easing, no acceleration
            // easeInQuad: t => t*t            // accelerating from zero velocity
            // easeOutQuad: t => t*(2-t)            // decelerating to zero velocity
            // easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t            // acceleration until halfway, then deceleration
            // easeInCubic: t => t*t*t            // accelerating from zero velocity
            // easeOutCubic: t => (--t)*t*t+1            // decelerating to zero velocity
            // easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1            // acceleration until halfway, then deceleration
            // easeInQuart: t => t*t*t*t            // accelerating from zero velocity
            // easeOutQuart: t => 1-(--t)*t*t*t            // decelerating to zero velocity
            // easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t            // acceleration until halfway, then deceleration
            // easeInQuint: t => t*t*t*t*t            // accelerating from zero velocity
            // easeOutQuint: t => 1+(--t)*t*t*t*t            // decelerating to zero velocity
            // easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t            // acceleration until halfway, then deceleration
            const t = (animationEndTime - now) / 1500;
            const distance = t * t * t * t;
            // const delayedT = (animationEndTime + 1000 - now) / 1000
            // const delayedBaseDistance = delayedT * delayedT * delayedT * delayedT
            animatedPoints = [];
            for (i = 0; i < pointsCord.length; i = i + 3) {
              // const distance = t > 0 ? baseDistance + offsetDelay[i % 8] : delayedBaseDistance + offsetDelay[i % 8]
              animatedPoints[i] =
                pointsCord[i] - (pointsCord[i] - randomPoints[i]) * distance;
              animatedPoints[i + 1] =
                pointsCord[i + 1] -
                (pointsCord[i + 1] - randomPoints[i + 1]) * distance;
              animatedPoints[i + 2] = 1.83;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.vertexAttribPointer(vertexPosition, 3.0, gl.FLOAT, false, 0, 0);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array(animatedPoints),
              gl.DYNAMIC_DRAW
            );
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(colorLoc);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array(pointsColor),
              gl.DYNAMIC_DRAW
            );
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, animatedPoints.length / 3);
          } else if (animationEndTime + 1500 <= now) {
            if (animationEndTime + 2500 >= now) {
              let t = (animationEndTime + 2500 - now) / 1500;
              const distance = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              for (i = 0; i < pointsCord.length; i = i + 3) {
                animatedPoints[i] =
                  randomPoints[i] -
                  (randomPoints[i] - pointsCord[i]) * distance;
                animatedPoints[i + 1] =
                  randomPoints[i + 1] -
                  (randomPoints[i + 1] - pointsCord[i + 1]) * distance;
                animatedPoints[i + 2] = 1.83;
              }
              gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
              gl.vertexAttribPointer(
                vertexPosition,
                3.0,
                gl.FLOAT,
                false,
                0,
                0
              );
              gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(animatedPoints),
                gl.DYNAMIC_DRAW
              );
              gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
              gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
              gl.enableVertexAttribArray(colorLoc);
              gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(pointsColor),
                gl.DYNAMIC_DRAW
              );
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
              gl.drawArrays(gl.POINTS, 0, animatedPoints.length / 3);
            } else if (animationEndTime + 4000 <= now) {
              animationEndTime = now + 1500;
              currentImageIteratedCount = currentImageIteratedCount + 1;
              if (currentImageIteratedCount >= eachImageMaxLoop) {
                currentImageIteratedCount = 0;
                activeLoopingImageIndex = activeLoopingImageIndex + 1;
                console.log(pointsCords[activeLoopingImageIndex]);
                if (activeLoopingImageIndex === pointsCords.length) {
                  activeLoopingImageIndex = 0;
                }
              }
            }
          }
        }
      }
      if (drawType !== 3) {
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, numLines);
      }
      gl.flush();
    };
    drawSeen(performance.now());

    setInterval(() => {
      if (drawType < 3) {
        drawType = drawType + 1;
      }
    }, 2000);
  }, []);

  return (
    <>
      <canvas ref={img1} style={{ position: "absolute", zIndex: -1 }}></canvas>
      <canvas
        ref={webgl}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      ></canvas>
    </>
  );
}
