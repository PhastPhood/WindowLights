import http.requests.*;

int FLASH_NUM_FRAMES = 8;
int WAVE_NUM_FRAMES = 12;
int SHAKE_NUM_FRAMES = 6;

int GLOW_1_NUM_FRAMES = 30;
int GLOW_2_NUM_FRAMES = 24;
int GLOW_3_NUM_FRAMES = 20;

HslColor GLOW_3_A = new HslColor(110, 0, 1, 1);
HslColor GLOW_3_B = new HslColor(130, 0.5, 0.78, 1);
HslColor GLOW_3_C = new HslColor(215, 1, 0.6, 1);

public class Message {
  String message;
  String textColor;
  String textEffect;
  
  public Message(String message) {
    this.message = message.replaceAll("[^a-zA-Z0-9,.!? ]*$","").toUpperCase();
    this.textColor = "white";
    this.textEffect = "none";
  }
  
  public void setMessage(String message) {
    this.message = message.replaceAll("[^a-zA-Z0-9,.!? ]*$","").toUpperCase();
  }
}

public class TextWindows implements Program {

  Message currentMessage = new Message("Hello, World!");
  Message nextMessage = new Message(currentMessage.message);

  int messageFrameIndex = 0;
  int messageNumFrames = currentMessage.message.length() * (LETTER_HEIGHT + 2) + pixelWindowSettings.numPixelsY;
  
  HashMap<String, String> env = new HashMap<String, String>();

  public TextWindows() {
    String[] lines = loadStrings("../.env");
    for (int i = 0; i < lines.length; i++) {
      String[] keyValuePair = split(lines[i], '=');
      if (keyValuePair.length > 1) {
        env.put(keyValuePair[0], keyValuePair[1]);
      }
    }
    thread("doAsyncWork");
  }

  void step() {
    pixelWindow.leftPane.clear();
    messageFrameIndex++;
    if (messageFrameIndex >= messageNumFrames) {
      thread("doAsyncWork");
      currentMessage.message = nextMessage.message;
      currentMessage.textColor = nextMessage.textColor;
      currentMessage.textEffect = nextMessage.textEffect;

      messageFrameIndex = 0;
      messageNumFrames = currentMessage.message.length() * (LETTER_HEIGHT + 2) + pixelWindowSettings.numPixelsY;
    }

    int textX = 0;
    int textY = pixelWindowSettings.numPixelsY - messageFrameIndex;
    int letterDisplayStartIndex = -textY / (LETTER_HEIGHT + 2);
    int letterDisplayEndIndex = 1 + messageFrameIndex / (LETTER_HEIGHT + 2);
    for (int i = letterDisplayStartIndex; i < letterDisplayEndIndex; i++) {
      if (i >= 0 && i < currentMessage.message.length()) {
        int letterX = textX;
        int letterY = textY + i * (LETTER_HEIGHT + 2);
        color letterColor = getLetterColor(
            currentMessage.textColor,
            i,
            currentMessage.message.length(),
            messageFrameIndex,
            messageNumFrames);
        int letterOffsetX = getLetterOffsetX(
            currentMessage.textEffect,
            i,
            currentMessage.message.length(),
            messageFrameIndex,
            messageNumFrames);
        int letterOffsetY = getLetterOffsetY(
            currentMessage.textEffect,
            i,
            currentMessage.message.length(),
            messageFrameIndex,
            messageNumFrames);
        renderLetter(pixelWindow.leftPane,
            currentMessage.message.charAt(i),
            letterX + letterOffsetX,
            letterY + letterOffsetY,
            letterColor,
            true);
      }
    }
  }
  
  void doAsyncWork() {
    GetRequest get = new GetRequest("https://" + env.get("SERVER_ADDRESS") + "/api/currentMessage");
    get.addUser(env.get("AUTH_USER"), env.get("AUTH_PASS"));
    get.send();
    JSONObject response = parseJSONObject(get.getContent());
    try {
      nextMessage.setMessage(response.getString("body"));
      nextMessage.textColor = (response.getString("color"));
      nextMessage.textEffect = (response.getString("effect"));
    } catch (Exception e) {
      println(e);
    }
  }
  
  int getLetterOffsetX(String textEffect, int letterIndex, int numLetters, int frameIndex, int numFrames) {
    if (textEffect.equals("wave") || textEffect.equals("wave2")) {
      if ((frameIndex + letterIndex * 4) % WAVE_NUM_FRAMES * 2 >= WAVE_NUM_FRAMES) {
        return 1;
      } else {
        return 0;
      }
    } else if (textEffect.equals("shake")) {
      if (frameIndex % (SHAKE_NUM_FRAMES * 2) >= SHAKE_NUM_FRAMES) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  }
  
  int getLetterOffsetY(String textEffect, int letterIndex, int numLetters, int frameIndex, int numFrames) {
    if (textEffect.equals("wave2")) {
      if ((frameIndex + letterIndex * 4 + WAVE_NUM_FRAMES/2) % WAVE_NUM_FRAMES * 2 >= WAVE_NUM_FRAMES) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  }
  
  color getLetterColor(String textColor, int letterIndex, int numLetters, int frameIndex, int numFrames) {
    if (textColor.equals("cyan")) {
      return color(0, 255, 255);
    } else if (textColor.equals("red")) {
      return color(255, 0, 0);
    } else if (textColor.equals("green")) {
      return color(0, 255, 0);
    } else if (textColor.equals("purple")) {
      return color(212, 0, 255);
    } else if (textColor.equals("yellow")) {
      return color(255, 255, 0);
    } else if (textColor.equals("flash1")) {
      if (frameIndex % (FLASH_NUM_FRAMES * 2) >= FLASH_NUM_FRAMES) {
        return color(255, 0, 0); 
      } else {
        return color(255, 255, 0);
      }
    } else if (textColor.equals("flash2")) {
      if (frameIndex % (FLASH_NUM_FRAMES * 2) >= FLASH_NUM_FRAMES) {
        return color(0, 144, 255); 
      } else {
        return color(0, 255, 255);
      }
    } else if (textColor.equals("flash3")) {
      if (frameIndex % (FLASH_NUM_FRAMES * 2) >= FLASH_NUM_FRAMES) {
        return color(0, 144, 0); 
      } else {
        return color(0, 255, 0);
      }
    } else if (textColor.equals("glow1")) {
      float t = (frameIndex % GLOW_1_NUM_FRAMES) / (float) GLOW_1_NUM_FRAMES;
      return getCubeHelixColor(t);
    } else if (textColor.equals("glow2")) {
      float t = (frameIndex % GLOW_2_NUM_FRAMES) / (float) GLOW_2_NUM_FRAMES;
      t = abs(t * 0.6 - 0.3) + 0.8;
      if (t > 1) {
        t -= 1;
      }
      return getCubeHelixColor(t % 1);
    } else if (textColor.equals("glow3")) {
      float t = (frameIndex % GLOW_3_NUM_FRAMES) / (float) GLOW_3_NUM_FRAMES;
      t = abs(t * 2 - 1);
      if (t > 1) {
        t -= 1;
      }
      return getCubeHelixColor(GLOW_3_A, GLOW_3_B, GLOW_3_C, t);
    }
    return color(255);
  }
}