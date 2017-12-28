class PixelWindow {
  PGraphics leftPane;
  PGraphics centerPane;
  PGraphics rightPane;
  
  PGraphics glow;
  
  PixelWindowSettings settings;
  
  int leftGraphicsOffset;
  int centerGraphicsOffset;
  int rightGraphicsOffset;
  
  PixelWindow(PixelWindowSettings settings) {
    this.settings = settings;
    
    int sideGraphicsWidth = (int) ((settings.sideNumPixelsX + 1) * settings.pixelSpacingX);
    int graphicsHeight = (int) ((settings.numPixelsY + 1) * settings.pixelSpacingY);
    
    log(graphicsHeight);
    leftPane = createGraphics(settings.sideNumPixelsX, settings.numPixelsY);
    rightPane = createGraphics(settings.sideNumPixelsX, settings.numPixelsY);
      
    int centerGraphicsWidth = (int) ((settings.centerNumPixelsX + 1) * settings.pixelSpacingX);
    centerPane = createGraphics(settings.centerNumPixelsX, settings.numPixelsY);
    
    int imageWidth = (int) (2 * sideGraphicsWidth + 2 * settings.windowSpacing + centerGraphicsWidth);
    glow = createGraphics(imageWidth, graphicsHeight);
    
    leftGraphicsOffset = 0;
    centerGraphicsOffset = (int) (sideGraphicsWidth + settings.windowSpacing + leftGraphicsOffset);
    rightGraphicsOffset = (int) (centerGraphicsOffset + centerGraphicsWidth + settings.windowSpacing);
  }
  
  void beginDrawPanes() {
    leftPane.beginDraw();
    rightPane.beginDraw();
    centerPane.beginDraw();
  }
  
  void endDrawPanes() {
    leftPane.endDraw();
    rightPane.endDraw();
    centerPane.endDraw();
  }
  
  void render() {
    glow.beginDraw();
    glow.background(0);
    glow.noStroke();
    
    renderPane(leftPane, leftGraphicsOffset);
    renderPane(centerPane, centerGraphicsOffset);
    renderPane(rightPane, rightGraphicsOffset);
    
    glow.endDraw();
    image(glow, 0, 0);
  }
  
  void renderPane(PGraphics pane, float offset) {
    for (int i = 0; i < pane.width; i++) {
      for (int j = 0; j < pane.height; j++) {
        color c = pane.get(i, j);
        float brightness = brightness(c)/255 * alpha(c)/255;
        float glowRadius2 = brightness * 2 * 2 + 2;
        
        float pixelX = settings.pixelSpacingX * (i + 1) + offset;
        float pixelY = settings.pixelSpacingY * (j + 1);
        
        glow.fill(c, 200);
        glow.ellipse(pixelX, pixelY, glowRadius2, glowRadius2);
      }
    }
  }
  
  int getPixelNumberSidePane(int x, int y) {
    if (y % 2 == 1) {
      return (settings.numPixelsY - y - 1) * settings.sideNumPixelsX + x;
    } else {
      return (settings.numPixelsY - y - 1) * settings.sideNumPixelsX + (settings.sideNumPixelsX - x - 1);
    }
  }
    
  int getPixelNumberCenterPane(int x, int y) {
    if (y % 2 == 0) {
      return (settings.numPixelsY - y) * settings.centerNumPixelsX + x;
    } else {
      return (settings.numPixelsY - y) * settings.centerNumPixelsX + (settings.centerNumPixelsX - x - 1);
    }
  }
  
  void scrape() {
    if (testObserver.hasStrips) {
      registry.startPushing();
      List<Strip> strips = registry.getStrips();
      if (strips.size() > 1) {
        for (int x = 0; x < leftPane.width; x++) {
          for (int y = 0; y < leftPane.height; y++) {
            color c = leftPane.get(x, y);
            strips.get(0).setPixel(c, getPixelNumberSidePane(x, y));
          }
        }
      }
      if (strips.size() > 2) {
        for (int x = 0; x < centerPane.width; x++) {
          for (int y = 0; y < centerPane.height; y++) {
            color c = centerPane.get(x, y);
            strips.get(1).setPixel(c, getPixelNumberCenterPane(x, y));
          }
        }
      }
      if (strips.size() > 3) {
        for (int x = 0; x < rightPane.width; x++) {
          for (int y = 0; y < rightPane.height; y++) {
            color c = rightPane.get(x, y);
            strips.get(2).setPixel(c, getPixelNumberSidePane(x, y));
          }
        }
      }
    }
  }
}
