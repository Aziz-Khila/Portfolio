export const heroVertex = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const heroFragment = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uProgress;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  mat2 rotate = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p);
    p = rotate * p;
    amplitude *= 0.4;
  }
  return value;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  float t = uTime * 0.035;
  p *= mix(1.0, 0.7, uProgress);

  float mouseDist = length(p - mouse);
  float mouseFalloff = exp(-mouseDist * mouseDist * 5.0) * uMouseStrength;
  p += (p - mouse) * mouseFalloff * 0.25;

  vec2 q = vec2(fbm(p * 0.6 + vec2(0.0, t)), fbm(p * 0.6 + vec2(5.2, -t)));
  vec2 r = vec2(
    fbm(p * 0.8 + 1.1 * q + vec2(1.7, 9.2) + t),
    fbm(p * 0.8 + 1.1 * q + vec2(8.3, 2.8) - t * 0.8)
  );
  float field = fbm(p * 0.7 + 1.3 * r) * 0.5 + 0.5;

  vec3 ink = vec3(0.039, 0.039, 0.043);
  vec3 smoke = vec3(0.1, 0.095, 0.1);
  vec3 ember = vec3(0.42, 0.1, 0.025);
  vec3 accent = vec3(1.0, 0.353, 0.122);

  float center = exp(-dot(p, p) * 1.6);
  float heat = smoothstep(0.5, 0.95, field) * mix(0.35, 1.0, center);

  vec3 color = mix(ink, smoke, smoothstep(0.2, 0.8, field));
  color = mix(color, ember, heat);
  color = mix(color, accent, smoothstep(0.55, 1.0, heat) * 0.7);
  color += accent * mouseFalloff * 0.08;

  float vignette = smoothstep(1.4, 0.2, length(p * vec2(0.75, 1.0)));
  color *= mix(0.3, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`;
