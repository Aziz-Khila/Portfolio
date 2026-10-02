export const mediaVertex = /* glsl */ `
  uniform float uVelocity;
  varying vec2 vUv;
  varying float vBend;

  #define PI 3.14159265

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Flex the plane like paper as the gallery is dragged by the scroll.
    float bend = sin(uv.x * PI);
    pos.z -= bend * uVelocity * 160.0;
    pos.y += bend * uVelocity * 0.035;
    vBend = bend * abs(uVelocity);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const mediaFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uPoster;
  uniform sampler2D uVideo;
  uniform float uVideoMix;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uVelocity;
  uniform float uReveal;
  uniform float uTime;
  uniform vec2 uPlane;
  uniform vec2 uMedia;
  uniform vec3 uAccent;

  varying vec2 vUv;
  varying float vBend;

  vec2 cover(vec2 uv, vec2 plane, vec2 media) {
    float planeRatio = plane.x / plane.y;
    float mediaRatio = media.x / media.y;
    vec2 scale = planeRatio > mediaRatio
      ? vec2(1.0, mediaRatio / planeRatio)
      : vec2(planeRatio / mediaRatio, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  vec3 sampleMedia(vec2 uv) {
    vec3 poster = texture2D(uPoster, uv).rgb;
    vec3 video = texture2D(uVideo, uv).rgb;
    return mix(poster, video, uVideoMix);
  }

  void main() {
    vec2 uv = cover(vUv, uPlane, uMedia);

    // Slow push-in on hover.
    uv = (uv - 0.5) * mix(1.0, 0.92, uHover) + 0.5;

    // Liquid ripple radiating from the pointer.
    vec2 toMouse = vUv - uMouse;
    float dist = length(toMouse * vec2(uPlane.x / uPlane.y, 1.0));
    float wave = sin(dist * 26.0 - uTime * 5.0) * exp(-dist * 4.5) * 0.014 * uHover;
    uv += normalize(toMouse + 1e-5) * wave;

    // Chromatic split driven by scroll velocity.
    float shift = uVelocity * 0.03 + wave * 0.6;
    vec3 color;
    color.r = sampleMedia(uv + vec2(shift, 0.0)).r;
    color.g = sampleMedia(uv).g;
    color.b = sampleMedia(uv - vec2(shift, 0.0)).b;

    // Desaturated at rest, full colour on hover.
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(gray) * 0.82, color, 0.2 + 0.8 * uHover);
    color *= 1.0 - vBend * 0.35;

    // Noisy wipe from the bottom with an accent-coloured edge.
    float n = noise(vUv * vec2(5.0, 7.0) + uTime * 0.2);
    float edge = vUv.y * 0.78 + n * 0.22;
    float alpha = 1.0 - smoothstep(uReveal - 0.1, uReveal, edge);
    float rim = smoothstep(uReveal - 0.1, uReveal - 0.04, edge) * alpha;
    color = mix(color, uAccent, rim);

    gl_FragColor = vec4(color, alpha);
  }
`;
