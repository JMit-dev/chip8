class Keyboard {
  constructor() {
    this.keysPressed = new Set();
    this.onNextKeyPress = null;

    // CHIP-8 keypad mapping to QWERTY keyboard
    this.keyMap = {
      '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
      'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
      'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
      'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
    };

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    const key = this.keyMap[event.key.toLowerCase()];
    if (key !== undefined) {
      this.keysPressed.add(key);

      if (this.onNextKeyPress) {
        this.onNextKeyPress(key);
        this.onNextKeyPress = null;
      }
    }
  }

  handleKeyUp(event) {
    const key = this.keyMap[event.key.toLowerCase()];
    if (key !== undefined) {
      this.keysPressed.delete(key);
    }
  }

  isKeyPressed(keyCode) {
    return this.keysPressed.has(keyCode);
  }

  getKeysPressed() {
    return Array.from(this.keysPressed);
  }
}
