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
uniform float uLight;

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

  // Dark palette: black + ember orange
  vec3 darkInk = vec3(0.039, 0.039, 0.043);
  vec3 darkSmoke = vec3(0.1, 0.095, 0.1);
  vec3 darkEmber = vec3(0.42, 0.1, 0.025);
  // Light palette: white / soft paper + orange
  vec3 lightInk = vec3(0.965, 0.957, 0.945);
  vec3 lightSmoke = vec3(0.92, 0.9, 0.88);
  vec3 lightEmber = vec3(1.0, 0.55, 0.28);
  vec3 accent = vec3(1.0, 0.353, 0.122);

  vec3 ink = mix(darkInk, lightInk, uLight);
  vec3 smoke = mix(darkSmoke, lightSmoke, uLight);
  vec3 ember = mix(darkEmber, lightEmber, uLight);

  float center = exp(-dot(p, p) * 1.35);
  float heat = smoothstep(0.52, 0.96, field) * mix(0.22, 0.95, center);
  heat *= mix(0.75, 1.15, uProgress);

  vec3 color = mix(ink, smoke, smoothstep(0.2, 0.8, field));
  color = mix(color, ember, heat * mix(1.0, 0.85, uLight));
  color = mix(color, accent, smoothstep(0.55, 1.0, heat) * mix(0.45, 0.75, uProgress) * mix(1.0, 0.7, uLight));
  color += accent * mouseFalloff * mix(0.08, 0.06, uLight);

  float vignette = smoothstep(1.55, 0.25, length(p * vec2(0.78, 1.0)));
  // Dark mode deepens edges; light mode stays bright with a soft paper falloff.
  float edge = mix(0.28, 0.82, uLight);
  color *= mix(edge, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`;
