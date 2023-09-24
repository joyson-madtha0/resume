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

const pointsColor = [];
const pointsCord = [];
function loadImageData(canvas) {
  let img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
    const midX = img.width / 2;
    const midY = img.height / 2;
    let x = 0;
    let y = 1;
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
    }
  };
  img.src = "/1.png";
}

export default function Home() {
  const webgl = useRef(null);
  const img1 = useRef(null);
  useEffect(() => {
    (async () => {
      const gl = webgl.current.getContext("webgl");
      if (!gl) return;
      loadImageData(img1.current);
      await new Promise((resolve) => {
        setTimeout(() => resolve(1), 100);
      });
      resize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      const vertexShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );
      const program = createProgram(gl, vertexShader, fragmentShader);
      const vertexPosition = gl.getAttribLocation(program, "vertexPosition");
      var colorLoc = gl.getAttribLocation(program, "vColor");
      gl.enableVertexAttribArray(vertexPosition);
      gl.clearDepth(1.0);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      var fieldOfView = 30;
      var nearPlane = 1.0;
      var farPlane = 10000.0;
      var top = nearPlane * Math.tan((fieldOfView * Math.PI) / 360.0);
      var bottom = -top;
      var right = (gl.canvas.width / gl.canvas.height) * top;
      var left = -right;
      var a = (right + left) / (right - left);
      var b = (top + bottom) / (top - bottom);
      var c = (farPlane + nearPlane) / (farPlane - nearPlane);
      var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
      var x = (2 * nearPlane) / (right - left);
      var y = (2 * nearPlane) / (top - bottom);
      var perspectiveMatrix = [x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0];
      var modelViewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      var uModelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
      var uPerspectiveMatrix = gl.getUniformLocation(
        program,
        "perspectiveMatrix"
      );
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
      // below line has to be called in loop
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.vertexAttribPointer(vertexPosition, 3.0, gl.FLOAT, false, 0, 0);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(pointsCord),
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
      gl.drawArrays(gl.POINTS, 0, pointsCord.length / 3);
      gl.flush();
    })();
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
