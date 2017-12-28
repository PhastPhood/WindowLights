color getColorWithAlpha(color originalColor, int alpha) {
  return (originalColor & 0xffffff) | (alpha << 24);
}

int LETTER_WIDTH = 3;
int LETTER_HEIGHT = 5;
PImage FONT;
PImage REVERSE_FONT;


void renderLetter(PGraphics canvas, char letter, int letterX, int letterY, color c) {
  renderLetter(canvas, letter, letterX, letterY, c, false);
}

void renderLetter(PGraphics canvas, char letter, int letterX, int letterY, color c, boolean reverse) {
  int letterIndex = (int) letter;
  if (letterIndex >= 128) {
    return;
  }
  canvas.tint(c);
  if (!reverse) {
    int letterPosX = (letterIndex % 32) * (LETTER_WIDTH + 1);
    int letterPosY = (int) (letterIndex / 32) * (LETTER_HEIGHT + 1);
    canvas.image(FONT.get(letterPosX, letterPosY, LETTER_WIDTH + 1, LETTER_HEIGHT + 1), letterX, letterY);
  } else {
    int letterPosX = (31 - letterIndex % 32) * (LETTER_WIDTH + 1);
    int letterPosY = (int) (letterIndex / 32) * (LETTER_HEIGHT + 1);
    canvas.image(REVERSE_FONT.get(letterPosX, letterPosY, LETTER_WIDTH + 1, LETTER_HEIGHT + 1), letterX, letterY);
  }
}
