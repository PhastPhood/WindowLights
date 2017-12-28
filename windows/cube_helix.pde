color getCubeHelixColor(float t) {
  HslColor a = new HslColor(color(45, 22, 89));
  HslColor b = new HslColor(color(136, 204, 0));
  HslColor c = new HslColor(color(45, 22, 89));
  a.h = -100;
  a.s = 0.75;
  a.l = 0.35;
  b.h = 80;
  b.s = 1.5;
  b.l = 0.8;
  c.h = 260;
  c.s = 0.75;
  c.l = 0.35;
  
  if (t <= 0.5) {
    return interpolateCubeHelix(1, t * 2, a, b);
  } else {
    return interpolateCubeHelix(1, (t - 0.5) * 2, b, c);
  }
}

color getCubeHelixColor(color aRgb, color bRgb, color cRgb, float t) {
  HslColor a = new HslColor(aRgb);
  HslColor b = new HslColor(bRgb);
  HslColor c = new HslColor(cRgb);
  a.h = -100;
  a.s = 0.75;
  a.l = 0.35;
  b.h = 80;
  b.s = 1.5;
  b.l = 0.8;
  c.h = 260;
  c.s = 0.75;
  c.l = 0.35;
  
  if (t <= 0.5) {
    return interpolateCubeHelix(1, t * 2, a, b);
  } else {
    return interpolateCubeHelix(1, (t - 0.5) * 2, b, c);
  }
}

class HslColor {
  float h;
  float s;
  float l;
  float a;
  
  HslColor(color c) {
    h = hue(c);
    s = saturation(c)/255;
    l = brightness(c)/255;
    a = alpha(c)/255;
  }
}

color interpolateCubeHelix(float y, float t, HslColor a, HslColor b) {
  
  float radians = PI/180;
  
  float ah = (a.h + 120) * radians;
  float bh = (b.h + 120) * radians - ah;
  float as = a.s;
  float bs = b.s - as;
  float al = a.l;
  float bl = b.l - al;
  
  float h = ah + bh * t;
  float l = pow(al + bl * t, y);
  float s = (as + bs * t) * l * (1 - l);
  
  color c = color(hex(l + s * (-0.14861 * cos(h) + 1.78277 * sin(h))),
      hex(l + s * (-0.29227 * cos(h) - 0.90649 * sin(h))),
      hex(l + s * (+1.97294 * cos(h))));
  return c;
}

float hex(float v) {
  return (v = v <= 0 ? 0 : v >= 1 ? 255 : (int) (v * 255) | 0);
}
