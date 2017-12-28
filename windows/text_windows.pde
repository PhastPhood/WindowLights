import http.requests.*;

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
  int startTextY = pixelWindowSettings.numPixelsY;
  int textX = 0;
  int textY = startTextY;
  Message currentMessage = new Message("Hello, World!");
  Message nextMessage = new Message(currentMessage.message);
  int frameIndex = 0;
  int textHeight = currentMessage.message.length() * (LETTER_HEIGHT + 2) + pixelWindowSettings.numPixelsY;
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
    textY--;
    if (textY < -textHeight) {
      thread("doAsyncWork");
      textY = startTextY;
      currentMessage.message = nextMessage.message;
      currentMessage.textColor = nextMessage.textColor;
      currentMessage.textEffect = nextMessage.textEffect;
      textHeight = currentMessage.message.length() * (LETTER_HEIGHT + 2) + pixelWindowSettings.numPixelsY;
    }

    int letterDisplayStartIndex = -textY / (LETTER_HEIGHT + 2);
    int letterDisplayEndIndex = 1 + (-textY + pixelWindowSettings.numPixelsY) / (LETTER_HEIGHT + 2);
    color textColor = color(255);
    for (int i = letterDisplayStartIndex; i < letterDisplayEndIndex; i++) {
      if (i >= 0 && i < currentMessage.message.length()) {
        renderLetter(pixelWindow.leftPane, currentMessage.message.charAt(i), textX, textY + i * (LETTER_HEIGHT + 2), textColor, true);
      }
    }
  }
  
  void doAsyncWork() {
    GetRequest get = new GetRequest("https://" + env.get("SERVER_ADDRESS") + "/currentMessage");
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
}