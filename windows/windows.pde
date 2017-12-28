import com.heroicrobot.dropbit.registry.*;
import com.heroicrobot.dropbit.devices.pixelpusher.Pixel;
import com.heroicrobot.dropbit.devices.pixelpusher.Strip;

import processing.core.*;
import java.util.*;

Program currentProgram;

PixelWindow pixelWindow;

public class PixelWindowSettings {
  int sideNumPixelsX = 6;
  int centerNumPixelsX = 10;
  int numPixelsY = 20;
  
  float pixelSpacingX = 40;
  float pixelSpacingY = 30;
  
  float windowSpacing = 20;
}

PixelWindowSettings pixelWindowSettings;
DeviceRegistry registry;

boolean ready_to_go = true;

TestObserver testObserver;

public void settings() {
  pixelWindowSettings = new PixelWindowSettings();
  int screenWidth = (int) (((pixelWindowSettings.sideNumPixelsX + 1) * 2 + (pixelWindowSettings.centerNumPixelsX + 1)) * pixelWindowSettings.pixelSpacingX + 2 * pixelWindowSettings.windowSpacing);
  int screenHeight = (int) ((pixelWindowSettings.numPixelsY + 1) * pixelWindowSettings.pixelSpacingY);
  size(screenWidth, screenHeight, P2D);
}

public void setup() {
  frameRate(15);
  
  System.err.println("**** Running setup()");
  registry = new DeviceRegistry();
  testObserver = new TestObserver();
  registry.addObserver(testObserver);
  registry.setAntiLog(true);
  registry.setAutoThrottle(true);
  registry.setLogging(false);
  
  FONT = loadImage("font.png");
  REVERSE_FONT = loadImage("font_reverse.png");
  
  pixelWindow = new PixelWindow(pixelWindowSettings);
  currentProgram = new TextWindows();
}

public void doAsyncWork() {
  currentProgram.doAsyncWork();
}

public void draw() {
  background(0);
  pixelWindow.beginDrawPanes();
  currentProgram.step();
  pixelWindow.endDrawPanes();
  pixelWindow.render();
  pixelWindow.scrape();
  
  text(frameRate, 50, 50);
}